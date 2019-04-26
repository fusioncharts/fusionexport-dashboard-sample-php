<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use FusionExport\ExportManager;
use FusionExport\ExportConfig;

class ExportController extends Controller
{
    public function __construct() {
        $this->singlePageTemplate = file_get_contents(__DIR__ . '/templates/single.html');
    }

    public function singlepage(Request $request)
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
}
