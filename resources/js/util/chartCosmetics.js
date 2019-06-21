import commonJs from "./common";

let baseUrl = window.location.origin + (process.env.BASE_URL || '');

if (window.location.origin.includes('localhost')) {
  baseUrl = 'https://www.fusioncharts.com/demos/dashboards/wealth-management-dashboard-using-php-laravel-with-export';
}

const chartCosmetics = {
  green_arrow_up: `${baseUrl}/images/green_arrow_up.svg`,
  red_arrow_down: `${baseUrl}/images/red_arrow_down.svg`,
  yellow_arrow_right : `${baseUrl}/images/yellow_arrow_right.png`,
  black_line : `${baseUrl}/images/black_line.png`,
  mapMarkers : [
    {
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
  ],
  mapData : [
    {
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
      "SA": "South Carolina",
      "name": "South Carolina",
    }
  ],
  tooltipTemplate: (
    elementName,
    measureFilter,
    currentValue,
    previousValue,
    currentMesure ,
    previousMeasure
  ) => {
    let tooltipGreen;
    let tooltipRed;
    if(currentValue > previousValue){
      tooltipGreen = `<span class='improve-green'>${measureFilter} Improved</span>`;
    }else{
      tooltipRed = `<span class='decrease-red'>${measureFilter} Worsened</span>`;
    }

    const template = `<span class='tooltip-value'>${elementName}</span><br>${(currentValue > previousValue ? tooltipGreen : tooltipRed)}<br>Current Period(${currentMesure}): <span class='tooltip-value'>$${commonJs.convertIntoMillion(currentValue)}M</span><br>Previous Period(${previousMeasure}):  <span class='tooltip-value'>$${commonJs.convertIntoMillion(previousValue)}M</span>`;
    return template;
  },

  dateSetTemplate: (type, value) => {
    const label = `{ "${type}" : "${value}" }`;
    return label;
  },

  annotationImageTemplate: (
    elementName,
    measureFilter,
    currentValue,
    previousValue,
    index,
    currentMesure , previousMeasure
    ) => {
    const improvedImgUrl = `"url" : "${chartCosmetics.green_arrow_up}"`;
    const worsendImgUrl = `"url" : "${chartCosmetics.red_arrow_down}"`;
    const anootationGap = 2 ;
    let tooltipGreen;
    let tooltipRed;
    if(currentValue > previousValue){
      tooltipGreen = `<span class='improve-green'>${measureFilter} Improved</span>`;
    }else{
      tooltipRed = `<span class='decrease-red'>${measureFilter} Worsened</span>`;
    }

    const annotation = `{ "tooltext":
        "<span class='tooltip-value'>${elementName}</span><br>${(currentValue > previousValue ? tooltipGreen : tooltipRed)}<br>Current Period(${currentMesure}): <span class='tooltip-value'>$${commonJs.convertIntoMillion(currentValue)}M</span><br>Previous Period(${previousMeasure}): <span class='tooltip-value'>$${commonJs.convertIntoMillion(previousValue)}M</span>",
        "type": "image", ${currentValue >= previousValue ? improvedImgUrl : worsendImgUrl},
        "x": "$dataset.0.set.${index}.endx + ${anootationGap}",
        "y":"$dataset.0.set.${index}.centery-7.5" },`;
    return annotation;
  },

  annotationLineTemplate: index => {
    const line = `{
            "type": "line",
            "text":"|",
            "color" : "#000000",
            "x": "$dataset.1.set.${index}.endx",
            "y":"$dataset.0.set.${index}.starty+8",
            "toX":"$dataset.1.set.${index}.endx",
            "toY":"$dataset.0.set.${index}.endy-8"
            },`;
    return line;
  }
};

export default chartCosmetics;
