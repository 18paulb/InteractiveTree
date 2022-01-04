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

//For testing
//randomizeDataOrder(data)
//console.log(data)

//Variables to work with, will change if I need to change graph size
let chartWidth = 900;
let maxValue = 0;
let minValue = data[0].birthyear //initial value for comparing
let spacing = chartWidth / data.length

//Sets min and max values for yPos calculation
for (let i = 0; i < data.length; ++i) {
  if (data[i].birthyear > maxValue) {
    maxValue = data[i].birthyear
  }

  if (data[i].birthyear < minValue) {
    minValue = data[i].birthyear
  }
}

//Important otherwise nodes would be too close together
let scaleFactor = maxValue - minValue;  

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Defines class to be used for the objects of the values in momMap
class mom {
  children = []
  spouse = null
  data = null

  addChild(child) {
    this.children.push(child)
  }

  addSpouse(spouse) {
    this.spouse = spouse;
  }
}

let momArray = []

for (let i = 0; i < data.length; ++i) {
  momArray.push([])
  momArray[i].push(new mom)
}

//Pushes children to moms
for (let i = 0; i < data.length; ++i) {
  if (data[i].mother != null) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].image == data[i].mother) {
        momArray[j][0].children.push(data[i])
      }
    }
  }
}

//Pushes spouse to moms
for (let i = 0; i < data.length; ++i) {
  if (data[i].spouse != null) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].image == data[i].spouse) {
        momArray[j][0].spouse = data[j].image
      }
    }
  }
}

//Pushes data to mom
for (let i = 0; i < data.length; ++i) {
  momArray[i][0].data = data[i]
}

//Cleaning Up Array to only leave moms
let tmpMomArray = []
for (let i = 0; i < momArray.length; ++i) {
  if (momArray[i][0].children.length != 0) {
    tmpMomArray.push(momArray[i])
  }
}
momArray = tmpMomArray

console.log("Mom Array: ", momArray)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//TODO Will want to have middle child in array be exactly under mom, xPos will be same and other children will calculate around that

//TESTING Changing Data to better organize tree


let chartList = document.getElementById('chart')

//Creates Data Points
for (let i = 0; i < data.length; ++i) {
  //debugger
  let li = document.createElement('li')

  yPos = getY(data[i].birthyear, maxValue, chartWidth)
  xPos = getX(chartWidth, data.length, i)

  //FIXME Sometimes some spouses are not technically children
  if (isChild(data[i])) {
    let avgYear = getAvgYear(getSiblings(data[i]))
    yPos = getY(avgYear, maxValue, chartWidth)
  }

  li.setAttribute('id', i)
  li.setAttribute('style', `--y: ${yPos}px; --x: ${Math.round(xPos)}px`)

  li.innerHTML += `<div class="data-point" data-value="${data[i].birthyear}" ></div>`

  chartList.appendChild(li)
}

//Draws Line Connecting to Spouse
for (let i = 0; i < data.length; ++i) {
  let li = document.getElementById(i)

  yPos = getY(data[i].birthyear, maxValue, chartWidth)
  xPos = getX(chartWidth, data.length, i)

  if (data[i].spouse != null) {

    //FIXME Not working
    //let avgYear = getAvgYear(getSiblings(data[data[i].spouse - 1]))
    //console.log(avgYear)
    //let spouseYPos = getY(avgYear, maxValue, chartWidth)

    let spouseYPos = getY(data[getDataIndex(data[i].spouse)].birthyear, maxValue, chartWidth)
    let spouseXPos = getX(chartWidth, data.length, getDataIndex(data[i].spouse))
    let spouseHypotenuse = getHypotenuse(yPos, spouseYPos, xPos, spouseXPos)
    let spouseAngle = getAngle(yPos - spouseYPos, spouseHypotenuse)

    if (spouseXPos < xPos) {
      spouseAngle = (-1 * spouseAngle) + 180.5
    }

    //if statement so that two spouse lines aren't drawn between spouses
    if (spouseXPos > xPos) {
      li.innerHTML += `<div class="spouse-line" style="--hypotenuse: ${spouseHypotenuse}; --angle: ${spouseAngle}"></div>`
    }
  }
}

//Draws lines from mothers to children
//FIXME Optimize Further
for (let i = 0; i < data.length; ++i) {

  if (isMom(data[i])) {
    let li = document.getElementById(i)

    yPos = getY(data[i].birthyear, maxValue, chartWidth)
    xPos = getX(chartWidth, data.length, i)

    let index = getMomArrayIndex(momArray, data[i].image)

    for (let j = 0; j < momArray[index][0].children.length; ++j) {

      //FIXME something wrong if it is just single child
      //let avgYear = getAvgYear(getSiblings(momArray[index][0].children[j]))
      //let childYPos = getY(avgYear, maxValue, chartWidth)
      //console.log(avgYear)

      let childYPos = getY(momArray[index][0].children[j].birthyear, maxValue, chartWidth)
      let childXPos = getX(chartWidth, data.length, getDataIndex(momArray[index][0].children[j].image))
      let childHypotenuse = getHypotenuse(yPos, childYPos, xPos, childXPos)
      let angle = getAngle(yPos - childYPos, childHypotenuse)

      //Adjusts angle if child is before mom in x-axis
      if (childXPos < xPos) {
        angle = (-1 * angle) + 180.5
      }

      li.innerHTML += `<div class="child-line" style="--hypotenuse: ${childHypotenuse}; --angle: ${angle}"></div>`
    }
  }
}






//FIXME for functions with id as parameter, consider making it take in entire data object rather than just image as it makes it easier to read in code


function getY(value, maxValue, chartWidth) {
  //Scales values so that it fits evenly in size of chart
  //Makes it so that lowest value (oldest person) is top of graph
  scaledValue = (Math.abs(value - maxValue)) * scaleFactor
  scaledMaxValue = (Math.abs(minValue - maxValue)) * scaleFactor
  let bottom = (scaledValue / scaledMaxValue) * chartWidth
  return bottom;
}

function getX(chartWidth, numValues, positionInData) {
  let left = (chartWidth / numValues) * (positionInData + 1)
  return left;
}

function getHypotenuse(datapoint1, datapoint2, left1, left2) {
  triSide = datapoint1 - datapoint2
  tmpSpacing = left1 - left2
  hypotenuse = Math.sqrt((triSide * triSide) + (tmpSpacing * tmpSpacing))
  return hypotenuse
}

//Get the angle to place line in between nodes
function getAngle(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse)
  //Convert from radians to degrees
  sine = sine * (180 / Math.PI)

  return sine;
}

function getDataIndex(id) {
  for (let i = 0; i < data.length; ++i) {
    if (id === data[i].image) {
      return i;
    }
  }
}

function getMomArrayIndex(array, id) {
  for (let i = 0; i < array.length; ++i) {
    if (array[i][0].data.image == id) {
      return i
    }
  }
}

//For testing with different data positions
function randomizeDataOrder(data) {
  for (let i = 0; i < data.length; ++i) {
    let randomIndex = Math.floor(Math.random() * data.length)
    let tmpVal = data[randomIndex]
    data[randomIndex] = data[i]
    data[i] = tmpVal
  }
}

//Possible functions I might need


function getSiblings(child) {
  let allChildren = []
  let mother = child.mother
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother == mother) {
      allChildren.push(data[i])
    }
  }

  if (allChildren.length == 0) {
    allChildren.push(child)
  }

  return allChildren
}

//This is probably redundant
function getAvgYear(array) {
  let avg = 0
  for (let i = 0; i < array.length; ++i) {
    avg += array[i].birthyear
  }
  avg = avg / array.length

  return avg
}

function isChild(node) {
  if (node.mother != null) {
    return true
  } else {
    return false
  }
}

function isMom(node) {
  let isMom = false;
  for (let j = 0; j < momArray.length; ++j) {
    if (momArray[j][0].data.image == node.image) {   
      isMom = true;
      break;
    }
  }
  return isMom
}
