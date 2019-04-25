<template>
  <div :id="containerId" class="h-100">
   <div class="card card-small">
      <div class="card-header">
        <div class="heading-wrpaaer">
          <img v-if="showUndo && hasFilter && hasFilter.container === containerId"  class="float-left undo" title="undo" src="../../images/undo.svg" @click="revertFilter()" />
          <h6  class="mt-2 mb-0 text-center container-name">{{ measure }} By {{ containertitle }} </h6>
          <h6 v-if="showUndo && hasFilter && hasFilter.container === containerId"  class="text-center selected-item text-center selected-text">{{ selectedItem }} </h6>
        </div>
      </div>
      <div class="card-body mt-0 pt-0" :style="mapConfig.minheight">
        <div :id="mapConfig.renderat" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import FusionCharts from "fusioncharts/core";
  import overlappedBar2d from 'fusioncharts/viz/overlappedbar2d';
  import scrollcombidy2d from 'fusioncharts/viz/scrollcombidy2d';
  import msline from 'fusioncharts/viz/msline';
  import Maps from 'fusioncharts/maps';
  import usa from 'fusioncharts/maps/es/fusioncharts.usa';
  import commonJs from "../util/common";
  import chartCosmetics from "../util/chartCosmetics";

  FusionCharts.addDep(overlappedBar2d);
  FusionCharts.addDep(scrollcombidy2d);
  FusionCharts.addDep(msline);
  FusionCharts.addDep(Maps);
  FusionCharts.addDep(usa);

  export default {
    name: "RenderChart",
    data() {
      return {
        container: '',
        selectedItem: '',
        showUndo: false,
        sampleMessage: "FusionCharts XT will load here!",
        dataReceived: false,
        chartProp: {
          "outCnvBaseFont": "Verdana",
          "animation": "1",
          "showValues": "0",
          "numberPrefix": "$",
          "numberSuffix": "",
          "formatnumberscale": "1",
          "flatScrollBars": "1",
          "showToolTipShadow": "0",
          "showShadow": "0",
          "anchorHoverEffect": "0",
          "anchorHoverAnimation": "0",
          "showDivLineSecondaryValue": "0",
          "showSecondaryLimits": "0",
          "showcanvasborder": "0",
          "showBorder": "0",
          "bgAlpha": "0",
          "alternateHGridAlpha": "0",
          "alternateVGridAlpha": "0",
          "baseFontSize": "12",
          "rotateLabels": "1",
          "xAxisNameFontColor": "#999999",
          "xAxisNameFontBold": "0",
          "xAxisNameFontSize": "13",
          "yAxisNameFontColor": "#999999",
          "yAxisNameFontBold": "0",
          "yAxisNameFontSize": "13",
          "usePlotGradientColor": "0",
          "flatscrollbars": "0",
          "scrollColor": "#FFFFFF",
          "divlineAlpha": "15",
          "xAxisNamePadding": "10",
          "canvasPadding": "10",
          "labelPadding": "10",
          "tooltipPadding": "10",
          "useRoundEdges": "0",
          "showPlotBorder": "0",
          "showHoverEffect": "1",
          "barHoverAlpha": "100",
          "legendShadow" : "0",
          "legendBorderAlpha" : "0",
          "legendIconScale" : "0",
          // "drawCustomLegendIcon" : "1",
          "legendCaptionFontSize" : "16 "
        },
        filter: {
          name: '',
          value: ''
        },
        regionColor:{
          "West" : {
            "color" : "#8BBA01",
            "position" : "AUTO"
          },
          "Northeast" : {
            "color": "#F6BD10",
            "position" : "AUTO"
          },
          "Southeast" : {
            "color": "#AFD7F8",
            "position" : "AUTO"
          },
          "Midwest" : {
            "color":"#FFA166",
            "position" : "AUTO"
          }
        },
      }
    },
    props: {
      by: {
        type: String,
      },
      containerId: {
        type: String,
      },
      measure: {
        type: String,
      },
      containertitle: {
        type: String,
        required: false
      },
      data: {
        type: Array,
        required: false
      },
      measureFilterValues: {
        type: Object,
        required: true
      },
      mapConfig: {
        type: Object,
        required: true
      },
      prior: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required: true
      },
      filterApplied: {
        type: String,
      },
      currentMesure :{
        type : String,
      },
      previousMeasure :{
        type : String,
      }

    },
    watch: {
      filterApplied() {
        this.getData();
      },
      data() {
        this.getData();
      },
      measure() {
        this.getData();
      },
      date() {
        this.getData();
      },
      prior() {
        this.getData();
      },
    },
    computed: {
      hasFilter() {
        return this.$store.state.filterData && this.$store.state.filterData.data;
      }
    },
    methods: {

      ...mapActions({
        setChartConfig: 'SET_CHART_CONFIG',
      }),

      getData() {
        const filteredData = this.getUniqueRegionsProductsStatesAdvisors();
        const mapMarkers = [{
            "id": "Washington",
            "x": "78.23",
            "y": "43.9",
          },
          {
            "id": "Oregon",
            "x": "83.23",
            "y": "100.9",
          },
          {
            "id": "Colorado",
            "x": "267.23",
            "y": "185.9",
          },
          {
            "id": "New Mexico",
            "x": "263.23",
            "y": "260.9",
          },
          {
            "id": "Ohio",
            "x": "550.23",
            "y": "166.9",
          },
          {
            "id": "Pennsylvania",
            "x": "612.23",
            "y": "155.9",
          },
          {
            "id": "Virginia",
            "x": "600.23",
            "y": "207.9",
          },
          {
            "id": "South Carolina",
            "x": "571.23",
            "y": "270.9",
          }
        ];
        const mapData = [{
            "id": "WA",
            "name": "Washington"
          },
          {
            "id": "OR",
            "name": "Oregon"
          },
          {
            "id": "CO",
            "name": "Colorado"
          },
          {
            "id": "NM",
            "name": "New Mexico"
          },
          {
            "id": "OH",
            "name": "Ohio"
          },
          {
            "id": "PA",
            "name": "Pennsylvania",
          },
          {
            "id": "VA",
            "name": "Virginia",
          },
          {
            "id": "SC",
            "name": "South Carolina",
          }
        ];
        const uniqueArray = filteredData[this.mapConfig.dataKey];
        const date = this.date;
        const prevdate = commonJs.getDate("getPreviousDate", date);
        const prevYear = commonJs.getDate("getPreviousYear", date);
        const currentYear = commonJs.getDate("getCurrentYear", date);
        const currentMonth = commonJs.getDate("getCurrentMonth", date);
        const getCurrentQuarterStartMonth = commonJs.getDate("getCurrentQuarterStartMonth", date);
        const getCurrentQuarterYear = commonJs.getDate("getCurrentQuarterYear", date);
        const getPreviousQuarterStartMonth = commonJs.getDate("getPreviousQuarterStartMonth", date);
        const getPreviousQuarterYear = commonJs.getDate("getPreviousQuarterYear", date);
        const getPreviousQuarteEndMonth = commonJs.getDate("getPreviousQuarteEndMonth",date);
        const uniqueSortedData = [];
        let labelForMonths = "";
        let label = "";
        let finalLabel = "";
        let dataSet1 = "";
        let finalDataSet1 = "";
        let dataSet2 = "";
        let finalDataSet2 = "";
        let dataSet3 = "";
        let finalDataSet3 = "";
        let annotations1 = "";
        let annotations2 = "";
        let finaldatasetforlinechart = "";
        let datasetelm = "";
        let anootations = "";
        let currentPeriod;
        let previousPeriod;
        let chartDataObj;
        let elementName;
        let elementinJson;
        let yearInJson;
        let  monthInJson;
        let extraPadding;
        if (filteredData) {
          uniqueArray.forEach(unique => {
            currentPeriod = 0;
            previousPeriod = 0;
            chartDataObj = {};
            elementName = unique;
            let filterName = '';
            let filterValue = '';
            if (this.hasFilter) {
              filterName = this.hasFilter.name;
              filterValue = this.hasFilter.value;
            }
            if (filterName === "") {
              this.data.forEach(data => {
                elementinJson = data[this.mapConfig.filterElement];
                yearInJson = commonJs.getDate("getCurrentYear", data.Date);
                monthInJson = commonJs.getDate("getCurrentMonth", data.Date);
                if (elementinJson === elementName) {
                  if (this.prior === "Month") {
                    extraPadding = 50000;
                    labelForMonths = `[{ "label": "${date}" },{ "label": "${prevdate}" }]`;
                    if (date === data.Date) {
                      currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                    if (prevdate === data.Date) {
                      previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                  }
                  if (this.prior === "Quarter") {
                    extraPadding = 110000;
                    if ((getCurrentQuarterYear === yearInJson) && (monthInJson <= currentMonth) && (monthInJson >= getCurrentQuarterStartMonth)) {
                      currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                    if ((getPreviousQuarterYear === yearInJson) && (monthInJson >= getPreviousQuarterStartMonth) && (monthInJson <= getPreviousQuarteEndMonth)) {
                      previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                  }
                  if (this.prior === "Year") {
                    extraPadding = 380000;
                    if ((currentYear === yearInJson) && (monthInJson <= currentMonth)) {
                      currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                    if (prevYear === yearInJson) {
                      previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                    }
                  }
                }
              });
            } else {
              this.data.forEach(data => {
                if (data[filterName] === filterValue) {
                  elementinJson = data[this.mapConfig.filterElement];
                  yearInJson = commonJs.getDate("getCurrentYear", data.Date);
                  monthInJson = commonJs.getDate("getCurrentMonth", data.Date);
                  if (elementinJson === elementName) {
                    if (this.prior === "Month") {
                      extraPadding = 50000;
                      labelForMonths = `[{ "label": "${date}" },{ "label": "${prevdate}" }]`;
                      if (date === data.Date) {
                        currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                      if (prevdate === data.Date) {
                        previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                    }
                    if (this.prior === "Quarter") {
                      extraPadding = 110000;
                      if ((getCurrentQuarterYear === yearInJson) && (monthInJson <= currentMonth) && (monthInJson >= getCurrentQuarterStartMonth)) {
                        currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                      if ((getPreviousQuarterYear === yearInJson) && (monthInJson >= getPreviousQuarterStartMonth) && (monthInJson <= getPreviousQuarteEndMonth)) {
                        previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                    }
                    if (this.prior === "Year") {
                      extraPadding = 380000;
                      if ((currentYear === yearInJson) && (monthInJson <= currentMonth)) {
                        currentPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                      if (prevYear === yearInJson) {
                        previousPeriod += commonJs.removeSpecialCharacters(data[this.measureFilterValues.currentParam]);
                      }
                    }
                  }
                }
              });
            }
            chartDataObj[this.mapConfig.filterElement] = elementName;
            chartDataObj.currentPeriod = currentPeriod;
            chartDataObj.previousPeriod = previousPeriod;
            chartDataObj.tooltext = chartCosmetics.tooltipTemplate(elementName, this.measureFilterValues.currentParam, currentPeriod, previousPeriod, this.currentMesure , this.previousMeasure);
            uniqueSortedData.push(chartDataObj);
          });
          uniqueSortedData.sort((a, b) => {
            return (b.currentPeriod - a.currentPeriod);
          });

          uniqueSortedData.forEach((data, index) => {
            label = label.concat(chartCosmetics.dateSetTemplate("label", data[this.mapConfig.filterElement]), ",");
            dataSet1 = dataSet1.concat(`{ "value" : "${data.currentPeriod}" , "link" : "JavaScript:void(0)" , "tooltext" : "${data.tooltext}"  }`, ",");
            dataSet2 = dataSet2.concat(`{ "value" : "${data.previousPeriod}" , "link" : "JavaScript:void(0)" , "tooltext" : "${data.tooltext}" }`, ",");
            if (data.previousPeriod > 0) {;
              dataSet3 = dataSet3.concat(`{ "value" : "${data.currentPeriod+extraPadding}" , "link" : "JavaScript:void(0)", "tooltext" : "${data.tooltext}" , "anchorImageUrl" : "${data.currentPeriod >= data.previousPeriod ? chartCosmetics.green_arrow_up : chartCosmetics.red_arrow_down }", "anchorHoverEffect" : "0" }`, ",");
            }
            if (this.mapConfig.charttype === "usa") {
              mapData.map(mapdata => {
                if (mapdata.name === data.State) {
                  mapdata.tooltext = chartCosmetics.tooltipTemplate(data.State, this.measureFilterValues.currentParam, currentPeriod, previousPeriod, this.currentMesure , this.previousMeasure);
                  mapdata.showLabel = "1";
                  mapdata.link = "javascript:void(0)";
                  mapdata.color = "#5e64b3";
                  mapdata.showtooltip = "1";
                  mapdata.useHoverColor = "1";

                }else{
                  mapdata.showLabel = "1";
                  mapdata.showtooltip = "1";
                  mapdata.useHoverColor = "1";
                  mapdata.link = "javascript:void(0)";

                }
                return null;
              });
              if (data.previousPeriod > 0) {
                mapMarkers.map(marker => {
                  if (marker.id === data.State) {
                    if (currentPeriod >= previousPeriod) {
                      marker.shapeid = "profit";
                      marker.showToolTip = "1";
                    } else {
                      marker.shapeid = "loss";
                      marker.showToolTip = "1";
                    }
                    marker.tooltext = chartCosmetics.tooltipTemplate(data.State, this.measureFilterValues.currentParam, currentPeriod, previousPeriod, this.currentMesure , this.previousMeasure);
                    marker.link = "JavaScript:void(0)";
                    marker.showToolTip = "1";
                  }
                return null;
                });
              } else {
                mapMarkers.map(marker => {
                  if (marker.id === data.State) {
                    marker.shapeid = "nochange";
                    marker.tooltext = chartCosmetics.tooltipTemplate(data.State, this.measureFilterValues.currentParam, currentPeriod, previousPeriod, this.currentMesure , this.previousMeasure);
                    marker.link = "JavaScript:void(0)";
                    marker.showToolTip = "1";
                  }
                  return null;
                });
              }
            } else if (this.mapConfig.charttype === "msline") {
              if (this.prior === "Month") {
                let selectedDate = this.date;
                let output = "";
                let labels = "";
                for (let i = 0; i < 2; i+= 1) {
                  let showValue  = false;
                  if(i === 1){
                    showValue = true;
                  }
                  const changedDate = commonJs.getDate('changedDateFormatForTooltip',selectedDate);
                  labels = `{ "label" : "${changedDate}"},${labels}`;
                  output = this.getFilteredDateAndMeasureWiseData(selectedDate, data,showValue) + output;
                  selectedDate = commonJs.getDate("getPreviousDate", selectedDate);
                }
                labelForMonths = `[ ${labels.substring(0, labels.length-1)} ]`;
                datasetelm += `{ "seriesname": "${data.Region}" , "color" : "${this.regionColor[data.Region].color}", "data": [${output.slice(0,-1)}] },`;
              }else if(this.prior === "Year"){
                let selectedDate = this.date;
                let output = "";
                let labels = "";
                const countOfDays = commonJs.getDate("getDaysFromDates", selectedDate);
                for (let i = 0; i <= countOfDays; i+= 1) {
                  let showValue = false;
                  if(i === countOfDays){
                    showValue = true;
                  }
                  const changedDate = commonJs.getDate('changedDateFormatForTooltip',selectedDate);
                  labels = `{ "label" : "${changedDate}"},${labels}`;
                  output = this.getFilteredDateAndMeasureWiseData(selectedDate, data,showValue) + output;
                  selectedDate = commonJs.getDate("getPreviousDate", selectedDate);
                }
                labelForMonths = `[  ${labels.substring(0, labels.length-1)} ]`;
                datasetelm += `{ "seriesname": "${data.Region}", "color" : "${this.regionColor[data.Region].color}" , "data": [${output.slice(0,-1)}] },`;
              }else if(this.prior === "Quarter") {
                let selectedDate = this.date;
                let output = "";
                let labels = "";
                const countOfDays = commonJs.getDate("getDaysFromDates", selectedDate);
                for (let i = 0; i < 6; i+= 1) {
                  let showValue = false;
                  if(i === countOfDays){
                    showValue = true;
                  }
                  const changedDate = commonJs.getDate('changedDateFormatForTooltip',selectedDate);
                  labels = `{ "label" : "${changedDate}"},${labels}`;
                  output = this.getFilteredDateAndMeasureWiseData(selectedDate, data,showValue) + output;
                  selectedDate = commonJs.getDate("getPreviousDate", selectedDate);
                }
                labelForMonths = `[  ${labels.substring(0, labels.length-1)} ]`;
                datasetelm += `{ "seriesname": "${data.Region}", "color" : "${this.regionColor[data.Region].color}" , "data": [${output.slice(0,-1)}] },`;
              }
            } else if (this.mapConfig.charttype === "overlappedBar2d") {
              if (data.previousPeriod > 0) {
                annotations1 = annotations1.concat(chartCosmetics.annotationImageTemplate(
                  data[this.mapConfig.filterElement],
                  this.measureFilterValues.currentParam,
                  data.currentPeriod,
                  data.previousPeriod,
                  index, this.currentMesure , this.previousMeasure));
                annotations2 = annotations2.concat(chartCosmetics.annotationLineTemplate(index, this.currentMesure , this.previousMeasure));
              }
            }
          });

          finalLabel = `[ ${label.slice(0,-1)} ]`;
          finalDataSet1 = `[ ${dataSet1.slice(0,-1)} ]`;
          finalDataSet2 = `[ ${dataSet2.slice(0,-1)} ]`;
          finalDataSet3 = `[ ${dataSet3.slice(0,-1)} ]`;
          finaldatasetforlinechart = `[ ${datasetelm.slice(0,-1)} ]`;
          anootations = `[ ${annotations1 + annotations2.slice(0,-1)} ]`;
          const filterFor = this.mapConfig.filterElement;
          const renderAt = this.mapConfig.renderat;
          if (this.mapConfig.charttype === "usa") {
            this.renderFilterMap(filterFor, mapMarkers, mapData, renderAt);
          } else if (this.mapConfig.charttype === "msline") {
            this.renderFilterMultiLine(filterFor, labelForMonths, finaldatasetforlinechart, renderAt);
          } else if (this.mapConfig.charttype === "scrollcombidy2d") {
            this.renderFilterCombiChart(filterFor, finalLabel, finalDataSet1, finalDataSet2, finalDataSet3, anootations, renderAt);
          } else {
            this.renderFilterChart(filterFor, finalLabel, finalDataSet1, finalDataSet2, anootations, renderAt);
          }
        }
      },
      revertFilter() {
        this.showUndo = false;
        this.filter.name = '';
        this.filter.value = '';
        this.$store.commit('setFilter', {
          data: this.filter,
        });
      },
      getUniqueRegionsProductsStatesAdvisors() {
        let filterName = '';
        let filterValue = '';
        if (this.hasFilter) {
          filterName = this.hasFilter.name;
          filterValue = this.hasFilter.value;
        }
        const uniqueDatas = {};
        if (this.data) {
          const uniqueRegionsArray = [];
          const uniqueProductsArray = [];
          const uniqueStatesArray = [];
          const uniqueAdvisorsArray = [];
          this.data.forEach(data => {
            if (filterName === "") {
              if (!(uniqueRegionsArray.includes(data.Region)) && (data.Region)) {
                uniqueRegionsArray.push(data.Region);
              }
              if (!(uniqueProductsArray.includes(data.Product)) && (data.Product)) {
                uniqueProductsArray.push(data.Product);
              }
              if (!(uniqueStatesArray.includes(data.State)) && (data.State)) {
                uniqueStatesArray.push(data.State);
              }
              if (!(uniqueAdvisorsArray.includes(data.Advisor)) && (data.Advisor)) {
                uniqueAdvisorsArray.push(data.Advisor);
              }
            } else if(data[filterName] === filterValue){
                if (!(uniqueRegionsArray.includes(data.Region)) && (data.Region)) {
                  uniqueRegionsArray.push(data.Region);
                }
                if (!(uniqueProductsArray.includes(data.Product)) && (data.Product)) {
                  uniqueProductsArray.push(data.Product);
                }
                if (!(uniqueStatesArray.includes(data.State)) && (data.State)) {
                  uniqueStatesArray.push(data.State);
                }
                if (!(uniqueAdvisorsArray.includes(data.Advisor)) && (data.Advisor)) {
                  uniqueAdvisorsArray.push(data.Advisor);
                }
            }
            uniqueDatas.uniqueRegions = uniqueRegionsArray;
            uniqueDatas.uniqueProduct = uniqueProductsArray;
            uniqueDatas.uniqueStates = uniqueStatesArray;
            uniqueDatas.uniqueAdvisors = uniqueAdvisorsArray;
          });
        }
        return (uniqueDatas);

      },
      setFilterElement(name, label, containerName) {
        this.container = containerName;
        this.showUndo = true;
        this.filter.name = name;
        this.filter.value = label;
        this.filter.container = this.containerId;
        this.$store.commit('setFilter', {
          data: this.filter,
        });
      },
      renderFilterChart(filterFor, labels, finalDataSet1, finalDataSet2, anootations, renderAt) {
        const config = {
          "type": 'overlappedBar2d',
          "renderAt": renderAt,
          "width": "100%",
          "height": "100%",
          "dataFormat": "json",
          "dataSource": {
            "chart": {
              "xAxisName": '',
              "yAxisName": '',
              "theme": this.mapConfig.theme,
              "paletteColors": "#5F66B1",
              ...this.chartProp,
              "numDivLines" : "3",
              "divLineAlpha" : "4",
            },
            "categories": [{
              "category": JSON.parse(labels)
            }],
            "dataset": [{
                "id": "set1",
                "data": JSON.parse(finalDataSet1),
                // "seriesname": "Current Period"
              },
              {
                "id": "set2",
                "alpha": "0",
                "hoverAlpha": "0",
                "color": "#000000",
                "data": JSON.parse(finalDataSet2),
                // "seriesname": "Previous Period",
              }
            ],
            "annotations": {
              "showbelow": "0",
              "groups": [{
                "items": JSON.parse(anootations)
              }],
            },
          },
          events: {
            dataPlotClick: (event, arg) => {
              this.selectedItem = arg.categoryLabel;
              this.setFilterElement(filterFor, arg.categoryLabel, 'regionswise');
            },
            // dataPlotRollOver: function (event, arg) {
            //     console.log(event.data.index);
            // }
          }
        };
        const fusioncharts = new FusionCharts(config);
        fusioncharts.render();
        this.setChartConfig({
          key: this.containerId,
          config,
        });
      },
      renderFilterCombiChart(filterFor, labels, finalDataSet1, finalDataSet2, finalDataSet3, anootations, renderAt) {
        const config = {
          "type": 'scrollcombidy2d',
          "renderAt": renderAt,
          "width": "100%",
          "height": "100%",
          "dataFormat": "json",
         "dataSource": {
            "chart": {
              "caption": "",
              "subCaption": "",
              "xAxisName": '',
              "yAxisName": '',
              ...this.chartProp,
              "paletteColors": "#5F66B1",
              "legendPosition" : "RIGHT",
              "reverseLegend" : "1",
              "legendIconBorderColor" : "transparent",
              "legendIconBgColor" : "transparent",
              "legendIconStartAngle" : "90",
              "alignLegendWithCanvas" : "0"
            },
            "categories": [{
              "category": JSON.parse(labels)
            }],
            "dataset": [{
                "id": "set1",
                "color": "#5F66B1",
                "seriesname": "Current Period",
                "data": JSON.parse(finalDataSet1)
              },
              {
                "id": "set2",
                "seriesname": "Previous Period",
                "renderAs" : "line",
                "alpha": "1",
                "anchorRadius": "20",
                "anchorBgColor": "transparent",
                "anchorBorderColor": "#000000",
                "anchorBorderThickness" : "0",
                "anchorImageUrl": chartCosmetics.black_line,
                "anchorImageScale": "100",
                "color": "#000000",
                "hoverAlpha": "0",
                "data": JSON.parse(finalDataSet2)
              },
              // {
              //   "id": "set2",
              //   "renderAs": "area",
              //   "alpha": "0",
              //   "anchorRadius": "20",
              //   "anchorBgColor": "transparent",
              //   "anchorBorderColor": "none",
              //   "anchorImageScale": "100",
              //   "hoverAlpha": "0",
              //   "plotToolText": "$label <br> $seriesname $dataValue <br>",
              //   "data": JSON.parse(finalDataSet3)
              // },
            ],
          },
          events: {
            dataPlotClick: (event, arg) => {
              this.selectedItem = arg.categoryLabel;
              this.setFilterElement(filterFor, arg.categoryLabel, 'advisors');
            },
            // dataPlotRollOver: function (event, arg) {
            //     console.log("anik");
            // }
          }
        };
        const fusioncharts = new FusionCharts(config);
        fusioncharts.render();
        this.setChartConfig({
          key: this.containerId,
          config,
        });
      },
      renderFilterMap(filterFor, mapMarkers, mapData, renderAt) {
        const dataSource = {
          "chart": {
            "showCanvasBorder": "0",
            "showBorder": "1",
            "borderColor": "#FFFFFF",
            "showtooltip": "1",
            "showentityhovereffect": "0",
            "entityFillHoverColor": "#7e83c2",
            "fillColor": "#7e83c2",
            "baseFontColor": "#FFFFFF",
            "toolTipBgColor": "#FFFFFF",
            "toolTipColor": "#5A6169",
            "showToolTipShadow": "0",
            "showShadow": "0",
            "tooltipPadding": "10",
            "baseFontsize": "12",
            "showLabels" : "0",
            "showHoverEffect":"1"
          },
          "data": [
            ...mapData
          ],
          "markers": {
            "items": mapMarkers,
            "shapes": [{
                "id": "profit",
                "type": "image",
                "url": chartCosmetics.green_arrow_up,
              },
              {
                "id": "loss",
                "type": "image",
                "url": chartCosmetics.red_arrow_down,
              },
              {
                "id": "nochange",
                "type": "image",
                "url": chartCosmetics.yellow_arrow_right,
              }
            ]
          },
        };
        const config = {
          type: 'usa',
          renderAt: renderAt,
          width: "100%",
          height: "100%",
          dataFormat: "json",
          dataSource,
          "events": {
            "entityClick": (eventObj, dataObj) => {
              mapData.map(marker => {
                if (marker.id ===  dataObj.originalId) {
                  this.selectedItem = dataObj.label;
                  this.setFilterElement(filterFor, dataObj.label, 'state');
                }
              return null;
              });
            },
            "markerClick": (eventObj, dataObj) => {
              mapData.map(marker => {
                if (marker.name.toLowerCase() ===  dataObj.id.toLowerCase()) {
                  this.setFilterElement(filterFor, marker.name, 'state');
                }
              return null;
              });
            }
          }
        };
        new FusionCharts(config).render();
        this.setChartConfig({
          key: this.containerId,
          config,
        });
      },
      renderFilterMultiLine(filterFor, labelForMonths, finaldatasetforlinechart, renderAt) {
        const config = {
          type: "msline",
          renderAt: renderAt,
          width: "100%",
          height: "100%",
          dataFormat: "json",
          dataSource: {
            "chart": {
              "xAxisName": '',
              "yAxisName": '',
              ...this.chartProp,
              "anchorAlpha": "0",
              "showHoverEffect": "1",
              "anchorHoverEffect": "1",
              "anchorHoverAlpha": "100",
              "anchorHoverAnimation": "1",
              "rotateLabels": "0",
              "drawCrossLine": "1",
              "crossLineAnimation": "1",
              "showLegend":"1",
              "showValues" : "1",
              "numDivLines" : "3",
              "divLineAlpha" : "4",
              "labelPadding": "10",
               "crossLineAlpha" : "100"
            },
            "categories": [{
              "vLine": "true",
              "category": JSON.parse(labelForMonths),
            }],
            "dataset": JSON.parse(finaldatasetforlinechart)
          },
          events : {
            dataPlotClick: event => {
              this.selectedItem = event.data.datasetName;
              this.setFilterElement(filterFor, event.data.datasetName, 'regions');
            },
          }
        };
        const fusioncharts = new FusionCharts(config);
        fusioncharts.render();
        this.setChartConfig({
          key: this.containerId,
          config,
        });
      },
      getFilteredDateAndMeasureWiseData(date, region) {
        const measure = this.measureFilterValues.currentParam;
        let returnvalue = "";
        let filterName = '';
        let filterValue = '';
        if (this.hasFilter) {
          filterName = this.hasFilter.name;
          filterValue = this.hasFilter.value;
        }
        let value = 0;
        if (filterName !== "") {
          this.data.forEach(data => {
            if (data[filterName] === filterValue) {
              if ((region.Region === data.Region) && (date === data.Date)) {
                value += data[measure].replace("$", "").replace(/,/g, "").replace("M", "") * 1;
              }
            }
          });
        } else {
          this.data.forEach(data => {
            if ((region.Region === data.Region) && (date === data.Date)) {
              value += data[measure].replace("$", "").replace(/,/g, "").replace("M", "") * 1;
            }
          });
        }
        returnvalue = `{ "value" : "${value}" ,"showValue" : "0" ,  "valuePosition" : "${this.regionColor[region.Region].position}", "link" : "javascript:void(0)" },`;
        return (returnvalue);
      },
    },
  }
</script>
