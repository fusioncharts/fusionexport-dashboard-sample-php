<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use FusionExport\ExportManager;
use FusionExport\ExportConfig;
use Aws\Common\Aws;
use Aws\S3\S3Client;
use Aws\Ses\SesClient;

class ExportController extends Controller
{
    public function __construct()
    {
        $this->s3Client = new S3Client([
            'version' => '2006-03-01',
            'region' => 'eu-west-1'
        ]);

        $this->sesClient = new SESClient([
            'version' => '2010-12-01',
            'region' => 'eu-west-1'
        ]);

        $this->singlePageTemplate = file_get_contents(__DIR__ . '/templates/single.html');
        $this->mailTemplate = file_get_contents(__DIR__ . '/templates/mail.html');

        $this->imgLocMap = [
            'chart-container-map' => 'chart_image_0',
            'chart-container-top-adv' => 'chart_image_1',
            'chart-container-reg' => 'chart_image_2',
            'chart-container-reg-monthly' => 'chart_image_3',
            'chart-container-product' => 'chart_image_4',
        ];

        $this->chartDimMap = [
            'chart-container-map' => [
              'width' => 1200,
              'height' => 600,
            ],
            'chart-container-top-adv' => [
              'width' => 600,
              'height' => 400,
            ],
            'chart-container-reg' => [
              'width' => 600,
              'height' => 400,
            ],
            'chart-container-reg-monthly' => [
              'width' => 600,
              'height' => 400,
            ],
            'chart-container-product' => [
              'width' => 600,
              'height' => 400,
            ],
        ];
    }

    public function downloadDashboard(Request $request)
    {
        $headerText = $request->input('headerText');
        $chartConfigs = $request->input('chartConfigs');

        $tmpl = str_replace('<%= headerText %>', $headerText, $this->singlePageTemplate);
        $tmplFile = tempnam(sys_get_temp_dir(), 'fe-');
        file_put_contents($tmplFile, $tmpl);
        $exportManager = new ExportManager();
        $exportConfig = new ExportConfig();
        $exportConfig->set('chartConfig', $chartConfigs);

        $exportConfig->set('templateFilePath', $tmplFile);
        $exportConfig->set('type', 'pdf');
        $files = $exportManager->export($exportConfig, sys_get_temp_dir(), true);

        return response()->download($files[0]);
    }

    public function mailDashboard(Request $request)
    {
        $parsedConfigs = $request->input('chartConfigs');
        $filter = $request->input('filter');
        $headerText = $request->input('headerText');
        $mailId = $request->input('mailId');

        $files = $this->convertChartConfigsToImages($parsedConfigs);

        $fileUrls = $this->uploadFilesToS3($files);

        $templateContent = $this->buildMailTemplate($fileUrls, $parsedConfigs, $headerText, (object) $filter);

        $this->sendMail($templateContent, $mailId);
    }

    private function convertChartConfigsToImages($chartConfigs)
    {
        $chartConfigs = array_map(function ($config) {
            $config = (object) $config;
            $config->width = $this->chartDimMap[$config->renderAt]['width'];
            $config->height = $this->chartDimMap[$config->renderAt]['height'];
            return $config;
        }, $chartConfigs);

        $exportManager = new ExportManager();
        $exportConfig = new ExportConfig();

        $exportConfig->set('chartConfig', $chartConfigs);
        $exportConfig->set('quality', 'good');
        $exportConfig->set('type', 'png');

        return $exportManager->export($exportConfig, sys_get_temp_dir(), true);
    }

    private function uploadFilesToS3($files)
    {
        $slotSep = date('ym');
        $fileUrls = [];

        foreach ($files as $file) {
            $randomName = basename(tempnam('', 'fe-php-mail-')).'.png';
            $bucket = 'fusionexport-mail-images';
            $key = $slotSep.'/'.$randomName;
            $url = 'https://s3-eu-west-1.amazonaws.com/'.$bucket.'/'.$key;

            $params = [
                'ACL' => 'public-read',
                'Body' => file_get_contents($file),
                'ContentType' => 'image/png',
                'Bucket' => $bucket,
                'Key' => $key
            ];

            $fileUrls[] = $url;
            $this->s3Client->putObject($params);
        }

        return $fileUrls;
    }

    private function buildMailTemplate ($fileUrls, $configs, $headerText, $filter)
    {
        $getHeader = function ($measure, $chart) {
            return $measure.' By '.$chart;
        };

        $templateData = [
          'headerText' => $headerText,
          'stateHeader' => $getHeader($filter->measure, 'State'),
          'topAdvisorHeader' => $getHeader($filter->measure, 'Top Advisor'),
          'regionHeader' => $getHeader($filter->measure, 'Region'),
          'timeHeader' => $getHeader($filter->measure, 'Time'),
          'productHeader' => $getHeader($filter->measure, 'Product'),
        ];

        foreach ($configs as $idx => $config) {
            $url = $fileUrls[$idx];
            $templateData[$this->imgLocMap[$config['renderAt']]] = $url;
        }

        $tmpl = $this->mailTemplate;
        foreach ($templateData as $key => $val) {
            $tmpl = str_replace('<%= '.$key.' %>', $val, $tmpl);
        }

        return $tmpl;
    }

    private function sendMail($templateContent, $mailId)
    {
        $mailParams = [
            'Destination' => [
                'ToAddresses' => [$mailId]
            ],
            'Message' => [
                'Body' => [
                    'Html' => [
                        'Charset' => 'UTF-8',
                        'Data' => $templateContent,
                    ],
                ],
                'Subject' => [
                    'Charset' => 'UTF-8',
                    'Data' => 'Wealth Management Dashboard using FusionExport'
                ]
            ],
            'Source' => 'Nihar Sawant <nihar@fusioncharts.com>',
        ];

        return $this->sesClient->sendEmail($mailParams);
    }
}
