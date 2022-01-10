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

let nodeBoxData = []

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


let chartList = document.getElementById('chart')

createChart(chartList)

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function removeRelationship(id1, id2) {
  //removes Child from momArray
  let isRelated = false
  //debugger
  for (let i = 0; i < momArray.length; ++i) {
    if (momArray[i][0].data.image == id2 || momArray[i][0].data.image == id1) {
      for (let j = 0; j < momArray[i][0].children.length; ++j) {
        let childArray = momArray[i][0].children
        if (childArray[j].image == id1 || childArray[j].image == id2) {
          isRelated = true;

          let childDataIndex = getDataIndex(childArray[j].image)

          childArray.splice(j,1)
          
          data.splice(childDataIndex,1)

          console.log("Data", data)
          //console.log("NodeBox",  nodeBoxData)

          break;
        }
      }
    }
  }

  let box = document.getElementById('confirmBox');

  if (!isRelated) {
    alert("Error, are not related.")
  }

  createChart(chartList)

  box.innerHTML = ''
}


function changeButtonParameters() {
  let box = document.getElementById('confirmBox')
  let children = []

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  let button = document.getElementById('removeButton')

  if (children.length != 0) {
    let param1 = children[0]
    let param2 = children[1]
    button.setAttribute('onclick',`changeButtonParameters(), removeRelationship(${param1}, ${param2})`)
  }
}


function addToConfirmBox(id) {
  let box = document.getElementById('confirmBox')
  let nodeId = `node${id}`
  let img = document.createElement('img')

  img.setAttribute('id', nodeId)
  img.setAttribute('class', 'node-image')
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`)

  box.appendChild(img)

  changeButtonParameters()
}

function createChart(chart) {
  createDataPoints(chart)
  createChildLines()
  createSpouseLines()
}

//Creates Data Points
function createDataPoints(chart) {
  //In case you have to redraw chart
  removeAllChildNodes(chart)

  for (let i = 0; i < data.length; ++i) {
    let li = document.createElement('li')
    yPos = getY(data[i].birthyear, maxValue, chartWidth)
    xPos = getX(chartWidth, data.length, i)

    li.setAttribute('id', data[i].image)  //FIXME Doesn't match id, but if i change this all the indexes get off
    li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`)
    li.innerHTML += `<div class="data-point" data-value="${data[i].birthyear}"><button id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'></button></div>`
  
    chart.appendChild(li)
  }

}

//Draws Line To Children
function createChildLines() {
  for (let i = 0; i < data.length; ++i) {

    if (isMom(data[i])) {
      let li = document.getElementById(data[i].image)
  
      yPos = parseAttribute('y', li.getAttribute('style'))
      xPos = parseAttribute('x', li.getAttribute('style'))
      
      let index = getMomArrayIndex(momArray, data[i].image)
  
      for (let j = 0; j < momArray[index][0].children.length; ++j) {
  
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
}

//Draws Line Connecting to Spouse
function createSpouseLines() {
  for (let i = 0; i < data.length; ++i) {

    let li = document.getElementById(data[i].image)  //FIXME BEFORE WAS I     This way combined with the change i made with above function data[i].image for ids will cause issues

    yPos = parseAttribute('y', li.getAttribute('style'))
    xPos = parseAttribute('x', li.getAttribute('style'))

    if (data[i].spouse != null) {

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
}


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

//FIXME Not best way but a way
function parseAttribute(lookFor, attribute) {
  let numString = ''
  //debugger
  if (lookFor == 'y') {
    for (let i = 0; i < attribute.length; ++i) {
      if (attribute[i] == 'y') {
        let j = i + 2 //skips colon and white space
        while (attribute[j] != 'p') {
          numString += attribute[j]
          j++
        }

      }
    }
  }

  if (lookFor == 'x') {
    for (let i = 0; i < attribute.length; ++i) {
      if (attribute[i] == 'x' && attribute[i-1] != 'p') {
        let j = i + 2 //skips colon and white space
        while (attribute[j] != 'p') {
          numString += attribute[j]
          j++
        }
      }
    }
  }
  return numString
}