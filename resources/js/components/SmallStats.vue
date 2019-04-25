<template>
  <div class="stats-small stats-small--1 card card-small">
    <div class="card-body p-0 d-flex">
      <div class="d-flex flex-column m-auto">
        <div class="stats-small__data text-center">
          <span class="stats-small__label text-uppercase text-dark">{{ stateblockname }}</span>
          <h6 class="stats-small__value count my-2 text-center">${{ statevalue }} M</h6>
          <span :class="['stats-small__percentage', percentagestatus,statusColor ]">{{ percentage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import commonJs from "../util/common";

  export default {

    name: "SmallStatsBlock",

    data() {
      return {
        statevalue: 0,
        percentagestatus: "",
        percentage: '',
        statusColor: ''
      }
    },

    props: {
      stateblockname: {
        type: String,
        required: true,
        default: "",
      },
      blockConfig: {
        type: String,
        required: true,
      },
      data: {
        type: Array,
        required: false,
        defalut: [],
      },
      prior: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      filterApplied: {
        type: String
      }
    },

    watch: {
      filterApplied() {
        this.getBlockDetails();
      },
      data() {
        this.getBlockDetails();
      },
      date() {
        this.getBlockDetails();
      },
      prior() {
        this.getBlockDetails();
      },
    },

    computed: {
      hasFilter() {
        return this.$store.state.filterData && this.$store.state.filterData.data;
      }
    },

    methods: {
      getpercentage(currentvalue, previousValue) {
        let result;
        if(currentvalue > previousValue){
        result = ((currentvalue - previousValue) / currentvalue) * 100;
        }else{
        result = ((previousValue - currentvalue) / previousValue) * 100;  
        }
        return result;
      },

      getBlockDetails() {
        if (!this.data) return;
        let currentPeriod = 0;
        let previousPeriod = 0;
        const prior = this.prior;
        const date = this.date;
        const prevdate = commonJs.getDate("getPreviousDate", date);
        const prevYear = commonJs.getDate("getPreviousYear", date);
        const currentYear = commonJs.getDate("getCurrentYear", date);
        const currentMonth = commonJs.getDate("getCurrentMonth", date);
        const getCurrentQuarterStartMonth = commonJs.getDate("getCurrentQuarterStartMonth", date);
        const getCurrentQuarterYear = commonJs.getDate("getCurrentQuarterYear", date);
        const getPreviousQuarterStartMonth = commonJs.getDate("getPreviousQuarterStartMonth", date);
        const getPreviousQuarterYear = commonJs.getDate("getPreviousQuarterYear", date);
        const getPreviousQuarteEndMonth = commonJs.getDate("getPreviousQuarteEndMonth", date);
        let filterName = '';
        let filterValue = '';
        if (this.hasFilter) {
          filterName = this.hasFilter.name;
          filterValue = this.hasFilter.value;
        }
        if (filterName === "") {
          this.data.forEach(jsondata => {
            const yearInJson = commonJs.getDate("getCurrentYear", jsondata.Date) * 1;
            const monthInJson = commonJs.getDate("getCurrentMonth", jsondata.Date) * 1;
            const datavalue = jsondata[this.blockConfig];
            if (prior === "Month") {
              if (date === jsondata.Date) {
                currentPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
              if (prevdate === jsondata.Date) {
                previousPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
            }
            if (prior === "Quarter") {
              if ((getCurrentQuarterYear === yearInJson) && (monthInJson <= currentMonth) && (monthInJson >= getCurrentQuarterStartMonth)) {
                currentPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
              if ((getPreviousQuarterYear === yearInJson) && (monthInJson >= getPreviousQuarterStartMonth) && (monthInJson <= getPreviousQuarteEndMonth)) {
                previousPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
            }
            if (prior === "Year") {
              if ((currentYear === yearInJson) && (monthInJson <= currentMonth)) {
                currentPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
              if (prevYear === yearInJson) {
                previousPeriod += commonJs.removeSpecialCharacters(datavalue);
              }
            }
          });
        } else {
          this.data.forEach(jsondata => {
            if (jsondata[filterName] === filterValue) {
              const yearInJson = commonJs.getDate("getCurrentYear", jsondata.Date) * 1;
              const monthInJson = commonJs.getDate("getCurrentMonth", jsondata.Date) * 1;
              const datavalue = jsondata[this.blockConfig];
              if (prior === "Month") {
                if (date === jsondata.Date) {
                  currentPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
                if (prevdate === jsondata.Date) {
                  previousPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
              }
              if (prior === "Quarter") {
                if ((getCurrentQuarterYear === yearInJson) && (monthInJson <= currentMonth) && (monthInJson >= getCurrentQuarterStartMonth)) {
                  currentPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
                if ((getPreviousQuarterYear === yearInJson) && (monthInJson >= getPreviousQuarterStartMonth) && (monthInJson <= getPreviousQuarteEndMonth)) {
                  previousPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
              }
              if (prior === "Year") {
                if ((currentYear === yearInJson) && (monthInJson <= currentMonth)) {
                  currentPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
                if (prevYear === yearInJson) {
                  previousPeriod += commonJs.removeSpecialCharacters(datavalue);
                }
              }
            }
          });
        }
        this.statevalue = commonJs.convertIntoMillion(currentPeriod + previousPeriod);
        if (previousPeriod > 0) {
          this.percentage = `( ${this.getpercentage(currentPeriod , previousPeriod).toFixed(2)}% )`;
          if (currentPeriod > previousPeriod) {
            this.statusColor = "profit";
            this.percentagestatus = "stats-small__percentage--increase";
          } else {
            this.statusColor = "loss";
            this.percentagestatus = "stats-small__percentage--decrease";
          }
        } else {
          this.percentage = "";
          this.statusColor = "";
          this.percentagestatus = "";
        }
      },
    }
  }
</script>