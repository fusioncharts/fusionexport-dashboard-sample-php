<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light bg-gradinent sticky-top">
      <a class="navbar-brand text-white title-margin logo" href="#" >Wealth Management</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="row container-filter">
          <div class="col-sm-12 col-md-4">
            <div class="text-center py-2 pb-3">
              <span class="text-white text-center">Select Measure</span>
              <select class="custom-select custom-select-sm mt-1 text-center select-boxes1" style=""
              v-model="measure"
              @change="getMeasureSelector()">
                  <option value="Asset Under Management" selected>Asset Under Management</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Sales">Sales</option>
                  <option value="New Net Money">Net New Money</option>
                  <option value="ACATS">ACATS</option>
                  <option value="FAS">FAS</option>
              </select>
            </div>
          </div>
          <div class="col-sm-12 col-md-4 ">
            <div class="text-center py-2">
              <span class="text-white text-center">Compare to Prior</span>
              <select class="custom-select custom-select-sm mt-1 text-center select-boxes2" style=""
              v-model="prior" @change="getPriorSelector()">
                  <!-- <option selected="" value="Year">Year</option> -->
                  <option value="Quarter">Quarter</option>
                  <option value="Month">Month</option>
              </select>
            </div>
          </div>
          <div class="col-sm-12 col-md-4 ">
            <div class="text-center py-2">
              <span class="text-white text-center">Choose {{ prior }} for Comparision</span>
              <select v-if="prior=='Month'" class="custom-select custom-select-sm mt-1 text-center select-boxes3"
              v-model="date" @change="getdateSelector()">
                <option value="1-1-2011">Jan-2011</option>
                <option value="2-1-2011">Feb-2011</option>
                <option value="3-1-2011">Mar-2011</option>
                <option value="4-1-2011">Apr-2011</option>
                <option value="5-1-2011">May-2011</option>
                <option value="6-1-2011">Jun-2011</option>
                <option value="7-1-2011">Jul-2011</option>
                <option value="8-1-2011">Aug-2011</option>
                <option value="9-1-2011">Sep-2011</option>
                <option value="10-1-2011">Oct-2011</option>
                <option value="11-1-2011">Nov-2011</option>
                <option value="12-1-2011">Dec-2011</option>
                <option value="1-1-2012">Jan-2012</option>
                <option value="2-1-2012">Feb-2012</option>
                <option value="3-1-2012">Mar-2012</option>
                <option value="4-1-2012">Apr-2012</option>
                <option value="5-1-2012">May-2012</option>
                <option value="6-1-2012">Jun-2012</option>
                <option value="7-1-2012">Jul-2012</option>
                <option value="8-1-2012">Aug-2012</option>
                <option value="9-1-2012">Sep-2012</option>
                <option value="10-1-2012">Oct-2012</option>
              </select>
              <select v-if="prior=='Quarter'" class="custom-select custom-select-sm mt-1 text-center select-boxes3"
              v-model="date" @change="getdateSelector()">

                <option value="Q1-2011">Q1-2011</option>
                <option value="Q2-2011">Q2-2011</option>
                <option value="Q3-2011">Q3-2011</option>
                <option value="Q4-2011">Q4-2011</option>
                <option value="Q1-2012">Q1-2012</option>
                <option value="Q2-2012">Q2-2012</option>
                <option value="Q3-2012">Q3-2012</option>
                <option value="Q4-2012">Q4-2012</option>
              </select>
               
            </div>
          </div>
        </div>
      </div>
            <ExportHandle :filter="exportHandleFilter"/>
    </nav>
    
    <div class="container-fluid mt-4" style="margin-bottom: 100px;">
      <div class="row">
        <main class="main-content col-lg-12 col-md-12 col-sm-12 p-0">
          <div class="main-content-container container-fluid px-4">
            <div class="row">

              <div class="col-lg col-md-6 col-sm-6 mb-4">
                <SmallStatsBlock
                  stateblockname="Total Assets"
                  :data = "item"
                  :measureFilterValues = "measureFilterValues"
                  :prior = "prior"
                  :date = "selectedDate"
                  blockConfig = "AUM"
                  :filterApplied = filterApplied
                />
              </div>
              <div class="col-lg col-md-6 col-sm-6 mb-4">
                <SmallStatsBlock
                  stateblockname="Total Revenue"
                  :data = "item"
                  :measureFilterValues = "measureFilterValues"
                  :prior = "prior"
                  :date = "selectedDate"
                  blockConfig = "Revenue"
                  :filterApplied = filterApplied
                />
              </div>
              <div class="col-lg col-md-4 col-sm-6 mb-4">
                <SmallStatsBlock
                  stateblockname="Total Sales"
                  :data = "item"
                  :measureFilterValues = "measureFilterValues"
                  :prior = "prior"
                  :date = "selectedDate"
                  blockConfig = "Sales"
                  :filterApplied = filterApplied
                />
              </div>
              <div class="col-lg col-md-4 col-sm-6 mb-4">
                <SmallStatsBlock
                  stateblockname="Total ACAT"
                  :data = "item"
                  :measureFilterValues = "measureFilterValues"
                  :prior = "prior"
                  :date = "selectedDate"
                  blockConfig = "ACAT"
                  :filterApplied = filterApplied
                />
              </div>
              <div class="col-lg col-md-4 col-sm-12 mb-4">
                <SmallStatsBlock
                  stateblockname="Total FAS"
                  :data = "item"
                  :measureFilterValues = "measureFilterValues"
                  :prior = "prior"
                  :date = "selectedDate"
                  blockConfig = "FA"
                  :filterApplied = filterApplied
                />
              </div>
            </div>
            <!-- End Small Stats Blocks -->
            <!-- Chart Area -->
                 <ExportHandle :filter="exportHandleFilter"/>
            <div class="row">

              <div class="col-lg-6 col-md-12 col-sm-12 mb-4">
                <RenderChart
                    containertitle='State'
                    :measure = 'measure'
                    :data = "item"
                    :measureFilterValues = "measureFilterValues"
                    :prior = "prior"
                    :date = "selectedDate"
                    :mapConfig = "statewiseMapConfig"
                    containerId = "state"
                    :filterApplied = filterApplied
                    :currentMesure = currentMesure
                    :previousMeasure = previousMeasure
                />
              </div>

              <div class="col-lg-6 col-md-12 col-sm-12 mb-4">
                <RenderChart
                    containertitle='Top Advisors'
                    :measure = 'measure'
                    :data = "item"
                    :measureFilterValues = "measureFilterValues"
                    :prior = "prior"
                    :date = "selectedDate"
                    :mapConfig = "advisorwiseMapConfig"
                    containerId = "advisors"
                    :filterApplied = filterApplied
                    :currentMesure = currentMesure
                    :previousMeasure = previousMeasure
                />
              </div>

              <div class="col-lg-4 col-md-12 col-sm-12 mb-4">
                <RenderChart
                    containertitle='Region'
                    :measure = 'measure'
                    :data = "item"
                    :measureFilterValues = "measureFilterValues"
                    :prior = "prior"
                    :date = "selectedDate"
                    :mapConfig = "regionwiseMapConfig"
                    containerId = "regionswise"
                    :filterApplied = filterApplied
                    :currentMesure = currentMesure
                    :previousMeasure = previousMeasure
                />
              </div>

              <div class="col-lg-4 col-md-12 col-sm-12 mb-4">
                <RenderChart
                    containertitle='Time'
                    :measure = 'measure'
                    :data = "item"
                    :measureFilterValues = "measureFilterValues"
                    :prior = "prior"
                    :date = "selectedDate"
                    :mapConfig = "regionwiseMonthlyMapConfig"
                    containerId = "overtime"
                    :filterApplied = filterApplied
                    :currentMesure = currentMesure
                    :previousMeasure = previousMeasure
                />
              </div>

              <div class="col-lg-4 col-md-12 col-sm-12 mb-4">
                  <RenderChart
                    containertitle='Product'
                    :measure = 'measure'
                    :data = "item"
                    :prior = "prior"
                    :date = "selectedDate"
                    :measureFilterValues = "measureFilterValues"
                    :mapConfig = "productwiseMapConfig"
                    containerId = "product"
                    :filterApplied = filterApplied
                    :currentMesure = currentMesure
                    :previousMeasure = previousMeasure
                  />
              </div>
           
            </div>
            <!-- End Chart Area -->
          </div>
        </main>
      </div>
    </div>

  </div>
</template>

<script>

import PageHeader from "./PageHeader.vue";
import RenderChart from "./RenderChart.vue";
import SmallStatsBlock from "./SmallStats.vue";
import ExportHandle from './ExportHandle.vue';
import commonJs from "../util/common";

const baseUrl = process.env.BASE_URL || '';

export default {
  name: "WealthManagementDashboard",
  data() {
    return {
      filterApplied : '',
      isLoading : true ,
      item : [],
      pageheaderdata: {
        pageName: "Dashboard",
        dashboardName: "Wealth Management"
      },
      measure: "Asset Under Management",
      prior: "Month",
      date: "2-1-2011",
      selectedDate: '2-1-2011',
      measureFilterValues: {
        currentParam: "AUM",
        prevParam: "PreviousPeriodAUM"
      },
      statewiseMapConfig: {
        charttype: "usa",
        renderat: "chart-container-map",
        dataKey: "uniqueStates",
        filterElement: "State",
        yAxis: "States",
        xAxis: "Amount (In USD)",
        theme: "fusion",
        seriesname1: "Current Period",
        seriesname2: "Previous Period",
        minheight: "min-height:350px"
      },
      advisorwiseMapConfig: {
        charttype: "scrollcombidy2d",
        renderat: "chart-container-top-adv",
        dataKey: "uniqueAdvisors",
        filterElement: "Advisor",
        yAxis: "Advisors",
        xAxis: "Amount (In USD)",
        theme: "fusion",
        seriesname1: "Current Period",
        seriesname2: "Previous Period",
        minheight: "min-height:350px"
      },
      regionwiseMapConfig: {
        charttype: "overlappedBar2d",
        renderat: "chart-container-reg",
        dataKey: "uniqueRegions",
        filterElement: "Region",
        yAxis: "Regions",
        xAxis: "Amount (In USD)",
        theme: "fusion",
        seriesname1: "Current Period",
        seriesname2: "Previous Period",
        minheight: "min-height:304px"
      },
      regionwiseMonthlyMapConfig: {
        charttype: "msline",
        renderat: "chart-container-reg-monthly",
        dataKey: "uniqueRegions",
        filterElement: "Region",
        yAxis: "Regions",
        xAxis: "  ",
        theme: "fusion",
        seriesname1: "Current Period",
        seriesname2: "Previous Period",
        minheight: "min-height:304px"
      },
      productwiseMapConfig: {
        charttype: "overlappedBar2d",
        renderat: "chart-container-product",
        dataKey: "uniqueProduct",
        filterElement: "Product",
        yAxis: "Products",
        xAxis: "Amount (In USD)",
        theme: "fusion",
        seriesname1: "Current Period",
        seriesname2: "Previous Period",
        minheight: "min-height:304px"
      },
      quarterDate:{
        Q1 : 3,
        Q2 : 6,
        Q3 : 9,
        Q4 : 12
      },
      lastSelectedDate :'2-1-2011',
      currentMesure:"Feb'11",
      previousMeasure : "Jan'11",
    };
  },

  async created() {
    fetch(`${baseUrl}/output.json`).then(response => {
      return response.json().then(json => {
        this.item= json;
      })
    })
  },
  computed: {
    hasFilter () {
      return this.$store.state.filterData && this.$store.state.filterData.data.value;
    },
    exportHandleFilter() {
      return {
        measure: this.measure,
        prior: this.prior,
        date: this.date,
      }
    }
  },

  watch:{
    hasFilter()
    {
        this.setFilter();
    }
  },

  components: {
    RenderChart,
    SmallStatsBlock,
    PageHeader,
    ExportHandle,
  },

  methods: {
    async exportClickListener(evt) {
            const button = evt.currentTarget;
            const icon = button.querySelector('i.icn');
            const downloadIconClass = 'icn-download';
            const loadingIconClass = 'icn-loading';

            button.disabled = true;
            icon.classList.replace(downloadIconClass, loadingIconClass);

            await this.exportDashboard();

            button.disabled = false;
            icon.classList.replace(loadingIconClass, downloadIconClass);
        },

        async exportDashboard() {
            const url = `${baseUrl}/export/download-dashboard`;
            const headerText = this.getHeaderText();
            const chartConfigs = Object.values(this.chartConfig);

            const res = await axios.post(url, {
                headerText,
                chartConfigs,
            }, {
                responseType: 'blob'
            });

            download(res.data, 'Wealth Dashboard.pdf', 'application/pdf');
        },

        getHeaderText() {
            const measure = this.data.filter.measure;
            const prior = this.data.filter.prior;
            let date = this.data.filter.date;

            if (prior === 'Month') {
                date = moment(date, 'MM-DD-YYYY').format('MMMM YYYY');
            }

            return `${measure} for ${date}`;
        },

    setFilter(){
      this.filterApplied = this.hasFilter;
    },
    getMeasureSelector() {
      this.measure = this.measure;

      if (this.measure === "Asset Under Management") {
        this.measureFilterValues.currentParam = "AUM";
      }
      if (this.measure === "Revenue") {
        this.measureFilterValues.currentParam = "Revenue";
      }
      if (this.measure === "Sales") {
        this.measureFilterValues.currentParam = "Sales";
      }
      if (this.measure === "ACATS") {
        this.measureFilterValues.currentParam = "ACAT";
      }
      if (this.measure === "FAS") {
        this.measureFilterValues.currentParam = "FA";
      }
      if (this.measure === "New Net Money") {
        this.measureFilterValues.currentParam = "NewNetMoney";
      }
    },

    getdateSelector() {
      this.date = this.date;
      this.prior = this.prior;
      if(this.prior === "Month"){
        this.date = this.date;
        this.selectedDate = this.date;
        const prevdate = commonJs.getDate("getPreviousDate", this.date);
        this.previousMeasure = commonJs.getDate('changedDateFormatForTooltip',prevdate);
        this.currentMesure = commonJs.getDate('changedDateFormatForTooltip',this.selectedDate);
      }else{
        const dateArray = this.date.split("-");
        this.selectedDate = `${this.quarterDate[dateArray[0]]}-1-${dateArray[1]}`;
        this.getPreviousQuarter(this.date);
        this.currentMesure = this.date.replace("-"," ");
      }
    },

    getPreviousQuarter(date){
      const dateArray = this.date.split("-");
      const quarterCount  = date.substr(1,1)*1;
      let getPreviousQuarter;
      if(quarterCount === 1){
        const year = dateArray[1]-1;
        const quarter = 'Q4 ';
        getPreviousQuarter = quarter+year;
      }else{
        const year = dateArray[1];
        const quarter = quarterCount-1;
        getPreviousQuarter = `Q${quarter} ${year}`;
      }
      this.previousMeasure = getPreviousQuarter;
    },

    getPriorSelector() {
      this.prior = this.prior;
      if(this.prior === "Month"){
        this.date = this.lastSelectedDate;
        const prevdate = commonJs.getDate("getPreviousDate", this.date);
        this.previousMeasure = commonJs.getDate('changedDateFormatForTooltip',prevdate);
        this.currentMesure = commonJs.getDate('changedDateFormatForTooltip',this.lastSelectedDate);
      }else{
        this.lastSelectedDate = this.date;
        const dateArray = this.date.split("-");
        let quarter;
        let month ;
        for(month in this.quarterDate){
          if(dateArray[0] <= this.quarterDate[month]){
            quarter  = month;
            break;
          }
        }
        this.selectedDate = `${this.quarterDate[month]}-1-${dateArray[2]}`;
        this.date = `${quarter}-${dateArray[2]}`;
        this.currentMesure = `${quarter} ${dateArray[2]}`;
        this.getPreviousQuarter(this.date)
      }
    },

  }
};
</script>

