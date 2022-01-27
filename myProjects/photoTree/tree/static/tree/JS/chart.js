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

let nodeBoxData = [];
//randomizeDataOrder(data);

//Change this and HTML in order to change graph size
let chartWidth = 1200;

//Used to connect children to moms
let momArray = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Defines class to be used for the objects of the values in momMap
class mom {
  children = [];
  spouse = null;
  data = null;

  addChild(child) {
    this.children.push(child);
  }

  addSpouse(spouse) {
    this.spouse = spouse;
  }
}


function makeMomArray() {
  let tmpArray = [];

  for (let i = 0; i < data.length; ++i) {
    tmpArray.push([]);
    tmpArray[i].push(new mom);
  }

  //Pushes children to moms
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother != null) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].image == data[i].mother) {
          tmpArray[j][0].children.push(data[i]);
        }
      }
    }
  }

  //Pushes spouse to moms
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].image == data[i].spouse) {
          tmpArray[j][0].spouse = data[j].image;
        }
      }
    }
  }

  //Pushes data to mom
  for (let i = 0; i < data.length; ++i) {
    tmpArray[i][0].data = data[i];
  }

  //Cleaning Up Array to only leave moms
  let tmpMomArray = [];
  for (let i = 0; i < tmpArray.length; ++i) {
    if (tmpArray[i][0].children.length != 0) {
      tmpMomArray.push(tmpArray[i]);
    }
  }
  tmpArray = tmpMomArray;

  return tmpArray;
}

momArray = makeMomArray();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




/*
function swapRelationship(id1, id2) {

  //Assuming both are in data

  let id1Index = getDataIndex(id1);
  let id2Index = getDataIndex(id2);

  let tmpMom = data[id1Index].mother;
  data[id1Index].mother = data[id2Index].mother;
  data[id2Index].mother = tmpMom;

  let tmpSpouse = data[id1Index].spouse;
  data[id1Index].spouse = data[id2Index].spouse;
  data[id2Index].spouse = tmpSpouse;

  if (isMom(data[id1Index])) {
    let momIndex = getMomArrayIndex(momArray, id1);
    for (let i = 0; i < momArray[momIndex][0].children.length; ++i) {
      momArray[momIndex][0].children[i].mother = id2;
    }
  }

  if (isMom(data[id2Index])) {
    let momIndex = getMomArrayIndex(momArray, id2);
    for (let i = 0; i < momArray[momIndex][0].children.length; ++i) {
      momArray[momIndex][0].children[i].mother = id1;
    }
  }

  momArray = makeMomArray();
  
  sortData();
  createChart(chartList);

  document.getElementById('confirmBox').innerHTML = '';
}
*/

let chartList = document.getElementById('chart');

createChart(chartList);

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
    nodeBoxData.splice(spouse1Index, 1);
  } 

  //What if spouse2 is in nodeBoxData
  if (getNodeBoxDataIndex(spouse2.image) != null) {
    spouse2Index = getNodeBoxDataIndex(spouse2.image);
    data.push(nodeBoxData[spouse2Index]);
    nodeBoxData.splice(spouse2Index, 1);
  }

  if (getDataIndex(spouse1.image) != null) {
    spouse1Index = getDataIndex(spouse1.image);
    data[spouse1Index].spouse = spouse2.image;
  }

  if (getDataIndex(spouse2.image) != null) {
    spouse2Index = getDataIndex(spouse2.image);
    data[spouse2Index].spouse = spouse1.image;
  }

  sortData();
  createChart(chartList);

  document.getElementById('confirmBox').innerHTML = '';

  closeMenu();

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

  closeMenu();

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

    closeMenu()

    return;
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

  closeMenu();
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
  }
}

function changeRemoveButtonParameters() {
  let box = document.getElementById('confirmBox');
  let children = [];

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4));
  }

  let button = document.getElementById('removeButton');

  if (children.length != 0) {
    let param1 = children[0];
    let param2 = children[1];
    button.setAttribute('onclick',`changeRemoveButtonParameters(), removeRelationship(${param1}, ${param2})`);

  }
}

function addToConfirmBox(id) {
  let box = document.getElementById('confirmBox');

  for (let i = 0; i < box.children.length; ++i) {
    if (box.children[i].id == `node${id}`) {
      return;
    }
  }

  if (box.children.length >= 2) {
    alert("Can't have more than 2 nodes in confirmation box.");
    box.innerHTML = '';
    return;
  }

  let nodeId = `node${id}`;
  let img = document.createElement('img');

  img.setAttribute('id', nodeId);
  img.setAttribute('class', 'node-image');
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`);

  box.appendChild(img);

  //Changes Parameters for Change Relationship button
  //FIXME consider making this part its own function
  let children = [];

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  let button = document.getElementById('changeButton');

  //Open Menu immediately when there are two nodes in confirmBox
  if (children.length == 2) {
    let param1 = children[0];
    let param2 = children[1];

    openMenu(param1, param2);
  }
}

function addToNodeContainer(id) {

  let index = getDataIndex(id);

  nodeBoxData.push(data[index]);

  let container = document.getElementById('nodeContainer');
  let nodeId = `node${id}`;
  let button = document.createElement('button');
  let img = document.createElement('img');

  img.setAttribute('id', nodeId);
  img.setAttribute('class', 'node-image');
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`);

  button.setAttribute('id', `button${id}`);
  button.setAttribute('class', 'nodeBox-button');
  button.setAttribute('onclick', `addToConfirmBox(${id}), removeFromNodeContainer(${id})`);

  button.appendChild(img);

  container.appendChild(button);
}

function removeFromNodeContainer(id) {

  let container = document.getElementById('nodeContainer');

  let child = document.getElementById("button" + id);

  container.removeChild(child);
}

function openMenu(id1, id2) {
  let box = document.getElementById('confirmBox');


  if (box.children.length == 2) {
    let menu = document.getElementById('center-menu');

    menu.innerHTML = `<div id='center-menu' class='center-menu'>
  
    <div><button onclick='closeMenu()'>X</button></div>

    <div class='menu-pics-container'>
      <img class='menu-pic' src='../../static/tree/images/pictures/${id1}.PNG'/>
      <img class='menu-pic' src='../../static/tree/images/pictures/${id2}.PNG'/>
    </div>

    <div class='menu-button'>
      <button id='removeButton' class='button-34' onclick='removeRelationship(${id1}, ${id2})'>Remove Relationship</button>
      <button id='addMotherButton' class='button-34' onclick=addMotherRelationship(${id1}, ${id2})>Add Mother/Child Relationship</button>
      <button id='addSpouseButton' class='button-34' onclick=addSpouseRelationship(${id1}, ${id2})>Add Spouse Relationship</button>
    </div>
    </div>`

  } else {
    let menu = document.getElementById('center-menu');
    menu.innerHTML = '';
  }


  changeRemoveButtonParameters()
  changeAddButtonParameters()
}

function closeMenu() {
  let menu = document.getElementById('center-menu') 
  menu.innerHTML = '';

  let confirmBox = document.getElementById('confirmBox');
  confirmBox.innerHTML = '';
}








function createChart(chart) {
  createDataPoints(chart);

  //Testing
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      adjustSpouseXPos(data[i]);
    }
  }


  adjustChildNodesXPos(data[8]);
  adjustChildNodesXPos(data[13]);
  //adjustChildNodesXPos(data[getDataIndex(11)])

  createChildLines();
  createSpouseLines();
}

//Creates Data Points
function createDataPoints(chart) {
  //In case you have to redraw chart
  removeAllChildNodes(chart);

  let generationMap = new Map();

  let genCount = 0;
  for (let j = 0; j < data.length; ++j) {
    let tmp = getGenerationCount(data[j], 1);
    if (tmp > genCount) {
      genCount = tmp;
    }
  }

  for (let j = 0; j < genCount; ++j) {
    generationMap.set(j+1, 1);
  }


  for (let i = 0; i < data.length; ++i) {
    let li = document.createElement('li');

    let genCount = 0;
    for (let j = 0; j < data.length; ++j) {
      let tmp = getGenerationCount(data[j], 1);
      if (tmp > genCount) {
        genCount = tmp;
      }
    }


    //Getting X and Y Positions
    let gen = getGeneration(data[i]);

    let dividedHeight = chartWidth / genCount;
    let yPos = getY(dividedHeight, gen);

    let xPos = getX(data[i], generationMap, chartWidth);
/*
//TESTING For placing right next to Spouse`
    if (data[i].spouse != null) {
      let spouseIndex = getDataIndex(data[i].spouse)

      //tmpMap created so that generationMap doesn't get updated too early
      let tmpMap = generationMap
      if (data[i].image < data[spouseIndex].image) {
        xPos = getX(data[spouseIndex], tmpMap, chartWidth)
      }
    }
    //
*/
    li.setAttribute('id', data[i].image);
    li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`);
    li.innerHTML += `<button id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'><img class="data-point data-button" data-value="${data[i].birthyear}" src="../../static/tree/images/pictures/${data[i].image}.PNG"></button>`;
  
    chart.appendChild(li);
  }

}

//Draws Line To Children
function createChildLines() {
  for (let i = 0; i < data.length; ++i) {

    if (isMom(data[i])) {
      let li = document.getElementById(data[i].image);
  
      yPos = parseAttribute('y', li.getAttribute('style'));
      xPos = parseAttribute('x', li.getAttribute('style'));
      
      let index = getMomArrayIndex(momArray, data[i].image);

      //Getting longest generation chain
      let genCount = 0;
      for (let j = 0; j < data.length; ++j) {
        let tmp = getGenerationCount(data[j], 1);
        if (tmp > genCount) {
          genCount = tmp;
        }
      }

      for (let j = 0; j < momArray[index][0].children.length; ++j) {

        let dividedHeight = chartWidth / genCount;
        let gen = getGeneration(momArray[index][0].children[j]);
        let childYPos = getY(dividedHeight, gen);

        let childElement = document.getElementById(momArray[index][0].children[j].image);
        let childXPos = parseAttribute('x', childElement.getAttribute('style'));


        let childHypotenuse = getHypotenuse(yPos, childYPos, xPos, childXPos);
        let angle = getAngle(yPos - childYPos, childHypotenuse);
  
        //Adjusts angle if child is before mom in x-axis
        if (childXPos < xPos) {
          angle = (-1 * angle) + 180.5;
        }
  
        li.innerHTML += `<div class="child-line" style="--hypotenuse: ${childHypotenuse}; --angle: ${angle}"></div>`;
        //FIXME kind of works but positionins is all wrong
        //li.innerHTML += `<button class="button-line" onclick="hi()"><div class="child-line" style="--hypotenuse: ${childHypotenuse}; --angle: ${angle}; z-index:-1;"></div></button>`;
      }
    }
  }
}

function hi() {
  console.log("Hello World!");
}

//Draws Line Connecting to Spouse
function createSpouseLines() {
  for (let i = 0; i < data.length; ++i) {

    let li = document.getElementById(data[i].image);

    yPos = parseAttribute('y', li.getAttribute('style'));
    xPos = parseAttribute('x', li.getAttribute('style'));

    //Getting longest generation chain
    let genCount = 0;
    for (let j = 0; j < data.length; ++j) {
      let tmp = getGenerationCount(data[j], 1);
      if (tmp > genCount) {
        genCount = tmp;
      }
    }

    if (data[i].spouse != null) {

      let dividedHeight = chartWidth / genCount;
      let gen = getGeneration(data[i]);
      let spouseYPos = getY(dividedHeight, gen);

      let spouseElement = document.getElementById(data[i].spouse);
      let spouseXPos = parseAttribute('x', spouseElement.getAttribute('style'));

      let spouseHypotenuse = getHypotenuse(yPos, spouseYPos, xPos, spouseXPos);
      let spouseAngle = getAngle(yPos - spouseYPos, spouseHypotenuse);

      if (spouseXPos < xPos) {
        spouseAngle = (-1 * spouseAngle) + 180.5;
      }

      //if statement so that two spouse lines aren't drawn between spouses
      if (spouseXPos > xPos) {
        li.innerHTML += `<div class="spouse-line" style="--hypotenuse: ${spouseHypotenuse}; --angle: ${spouseAngle}"></div>`;
      }
    }
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function getY(dividedHeight, generation) {
  //Added chartWidth / 6 for better centered spacing
  return (chartWidth  + (chartWidth / 6)) - dividedHeight * generation;
}

function getX(node, map, width) {
  let genCount = 0;
  let xPos;

  //Gets highest Generation
  for (let j = 0; j < data.length; ++j) {
    let tmp = getGenerationCount(data[j], 1);
    if (tmp > genCount) {
      genCount = tmp;
    }
  }

  let currGeneration;
  let keyGen = getGeneration(node);

  currGeneration = map.get(keyGen);

  xPos = (width / getNumInGeneration(keyGen)) * currGeneration;
  currGeneration++;

  map.set(keyGen, currGeneration);

  return xPos;

}

function getHypotenuse(datapoint1, datapoint2, left1, left2) {
  triSide = datapoint1 - datapoint2;
  tmpSpacing = left1 - left2;
  hypotenuse = Math.sqrt((triSide * triSide) + (tmpSpacing * tmpSpacing));
  return hypotenuse;
}

//Get the angle to place line in between nodes
function getAngle(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse);
  //Convert from radians to degrees
  sine = sine * (180 / Math.PI);

  return sine;
}

function getDataIndex(id) {
  for (let i = 0; i < data.length; ++i) {
    if (id === data[i].image) {
      return i;
    }
  }
  return null;
}

function getNodeBoxDataIndex(id) {
  for (let i = 0; i < nodeBoxData.length; ++i) {
    if (id === nodeBoxData[i].image) {
      return i;
    }
  }
  return null;
}

function getMomArrayIndex(array, id) {
  for (let i = 0; i < array.length; ++i) {
    if (array[i][0].data.image == id) {
      return i;
    }
  }
}

//For testing with different data positions
function randomizeDataOrder(data) {
  for (let i = 0; i < data.length; ++i) {
    let randomIndex = Math.floor(Math.random() * data.length);
    let tmpVal = data[randomIndex];
    data[randomIndex] = data[i];
    data[i] = tmpVal;
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
  return isMom;
}

function parseAttribute(lookFor, attribute) {
  let numString = '';
  if (lookFor == 'y') {
    for (let i = 0; i < attribute.length; ++i) {
      if (attribute[i] == 'y') {
        let j = i + 2 //skips colon and white space
        while (attribute[j] != 'p') {
          numString += attribute[j];
          j++;
        }

      }
    }
  }

  if (lookFor == 'x') {
    for (let i = 0; i < attribute.length; ++i) {
      if (attribute[i] == 'x' && attribute[i-1] != 'p') {
        let j = i + 2; //skips colon and white space
        while (attribute[j] != 'p') {
          numString += attribute[j];
          j++;
        }
      }
    }
  }
  return parseInt(numString);
}

function hasRelationship(node) {

  let hasRelationship = false;

  if (node.spouse != null) {
    hasRelationship = true;
  }

  if (isMom(node)) {
    hasRelationship = true;
  }

  if (node.mother != null) {
    hasRelationship = true;
  }

  return hasRelationship;

}

//JUST FOR TESTING, WILL REPLACE WITH POSITIONING ALGORITHM
function sortData() {
  for (let i = 0; i < data.length; ++i) {
    for (let j = i+1; j < data.length; ++j) {
      if (data[j].image < data[i].image) {
        let tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
      }
    }
  }
}





//Gets highest generation count
function getGenerationCount(node, count) {
  if (node.mother == null) {
      if (node.spouse != null) {
      let spouseIndex = getDataIndex(node.spouse) ;
      if (data[spouseIndex].mother != null) {
        let motherIndex = getDataIndex(data[spouseIndex].mother);
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

function getGeneration(node) {
  let count = 1;

  count = getGenerationCount(node, count);

  return count;
}

function getNumInGeneration(generation) {
  let numInGen = 0;
  for (let i = 0; i < data.length; ++i) {
    if (getGeneration(data[i]) == generation) {
      numInGen++;
    }
  }
  return numInGen;
}

function getNodesInGeneration(generation) {
  let nodeGeneration = [];
  for (let i = 0; i < data.length; ++i) {
    if (getGeneration(data[i]) == generation) {
      nodeGeneration.push(data[i]);
    }
  }

  return nodeGeneration;
}









//XSpacing For Children Testing
function getChildren(motherNode) {
  let children = [];
  if (isMom(motherNode)) {
    let index = getMomArrayIndex(momArray, motherNode.image);
    for (let i = 0; i < momArray[index][0].children.length; ++i) {
      children.push(momArray[index][0].children[i]);
    }
  }

  return children;
}

function getSiblings(childNode) {
  let siblings = [];

  let momIndex = getDataIndex(node.mother);

  siblings = getChildren(data[momIndex]);

  return siblings;
}











function getSpacing(numChildren, spacing) {
  //Need to know, how large the spacing is for the generation before it,
  //Recursive function going from top to bottom??

  //Generation Matters

  let children = getChildren();


  return getSpacing(children.length, (spacing / numChildren));
  
}


//You have at to adjust them after all children have been placed already
//TODO finish function to get spacing of the section that each node "family" gets from chartwidth
//This function works I just need to figure out spacing and fix bugs
//Will probably merge with the getX function
function adjustChildNodesXPos(momNode) {

  let children = getChildren(momNode);

  let mom = document.getElementById(`${momNode.image}`)
  let momXPos = parseAttribute('x', mom.style.cssText)
  let spacing = 100

  //If there are an odd number of children
  if (children.length % 2 == 1) {

    //FIXME there are already drawn nodes in xPos's so this causes errors
    //TRY setting up children x to 0 and then go from there
    for (let i = 0; i < children.length; ++i) {
      let child = document.getElementById(`${children[i].image}`)
      let originalY = parseAttribute('y', child.style.cssText)
      child.setAttribute('style', `--y: ${originalY}px; --x: ${0}px`)
    }
    //End Try

    for (let i = 0; i < children.length; ++i) {

      let child = document.getElementById(`${children[i].image}`);

      let newXPos;
      let originalY = parseAttribute('y', child.style.cssText);

      let childGeneration = getGeneration(children[i]);

      if (i == 0) {
        newXPos = momXPos;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }

      else if (emptyXLocation(momXPos + spacing, childGeneration)) {
        newXPos = momXPos + spacing;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }
    
      else if (emptyXLocation(momXPos - spacing, childGeneration)) {
        newXPos = momXPos - spacing;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }

      else {
        spacing += 100;
        //If gets to else and doesn't get placed, then it would skip over the child, thus the i -= 1
        i -= 1;
      }
    }
  }

  //If Even amount of children
  if (children.length % 2 == 0) {

    let spacing = 150;

    //TEST
    for (let i = 0; i < children.length; ++i) {
      let child = document.getElementById(`${children[i].image}`);
      let originalY = parseAttribute('y', child.style.cssText);
      child.setAttribute('style', `--y: ${originalY}px; --x: ${0}px`);
    }
    //

    for (let i = 0; i < children.length; ++i) {

      let child = document.getElementById(`${children[i].image}`);

      let newXPos;
      let originalY = parseAttribute('y', child.style.cssText);

      let childGeneration = getGeneration(children[i]);

      if (i == 0) {
        newXPos = momXPos + 50;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }

      else if (i == 1) {
        newXPos = momXPos - 50;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }

      else if (emptyXLocation(momXPos + spacing, childGeneration)) {
        newXPos = momXPos + spacing;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }
    
      else if (emptyXLocation(momXPos - spacing, childGeneration)) {
        newXPos = momXPos - spacing;
        child.setAttribute('style', `--y: ${Math.round(originalY)}px; --x: ${Math.round(newXPos)}px`);
      }

      else {
        spacing += 100;
        //If gets to else and doesn't get placed, then it would skip over the child, thus the i -= 1
        i -= 1;
      }

    }


  }
}

function adjustSpouseXPos(node) {
  let spouse = document.getElementById(`${node.spouse}`);
  let currNode = document.getElementById(`${node.image}`);

  let spouseXPos = parseAttribute('x', spouse.style.cssText);
  let nodeXPos = parseAttribute('x', currNode.style.cssText);

  let generation = getGeneration(node)

  let spacing = 100;

  if (nodeXPos < spouseXPos && emptyXLocation(spouseXPos - spacing, generation)) {
    nodeXPos = spouseXPos - spacing;

    let originalY = parseAttribute('y', currNode.style.cssText);
    currNode.setAttribute('style', `--y: ${originalY}px; --x: ${nodeXPos}px`);
  
  }
}

//Need to check only in that generation
//FIXME could potentially be overlap of nodes because this checks for EXACT x, not range of x
function emptyXLocation(xPos, generation) {
  let chart = document.getElementById('chart');

  let isEmpty = true;

  let nodesInGeneration = getNodesInGeneration(generation);

  for (let i = 0; i < nodesInGeneration.length; ++i) {
    let node = document.getElementById(`${nodesInGeneration[i].image}`);
    let tmpX = parseAttribute('x', node.style.cssText);

    if ((xPos == tmpX)) {
      isEmpty = false;
      return isEmpty;
    }
  }

  return isEmpty;
}