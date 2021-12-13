let data = [
  {
    "image": 1,
    "mother": 9,
    "spouse": null,
    "birthyear": 2006
  },
  {
    "image": 2,
    "mother": 9,
    "spouse": null,
    "birthyear": 2004
  },
  {
    "image": 3,
    "mother": 9,
    "spouse": null,
    "birthyear": 2002
  },
  {
    "image": 4,
    "mother": 9,
    "spouse": null,
    "birthyear": 2010
  },
  {
    "image": 5,
    "mother": 9,
    "spouse": null,
    "birthyear": 2008
  },
  {
    "image": 6,
    "mother": 9,
    "spouse": null,
    "birthyear": 2013
  },
  {
    "image": 7,
    "mother": 9,
    "spouse": null,
    "birthyear": 2001
  },
  {
    "image": 8,
    "mother": 11,
    "spouse": 9,
    "birthyear": 1978
  },
  {
    "image": 9,
    "mother": 10,
    "spouse": 8,
    "birthyear": 1979
  },
  {
    "image": 10,
    "mother": null,
    "spouse": null,
    "birthyear": 1950
  },
  {
    "image": 11,
    "mother": null,
    "spouse": 12,
    "birthyear": 1955
  },
  {
    "image": 12,
    "mother": null,
    "spouse": 11,
    "birthyear": 1955
  },
  {
    "image": 13,
    "mother": 11,
    "spouse": 14,
    "birthyear": 1980
  },
  {
    "image": 14,
    "mother": null,
    "spouse": 13,
    "birthyear": 1979
  },
  {
    "image": 15,
    "mother": 11,
    "spouse": 17,
    "birthyear": 1984
  },
  {
    "image": 16,
    "mother": 15,
    "spouse": null,
    "birthyear": 2005
  },
  {
    "image": 17,
    "mother": null,
    "spouse": 15,
    "birthyear": 1981
  },
]


/*
//sorting data to test for tree
for (let i = 0; i < data.length; ++i) {
  for(let j = 0; j < data.length - i - 1; ++j) {
    if (data[j].birthyear > data[j+1].birthyear) {
      let tmp = data[j+1]
      data[j+1] = data[j]
      data[j] = tmp
    }
  }
}
*/

//Tmp variables to work with, will change if i need to change graph
let chartWidth = 900;
let maxValue = 0;
let minValue = data[0].birthyear //initial value for comparing
let spacing = chartWidth / data.length

//Sets min and max values
for (let i = 0; i < data.length; ++i) {
  if (data[i].birthyear > maxValue) {
    maxValue = data[i].birthyear
  }

  if (data[i].birthyear < minValue) {
    minValue = data[i].birthyear
  }
}

let scaleFactor = maxValue - minValue;


//Makes each data entry a li in the chart
let chartList = document.getElementById('chart')

for (let i = 0; i < data.length; ++i) {
  let li = document.createElement('li')

  let bottom = getBottom(data[i].birthyear, maxValue, chartWidth)
  let left = getLeft(chartWidth, data.length, i)

  let bottom2 = 0;
  let hypotenuse = 0;

  if (i+1 != data.length) {
    bottom2 = getBottom(data[i+1].birthyear, maxValue, chartWidth)
    hypotenuse = getHypotenuse(bottom, bottom2)
  }




  li.setAttribute('style', `--y: ${bottom}px; --x: ${left}px`)
/* Ignoring Line drawing for now
  li.innerHTML = `
  <div class="line-segment" style="--hypotenuse: ${hypotenuse};"></div>
  <div class="data-point" data-value="${data[i].birthyear}" ></div>
  `
*/
  li.innerHTML = `<div class="data-point" data-value="${data[i].birthyear}" ></div>`

  chartList.appendChild(li);
}



function getBottom(value, maxValue, chartWidth) {
  //debugger;

  //Scales values so that it fits evenly in size of chart
  //Makes it so that lowest value is top of graph
  scaledValue = (Math.abs(value - maxValue)) * scaleFactor
  scaledMaxValue = (Math.abs(minValue - maxValue)) * scaleFactor
  let bottom = (scaledValue / scaledMaxValue) * chartWidth

  return bottom;
}

function getLeft(chartWidth, numValues, positionInData) {
  let left = (chartWidth / numValues) * (positionInData + 1)

  return left;
}

function getHypotenuse(datapoint1, datapoint2) {

  triSide = datapoint1 - datapoint2

  hypotenuse = Math.sqrt((triSide * triSide) + (spacing * spacing))

  return hypotenuse

}

//Get the angle to place line in between nodes
//FIXME not working if next data point is lower, opposite needs to be spacing, not y-distance between the two (MAYBE)
function getSine(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse)

  //Convert from radians to degrees
  sine = sine * (180 / Math.PI)

  return sine;
}
