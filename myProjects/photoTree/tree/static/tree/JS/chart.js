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
    "mother": null,  //FIXME CHANGED
    "spouse": 8,
    "birthyear": 1979
  },
  /*
  {
    "image": 10,
    "mother": null,
    "spouse": null,
    "birthyear": 1950
  },
  */
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

//TODO eventually, fix naming scheme for ID's to make more simple to work with

console.log(data)

//Variables to work with, will change if I need to change graph size
let chartWidth = 900;
let maxValue = 0;
let minValue = data[0].birthyear //initial value for comparing

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

function makeMomArray() {
  let tmpArray = []

  for (let i = 0; i < data.length; ++i) {
    tmpArray.push([])
    tmpArray[i].push(new mom)
  }

  //Pushes children to moms
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother != null) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].image == data[i].mother) {
          tmpArray[j][0].children.push(data[i])
        }
      }
    }
  }

  //Pushes spouse to moms
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].image == data[i].spouse) {
          tmpArray[j][0].spouse = data[j].image
        }
      }
    }
  }

  //Pushes data to mom
  for (let i = 0; i < data.length; ++i) {
    tmpArray[i][0].data = data[i]
  }

  //Cleaning Up Array to only leave moms
  let tmpMomArray = []
  for (let i = 0; i < tmpArray.length; ++i) {
    if (tmpArray[i][0].children.length != 0) {
      tmpMomArray.push(tmpArray[i])
    }
  }
  tmpArray = tmpMomArray

  return tmpArray
}

momArray = makeMomArray()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





function swapRelationship(id1, id2) {

  //Assuming both are in data

  let id1Index = getDataIndex(id1);
  let id2Index = getDataIndex(id2);

  let tmpMom = data[id1Index].mother;
  data[id1Index].mother = data[id2Index].mother
  data[id2Index].mother = tmpMom;

  let tmpSpouse = data[id1Index].spouse;
  data[id1Index].spouse = data[id2Index].spouse
  data[id2Index].spouse = tmpSpouse;

  if (isMom(data[id1Index])) {
    let momIndex = getMomArrayIndex(momArray, id1)
    for (let i = 0; i < momArray[momIndex][0].children.length; ++i) {
      momArray[momIndex][0].children[i].mother = id2;
    }
  }

  if (isMom(data[id2Index])) {
    let momIndex = getMomArrayIndex(momArray, id2)
    for (let i = 0; i < momArray[momIndex][0].children.length; ++i) {
      momArray[momIndex][0].children[i].mother = id1;
    }
  }

  momArray = makeMomArray()
  
  sortData()
  createChart(chartList)

  document.getElementById('confirmBox').innerHTML = ''


}






















let chartList = document.getElementById('chart')

createChart(chartList)



function addSpouseRelationship(id1, id2) {
  let node1;
  let node2;

  for (let i = 0; i < data.length; ++i) {
    if (data[i].image == id1) {
      node1 = data[i];
    }
    if (data[i].image == id2) {
      node2 = data[i];
    }
  }

  for (let i = 0; i < nodeBoxData.length; ++i) {
    if (nodeBoxData[i].image == id1) {
      node1 = nodeBoxData[i];
    }
    if (nodeBoxData[i].image == id2) {
     node2 = nodeBoxData[i];
    }
  }

  //For Spouse -> Spouse
  let spouse1 = node1;
  let spouse2 = node2;

  if (getNodeBoxDataIndex(spouse1.image) != null) {
    spouse1Index = getNodeBoxDataIndex(spouse1.image);
    data.push(nodeBoxData[spouse1Index]);
    nodeBoxData.splice(spouse1Index, 1)
  } 

  //What if spouse2 is in nodeBoxData
  if (getNodeBoxDataIndex(spouse2.image) != null) {
    spouse2Index = getNodeBoxDataIndex(spouse2.image);
    data.push(nodeBoxData[spouse2Index]);
    nodeBoxData.splice(spouse2Index, 1)
  }

  if (getDataIndex(spouse1.image) != null) {
    spouse1Index = getDataIndex(spouse1.image);
    data[spouse1Index].spouse = spouse2.image;
  }

  if (getDataIndex(spouse2.image) != null) {
    spouse2Index = getDataIndex(spouse2.image);
    data[spouse2Index].spouse = spouse1.image
  }

  sortData()
  createChart(chartList)

  document.getElementById('confirmBox').innerHTML = ''

}



//TODO fix issues
function addMotherRelationship(id1, id2) {
  //SOLVE:
  //4. Impossible to do with current data but if male, you can't make it mother
  //5. If moved from nodeBoxData into confirmBox and error occurs (ie more than 2 nodes) and confirmBox is cleared, the data from nodeBoxData is lost forever
  
  let id1Node;
  let id2Node;

  for (let i = 0; i < data.length; ++i) {
    if (data[i].image == id1) {
      id1Node = data[i];
    }
    if (data[i].image == id2) {
      id2Node = data[i];
    }
  }

  for (let i = 0; i < nodeBoxData.length; ++i) {
    if (nodeBoxData[i].image == id1) {
      id1Node = nodeBoxData[i];
    }
    if (nodeBoxData[i].image == id2) {
      id2Node = nodeBoxData[i];
    }
  }

  let mother;
  let child;

  if (id1Node.birthyear > id2Node.birthyear) {
    mother = id2Node;
    child = id1Node;
  } else {
    mother = id1Node;
    child = id2Node;
  }

  let childIndex;
  let momIndex
  if (getNodeBoxDataIndex(child.image) != null) {
    childIndex = getNodeBoxDataIndex(child.image);
    data.push(nodeBoxData[childIndex]);
    nodeBoxData.splice(childIndex, 1)
  } 
  //What if mom is in nodeBoxData
  if (getNodeBoxDataIndex(mother.image) != null) {
    momIndex = getNodeBoxDataIndex(mother.image);
    data.push(nodeBoxData[momIndex]);
    nodeBoxData.splice(momIndex, 1)
  }

  if (getDataIndex(child.image) != null) {
    childIndex = getDataIndex(child.image);
    data[childIndex].mother = mother.image;
  }

  momArray = makeMomArray()
  
  sortData()
  createChart(chartList)

  document.getElementById('confirmBox').innerHTML = ''

}

function removeRelationship(id1, id2) {

  let id1Index = getDataIndex(id1)
  let id2Index = getDataIndex(id2)

  let isRelated = false

  //Removes Spouse Relationship
  if (data[id1Index].spouse == id2) {
    isRelated = true

    data[id1Index].spouse = null
    data[id2Index].spouse = null

    if (!(hasRelationship(data[id1Index]))) {
      addToNodeContainer(id1)
      data.splice(id1Index, 1)
    }

    id2Index = getDataIndex(id2)

    if (!(hasRelationship(data[id2Index]))) {
      addToNodeContainer(id2)
      data.splice(id2Index, 1)
    }

    createChart(chartList)
  
    let box = document.getElementById('confirmBox');
    box.innerHTML = ''
  }

  //Removes Mother/Child Relationship
  id1Index = getDataIndex(id1)
  id2Index = getDataIndex(id2)

  if (data[id1Index].mother == id2) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i][0].data.image == id2) {
        for (let j = 0; j < momArray[i][0].children.length; ++j) {
          if (momArray[i][0].children[j].image == id1) {
            isRelated = true;

            data[id1Index].mother = null

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image)
              data.splice(id1Index, 1)
            }

            id2Index = getDataIndex(id2)
            
            momArray = makeMomArray()

            if (!hasRelationship(data[id2Index])) {
              addToNodeContainer(data[id2Index].image)
              data.splice(id2Index, 1)
            }

            break;
          }
        }
      }
    }
  }

  else if (data[id2Index].mother == id1) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i][0].data.image == id1) {
        for (let j = 0; j < momArray[i][0].children.length; ++j) {
          if (momArray[i][0].children[j].image == id2) {
            isRelated = true;

            data[id2Index].mother = null

            if (!hasRelationship(data[id2Index])) {
              addToNodeContainer(data[id2Index].image)
              data.splice(id2Index, 1)
            }

            id1Index = getDataIndex(id1)

            momArray = makeMomArray()

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image)
              data.splice(id1Index, 1)
            }

            break;
          }
        }
      }
    }
  }

  if (!isRelated) {
    alert("Error, No Direct Relationship")
  }

  createChart(chartList)

  let box = document.getElementById('confirmBox');
  box.innerHTML = ''
}

function changeAddButtonParameters() {
  let box = document.getElementById('confirmBox')
  let children = []

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  let button = document.getElementById('addMotherButton')
  let button2 = document.getElementById('addSpouseButton')
  let button3 = document.getElementById('swapButton')

  if (children.length != 0) {
    let param1 = children[0]
    let param2 = children[1]
    button.setAttribute('onclick',`changeAddButtonParameters(), addMotherRelationship(${param1}, ${param2})`)
    button2.setAttribute('onclick',`changeAddButtonParameters(), addSpouseRelationship(${param1}, ${param2})`)
    //button3.setAttribute('onclick',`changeAddButtonParameters(), swapRelationship(${param1}, ${param2})`)
  }
}

function changeRemoveButtonParameters() {
  let box = document.getElementById('confirmBox')
  let children = []

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  let button = document.getElementById('removeButton')

  if (children.length != 0) {
    let param1 = children[0]
    let param2 = children[1]
    button.setAttribute('onclick',`changeRemoveButtonParameters(), removeRelationship(${param1}, ${param2})`)
  }
}

function addToConfirmBox(id) {
  let box = document.getElementById('confirmBox')

  if (box.children.length >= 2) {
    alert("Can't have more than 2 nodes in confirmation box.")
    box.innerHTML = ''
    return
  }

  let nodeId = `node${id}`
  let img = document.createElement('img')

  img.setAttribute('id', nodeId)
  img.setAttribute('class', 'node-image')
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`)

  box.appendChild(img)

  changeRemoveButtonParameters()
  //TEST
  changeAddButtonParameters()
}

function addToNodeContainer(id) {

  let index = getDataIndex(id)

  nodeBoxData.push(data[index])

  let container = document.getElementById('nodeContainer')
  let nodeId = `node${id}`
  let button = document.createElement('button')
  let img = document.createElement('img')

  img.setAttribute('id', nodeId)
  img.setAttribute('class', 'node-image')
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`)

  //FIXME this button ID might not be needed
  button.setAttribute('id', `button${id}`)
  button.setAttribute('onclick', `addToConfirmBox(${id}), removeFromNodeContainer(${id})`)

  button.appendChild(img)

  container.appendChild(button)
}

function removeFromNodeContainer(id) {

  let container = document.getElementById('nodeContainer')

  let child = document.getElementById("button" + id)

  container.removeChild(child)
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

    //Testing
    //let generation = getGeneration(data[i])
    

    li.setAttribute('id', data[i].image)
    li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`)
    //li.innerHTML += `<div class="data-point" data-value="${data[i].birthyear}"><button id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'></button></div>`
    li.innerHTML += `<button id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'><img class="data-point" data-value="${data[i].birthyear}" src="../../static/tree/images/pictures/${data[i].image}.PNG"></button>`
  
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
        //li.innerHTML += `<button class="button-line" onclick="hi()" style="--hypotenuse: ${childHypotenuse}; --angle: ${angle}">test</button>`
      }
    }
  }
}

//Draws Line Connecting to Spouse
function createSpouseLines() {
  for (let i = 0; i < data.length; ++i) {

    let li = document.getElementById(data[i].image)

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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

//FIXME change for spacing
function getY(value, maxValue, chartWidth) {
  //Scales values so that it fits evenly in size of chart
  //Makes it so that lowest value (oldest person) is top of graph
  scaledValue = (Math.abs(value - maxValue)) * scaleFactor
  scaledMaxValue = (Math.abs(minValue - maxValue)) * scaleFactor
  let bottom = (scaledValue / scaledMaxValue) * chartWidth
  return bottom;
}

//FIXME change for spacing
function getX(chartWidth, numValues, positionInData) {
  let left = (chartWidth / (numValues / 1.5)) * (positionInData + 1)
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
  return null
}

function getNodeBoxDataIndex(id) {
  for (let i = 0; i < nodeBoxData.length; ++i) {
    if (id === nodeBoxData[i].image) {
      return i;
    }
  }
  return null
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

function hasRelationship(node) {

  let hasRelationship = false;

  if (node.spouse != null) {
    hasRelationship = true
  }

  if (isMom(node)) {
    hasRelationship = true;
  }

  if (node.mother != null) {
    hasRelationship = true
  }

  return hasRelationship

}

//JUST FOR TESTING, WILL REPLACE WITH POSITIONING ALGORITHM
function sortData() {
  for (let i = 0; i < data.length; ++i) {
    for (let j = i+1; j < data.length; ++j) {
      if (data[j].image < data[i].image) {
        let tmp = data[i]
        data[i] = data[j]
        data[j] = tmp
      }
    }
  }
}

















//Generational XPositioning
function getGenerationCount(node, count) {
  if (node.mother == null) {
      if (node.spouse != null) {
      let spouseIndex = getDataIndex(node.spouse) 
      if (data[spouseIndex].mother != null) {
        let motherIndex = getDataIndex(data[spouseIndex].mother)
        return count += getGenerationCount(data[motherIndex], count);
      }
      else {
        return count;
      }
    }
    else {
      return count;
    }
  }

  let motherIndex = getDataIndex(node.mother);

  if (node.mother != null) {
    return count += getGenerationCount(data[motherIndex], count);
  }
}


function getGenerationWidth(node) {
  let generation = getGeneration(node)

  let numInGen = getNumInGeneration(generation)

  let spacing = chartWidth / numInGen / generation;

  return spacing
}


function getGeneration(node) {
  let count = 1;

  count = getGenerationCount(node, count)

  return count;
}

/*
function setX(node, numNodesInGeneration, generation, position) {
  //FIXME this should get spacing right but it would put all nodes in one spot
    let spacing;

    spacing = chartWidth / numNodesInGeneration / generation;
    spacing = spacing * position;

    let tmpGen = getGeneration(node);

    let width = getGenerationWidth(node)

  
    return spacing;
  
  }
*/

function getNumInGeneration(generation) {
  let numInGen = 0;
  for (let i = 0; i < data.length; ++i) {
    console.log(getGeneration(data[i]))
    if (getGeneration(data[i]) == generation) {
      numInGen++;
    }
  }
  return numInGen;
}



console.log(getGeneration(data[7]))
//debugger
console.log(getGenerationWidth(data[7]))