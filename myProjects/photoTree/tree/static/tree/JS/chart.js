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

//Sorting data
for (let i = 0; i < data.length; ++i) {
  for(let j = 0; j < data.length - i - 1; ++j) {
    if (data[j].birthyear > data[j+1].birthyear) {
      let tmp = data[j+1]
      data[j+1] = data[j]
      data[j] = tmp
    }
  }
}

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

/*
//Makes each data entry a li in the chart
let chartList = document.getElementById('chart')

for (let i = 0; i < data.length; ++i) {
  let li = document.createElement('li')

  let bottom = getY(data[i].birthyear, maxValue, chartWidth)
  let left = getLeft(chartWidth, data.length, i)

  let bottom2 = 0;
  let hypotenuse = 0;

  if (i+1 != data.length) {
    bottom2 = getY(data[i+1].birthyear, maxValue, chartWidth)
    hypotenuse = getHypotenuse(bottom, bottom2)
  }

  let angle;

  angle = getAngle(bottom - bottom2, hypotenuse)

  li.setAttribute('style', `--y: ${bottom}px; --x: ${left}px`)
//Ignoring Old Draw Line
  li.innerHTML = `
  <div class="line-segment" style="--hypotenuse: ${hypotenuse}; --angle: ${angle}"></div>
  <div class="data-point" data-value="${data[i].birthyear}" ></div>
  `
  //li.innerHTML = `<div class="data-point" data-value="${data[i].birthyear}" ></div>`

  chartList.appendChild(li);
}
*/

function getY(value, maxValue, chartWidth) {
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

function test(datapoint1, datapoint2, left1, left2) {
  triSide = datapoint1 - datapoint2
  tmpSpacing = left1 - left2
  hypotenuse = Math.sqrt((triSide * triSide) + (tmpSpacing * tmpSpacing))
  return hypotenuse
}

function getHypotenuse(datapoint1, datapoint2) {
  triSide = datapoint1 - datapoint2
  hypotenuse = Math.sqrt((triSide * triSide) + (spacing * spacing))
  return hypotenuse
}

//Get the angle to place line in between nodes
function getAngle(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse)
  //Convert from radians to degrees
  sine = sine * (180 / Math.PI)

  return sine;
}

function getIndex(id) {
  for (let i = 0; i < data.length; ++i) {
    if (id === data[i].image) {
      return i;
    }
  }
}









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Defines class to be used for the objects of the values in momMap
class mom {

  children = []
  spouse = null

  addChild(child) {
    this.children.push(child)
  }

  addSpouse(spouse) {
    this.spouse = spouse;
  }
}

let momMap = new Map()

//Initializes map with a key of each person in data inputs
for (let i = 0; i < data.length; ++i) {
  momMap.set(data[i], new mom())
}

//Appends children and husbands to key of mothers, appends to Object data members 
for (let i = 0; i < data.length; ++i) {
  if (data[i].mother != null) { 
    for (let j = 0; j < data.length; j++) {
      if (data[j].image == data[i].mother) {
        let mom = data[j]
        momMap.get(mom).addChild([data[i]])
      }
    }
  }
  if (data[i].spouse != null) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].image == data[i].spouse) {
        let spouse = data[j]
        momMap.get(spouse).addSpouse([data[i]])
      }
    }
  }
}

//Cleans out map so that non-mothers are deleted, since tree is based around Mothers others shouldn't be needed
for (let [key, value] of  momMap.entries()) {
  if (value.children.length === 0) {
    momMap.delete(key)
  }
}

//Makes an array out of map to sort (bubble sort) mothers from oldest to newest birthyear (oldest first) 
momArray = Array.from(momMap)

for (let i = 0; i < momArray.length; ++i) {
  for(let j = 0; j < momArray.length - i - 1; ++j) {
    if (momArray[j][0].birthyear > momArray[j+1][0].birthyear) {
      let tmp = momArray[j+1]
      momArray[j+1] = momArray[j]
      momArray[j] = tmp
    }
  }
}

console.log("Mom Array: ", momArray)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////







//Makes each data entry a li in the chart
let chartList = document.getElementById('chart')

for (let i = 0; i < data.length; ++i) {
  let li = document.createElement('li')

  //Sets isMom to true or false so that only mom Node will get lines
  let isMom = false;

  let childrenArray = []

  //Initializes an array for this iteration of loop containing children
  for (let j = 0; j < momArray.length; ++j) {
    if (momArray[j][0].image == data[i].image) {   
      isMom = true;
      childrenArray.push(momArray[j][1].children)
      break;
    }
  }

  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////
  //Makes each data entry a li in the chart
  let bottom = getY(data[i].birthyear, maxValue, chartWidth)
  let left = getLeft(chartWidth, data.length, i)

  li.setAttribute('style', `--y: ${bottom}px; --x: ${left}px`)
  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////  /////////////////////////








//TESTING
  if (i == 0) {
    console.log(childrenArray)

    let testLeft = getLeft(chartWidth, data.length, 4)
    let testBottom = getY(childrenArray[0][0][0].birthyear, maxValue, chartWidth)
    let testHypotenuse = test(bottom, testBottom, left, testLeft)
    let testAngle = getAngle(bottom - testBottom, testHypotenuse)

    console.log("Bottom:", bottom)
    console.log("testBottom:", testBottom)
    console.log("testHypotenuse", testHypotenuse)
    console.log("Angle:", testAngle)

    li.innerHTML += `<div class="line-segment" style="--hypotenuse: ${testHypotenuse}; --angle: ${testAngle}"></div>`
    li.innerHTML += `<div class="data-point" data-value="${data[i].birthyear}" ></div>`

    chartList.appendChild(li)
    continue
  }




  //If mom should draw lines to each of the children
  //FIXME number of lines are correct, do not go to Children
  if (isMom) {
    let childBottom
    let childHypotenuse

    for (let j = 0; j < childrenArray[0].length; ++j) {
      
      if (i+1 != data.length) {
        childBottom = getY(childrenArray[0][j][0].birthyear, maxValue, chartWidth)
        childLeft = getLeft(chartWidth, data.length, getIndex(childrenArray[0][j][0].image))
        childHypotenuse = test(bottom, childBottom, left, childLeft)
      }

      let angle = getAngle(bottom - childBottom, childHypotenuse)

      li.innerHTML += `<div class="line-segment" style="--hypotenuse: ${childHypotenuse}; --angle: ${angle}"></div>`
    }

    //Makes it so that data point is last thing added so that lines are beneath node
    li.innerHTML += `<div class="data-point" data-value="${data[i].birthyear}" ></div>`

  } else {
    li.innerHTML = `<div class="data-point" data-value="${data[i].birthyear}" ></div>`
  }


  chartList.appendChild(li);

}
