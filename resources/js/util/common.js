const commonJs = {
  convertIntoMillion: value => {
    const convertedData = (value / 1000000).toFixed(2)
    return parseFloat(convertedData);
  },

  removeSpecialCharacters: value => {
    const trimmedvalue = value.replace('$', '').replace(/,/g, '').replace('M', '') * 1;
    return trimmedvalue;
  },

  getDate: (filter, date) => {
    const today = new Date(date);
    const quarter = Math.floor(today.getMonth() / 3);
    const finalDateRange = new Date("1/1/2011");
    const dateArray = date.split("-");
    const startFullQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    const startFullPrevQuarter = new Date(today.getFullYear(), quarter * 3 - 3, 1);
    const endFullQuarter  = new Date(startFullQuarter.getFullYear(), startFullQuarter.getMonth() + 3, 0);
    const diffDays = (today.getFullYear() * 12 + today.getMonth()) - (finalDateRange.getFullYear() * 12 + finalDateRange.getMonth());
    const prevYearObj = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
    const newPrevObj = new Date(new Date(prevYearObj).setFullYear(prevYearObj.getFullYear() - 1));
    const dataobj = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
    const newdate = new Date(new Date(dataobj).setMonth(dataobj.getMonth() - 1));
    const prevdate = `${newdate.getMonth()+1}-${newdate.getDate()}-${newdate.getFullYear()}`;
    let result;
    const modifieddate = new Date(`${dateArray[0]}/${dateArray[1]}/${dateArray[2]}`);
    let month;
    let tootipmonth;
    const locale = "en-us";
    switch (filter) {
      case "changedDateFormat":
        
        month = modifieddate.toLocaleString(locale, { month: "long" });
        month = month.substr(0,3);
        result = `${month}-${dateArray[2]}`;
        break;
      case "changedDateFormatForTooltip":
        tootipmonth = modifieddate.toLocaleString(locale, { month: "long" });
        tootipmonth = tootipmonth.substr(0,3);
        result = `${tootipmonth}'${dateArray[2].substr(2,2)}`;
        break;  
      case "getPreviousDate":
        result = prevdate;
        break;
      case "getPreviousYear":
        result = parseInt(newPrevObj.getFullYear(), 10);
        break;
      case "getCurrentMonth":
        result = parseInt(dateArray[0], 10);
        break;
      case "getCurrentYear":
        result = parseInt(dateArray[2], 10);
        break;
      case "getCurrentQuarterStartMonth":
        result = parseInt(startFullQuarter.getMonth() + 1, 10);
        break;
      case "getCurrentQuarterYear":
        result = parseInt(startFullQuarter.getFullYear(), 10);
        break;
      case "getPreviousQuarterStartMonth":
        result = parseInt(startFullPrevQuarter.getMonth() + 1, 10);
        break;
      case "getPreviousQuarterYear":
        result = parseInt(startFullPrevQuarter.getFullYear(), 10);
        break;
      case "getPreviousQuarteEndMonth":
        result = parseInt(startFullPrevQuarter.getMonth() + 1, 10) + 2;
        break;
      case "getCurrentQuarterEndMonth":
        result = parseInt(endFullQuarter .getMonth() + 1, 10);
        break;  
      case "getDaysFromDates":
        result = parseInt(diffDays, 10);
        break;
      default:
    }
    return result;
  }
};

export default commonJs;
