let data = [
  {
    "image": 1,
    "mother": null,
    "spouse": 2,
    "birthyear": 1888,
    "name": "Joseph P. Kennedy",
  },
  {
    "image": 2,
    "mother": null,
    "spouse": 1,
    "birthyear": 1890,
    "name": "Rose Fitzgerald",
  },
  {
    "image": 3,
    "mother": 2,
    "spouse": null,
    "birthyear": 1915,
    "name": "Joseph P. Kennedy Jr.",
  },
  {
    "image": 4,
    "mother": 2,
    "spouse": 5,
    "birthyear": 1917,
    "name": "John F. Kennedy",
  },
  {
    "image": 5,
    "mother": null,
    "spouse": 4,
    "birthyear": 1929,
    "name": "Jacqueline Bouvier",
  },
  {
    "image": 6,
    "mother": 5,
    "spouse": null,
    "birthyear": 1957,
    "name": "Caroline Kennedy",
  },
  {
    "image": 7,
    "mother": 5,
    "spouse": null,
    "birthyear": 1960,
    "name": "John F. Kennedy Jr.",
  },
  {
    "image": 8,
    "mother": 2,
    "spouse": null,
    "birthyear": 1918,
    "name": "Rosemary Kennedy",
  },
  {
    "image": 9,
    "mother": 2,
    "spouse": 10,
    "birthyear": 1920,
    "name": "Kathleen Kennedy",
  },
  {
    "image": 10,
    "mother": null,
    "spouse": 9,
    "birthyear": 1917,
    "name": "William Cavendish",
  },
  {
    "image": 23,
    "mother": 2,
    "spouse": 24,
    "birthyear": 1925,
    "name": "Robert Kennedy",
  },
  {
    "image": 24,
    "mother": null,
    "spouse": 23,
    "birthyear": 1928,
    "name": "Ethel Skakel",
  },
  {
    "image": 25,
    "mother": 24,
    "spouse": null,
    "birthyear": 1952,
    "name": "Robert F. Kennedy Jr.",
  },
  {
    "image": 26,
    "mother": 24,
    "spouse": null,
    "birthyear": 1955,
    "name": "David A. Kennedy",
  },
  {
    "image": 27,
    "mother": 24,
    "spouse": null,
    "birthyear": 1956,
    "name": "Mary Courtney Kennedy",
  },
  {
    "image": 28,
    "mother": 24,
    "spouse": null,
    "birthyear": 1958,
    "name": "Michael Kennedy",
  },
]

let nodeBoxData = [];

//Change this and HTML in order to change graph size
//let chartWidth = screen.width;
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


  //Sorts momArray from oldest to youngest
  for (let i = 0; i < tmpArray.length; ++i) {
    for (let j = 0; j < tmpArray.length - i - 1; ++j) {
      if (tmpArray[i][0].data.birthyear < tmpArray[j][0].data.birthyear) {
        let tmp = tmpArray[i]
        tmpArray[i] = tmpArray[j]
        tmpArray[j] = tmp;
      }
    }
  }

  return tmpArray;
}

momArray = makeMomArray();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let chartList = document.getElementById('chart');

createChart(chartList);

//FOR PRESENTATION
function startEmpty() {
  while (data.length != 0) {
    data[0].mother = null;
    data[0].spouse = null;
    addToNodeContainer(data[0].image);
    data.splice(0,1);
  }

  momArray = [];
  createChart(chartList)
}




//All functions for chart creation and functionality

function createChart(chart) {

  createDataPoints(chart);

  createLines();

}

//Creates Data Points
//FIXME: Compare this to function in refactor and make changes
function createDataPoints(chart) {
  //In case you have to redraw chart
  removeAllChildNodes(chart);

  let generationMap = new Map();
  let genCount = getLongestGenChain();

  for (let j = 0; j < genCount; ++j) {
    generationMap.set(j+1, 1);
  }
  
  for (let genIndex = 0; genIndex < (genCount + 1); genIndex++) { //creates data points now from oldest to youngest gen
    for (let i = 0; i < data.length; ++i) { //iterates through the entire data set to check if gen matches up
      let gen = getGeneration(data[i]);
      if (gen == genIndex) {

      //Getting X and Y Positions
      let li = document.createElement('li');
      let dividedHeight = chartWidth / genCount;
      let yPos = getY(dividedHeight, gen);

      
      let placeInGen = getPlaceInGeneration(data[i], gen);
      if (placeInGen == undefined) {
        placeInGen = 0;
      }
      

      li.setAttribute('id', data[i].image);
      let xPos;
      
      if (gen < 3) {
        //If it is a first or second gen node
        xPos = setHighGenX(data[i], generationMap, chartWidth, placeInGen);
      }
      else {
        //If it is a third gen or greater node
        let widthOfFamily = getWidthOfFamily(data[i]);
        let firstRun = true;
        xPos = setChildX(data[i], widthOfFamily, firstRun);
      }


      li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`);

      li.innerHTML += `<div id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'>
      <img class="data-point data-button" src="../../static/tree/images/pictures/Kennedy/${data[i].image}.PNG" onmouseenter='hoverMenu(${data[i].image})' onmouseleave='closeHoverMenu()'>
      </div>`
      
      chart.appendChild(li);
      }
    }
  }
  //center the chart
  shiftChart();
}

function testAdd(node1, node2) {

  let id1 = node1.image;
  let id2 = node2.image;

  let id1Birthyear;
  let id2Birthyear;

  let id1Index = getDataIndex(parseInt(id1));
  let id2Index = getDataIndex(parseInt(id2));

  //These statements account for if the node is in the data or nodeBoxData
  if (id1Index != null) {
    id1Birthyear = data[id1Index].birthyear
  }
  if (id2Index != null) {
    id2Birthyear = data[id2Index].birthyear
  }
  if (id1Index == null) {
    id1Index = getNodeBoxDataIndex(parseInt(id1));
    id1Birthyear = nodeBoxData[id1Index].birthyear;
  }
  if (id2Index == null) {
    id2Index = getNodeBoxDataIndex(parseInt(id2));
    id2Birthyear = nodeBoxData[id2Index].birthyear;
  }

  $('#center-menu').html(
  `<div id='center-menu' class='center-menu'>
    <div><button onclick='closeMenu()'>X</button></div>
    <div class='menu-pics-container'>
      <div>
        <img class='menu-pic' src='../../static/tree/images/pictures/Kennedy/${id1}.PNG'/>
        <div id ='node-${id1}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column; padding-top: 5px;'>
          <div><b>${node1.name}</b></div>
          <div><b>${id1Birthyear}</b></div>
        </div>
      </div>
      <div>
        <img class='menu-pic' src='../../static/tree/images/pictures/Kennedy/${id2}.PNG'/>
        <div id ='node-${id2}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column; padding-top: 5px;'>
          <div><b>${node2.name}</b></div>
          <div><b>${id2Birthyear}</b></div>
        </div>
      </div>
    </div>
    <div class='menu-button'>
      <button id='removeButton' class='button-34' onclick='removeRelationship(${id1}, ${id2})'>Remove Relationship</button>
      <button id='addMotherButton' class='button-34' onclick='addMotherRelationship(${id1}, ${id2})'>Add Mother/Child Relationship</button>
      <button id='addSpouseButton' class='button-34' onclick='addSpouseRelationship(${id1}, ${id2})'>Add Spouse Relationship</button>
    </div>
  </div>`)

  //FIXME: Causing DOM removal error, idk why not neccesay
  //removeFromNodeContainer(id1)

}

function testRemoveFromConfirmBox(id1, id2) {
  
  if (nodeBoxData[getNodeBoxDataIndex(id1)] != null) {
    testAdd(nodeBoxData[getNodeBoxDataIndex(id1)], data[getDataIndex(id2)])
  }
}

function shiftChart() {
  //1. Shift all nodes to the left to better align on the screen
  //XBuffer: A specified X value to shift all of the nodes to the left by
  let xBuffer = 200;
  shiftNodesByMargin(xBuffer);
  
  //2. fix spouse X positioning
  //FIXME: may not be needed with the new fixSecondGenSpacing function
  //fixSpouseXPos();
  
  //3. Adjust spacing between children of the 2nd gen (and their children) so they are all equally spaced
  fixSecondGenNodeSpacing();
  
  //4. Center Root Node between her leftmost and rightmost child
  //FIXED: adjust root node (just got rid of the loop, don't know why I was iterating through all the data haha)
  adjustRootNode();
}

function createLines() {

  //FIXME: SVG has to be wider than chartwidth, however find better way of doing this, don't use magic number
  let svgString = `<svg id='lines' height="${chartWidth}" width="${chartWidth+1000}" xmlns="http://www.w3.org/2000/svg" style='z-index:-1;'>`;

  for (let i = 0; i < data.length; ++i) {

    let li = $(`#${data[i].image}`);
    let yPos = parseAttribute('y', li[0].style.cssText);
    let xPos = parseAttribute('x', li[0].style.cssText);

    //Creates Child Lines
    if (hasChildren(data[i])) {   

      let index = getMomArrayIndex(momArray, data[i].image);

      for (let j = 0; j < momArray[index][0].children.length; ++j) {

        let childElement = $(`#${momArray[index][0].children[j].image}`)

        let x1 = xPos;
        let x2 = parseAttribute('x', childElement[0].style.cssText);
        let y1 = yPos;
        let y2 = parseAttribute('y', childElement[0].style.cssText);

        svgString += `<line class='svg-line' x1="${x1}" y1="${chartWidth - y1}" x2="${x2}" y2="${chartWidth - y2}" stroke="black" stroke-width='6' onclick='testAdd(data[${i}], momArray[${index}][0].children[${j}])'/>`
      }
    }

    //Creates Spouse Lines
    if (data[i].spouse != null) {

      let spouseElement = $(`#${data[i].spouse}`);
      let spouseXPos = parseAttribute('x', spouseElement[0].style.cssText);
      let spouseYPos = parseAttribute('y', spouseElement[0].style.cssText);

      let line = `<line class='svg-line' x1="${xPos}" y1="${chartWidth - yPos}" x2="${spouseXPos}" y2="${chartWidth - spouseYPos}" stroke="blue" stroke-width='6' onclick='testAdd(data[${i}], data[getDataIndex(data[${i}].spouse)])'/>`

      //if statement so that two spouse lines aren't drawn between spouses
      if (spouseXPos > xPos) {
        svgString += line
      }
    }
  }

  svgString += "</svg>"
  $('#chart').html($('#chart').html() + svgString);
}

function shiftNodesByMargin(xBuffer) {
  
  //Get the leftmost XPos on tree
  let xPos = getX(data[0].image);
  let checkXPos;
  
  for (let i = 1; i < data.length; i++) {
    checkXPos = getX(data[i].image);
    if (checkXPos < xPos) {
      xPos = checkXPos;
    }
  }

  //shift the xPos of every node by the margin
  let margin = Math.abs(xPos - xBuffer);
  
  for (let i = 0; i < data.length; i++) {
    let node = document.getElementById(data[i].image);
    let originalY = parseAttribute('y', node.style.cssText);
    let originalX = parseAttribute('x', node.style.cssText);
    node.setAttribute('style', `--y: ${originalY}px; --x: ${originalX + margin}px`);
  }
}

function fixSpouseXPos() {
  let fixedSpouses = []
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      if (fixedSpouses.every(element => element != data[i].image)) {
        adjustSpouseXPos(data[i], fixedSpouses);
      }
    }
  }
}

function adjustSpouseXPos(node, fixedSpouses) {
  let spouseElement = document.getElementById(`${node.spouse}`);
  let spouseId = node.spouse;
  let spouseNode = getNode(spouseId);
  let spouseXPos = getX(spouseId);

  let currNodeElement = document.getElementById(`${node.image}`);
  let currNodeXPos = getX(node.image);

  let spacing = 100;
  let originalY = parseAttribute('y', spouseElement.style.cssText);

  if (hasChildren(spouseNode)) {
    currNodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${spouseXPos - spacing}px`);
  } else {
    spouseElement.setAttribute('style', `--y: ${originalY}px; --x: ${currNodeXPos + spacing}px`);
  }

  fixedSpouses.push(spouseId);
  fixedSpouses.push(node.image);
}

function fixSecondGenNodeSpacing() {
  
  let rootNode = getRootNode(data[0]);
  let rootNodeChildren = getChildren(rootNode);

  //find the max difference in x position between each child in the second gen
  let maxDiff = 0;
  let childrenXPos = []
  for (let i = 0; i < rootNodeChildren.length; i++) {
    let currChildXPos = getX(rootNodeChildren[i].image);
    childrenXPos.push(currChildXPos);
    if (i != 0) {
      let currDiff = childrenXPos[i] - childrenXPos[i - 1];
      if (currDiff > maxDiff) {
        maxDiff = currDiff;
      }
    }
  }

  //update all node's x positions by the maxXDiff
  for (let i = 1; i < rootNodeChildren.length; i++) {
    let currDiff = getX(rootNodeChildren[i].image) - getX(rootNodeChildren[i - 1].image);
    if (currDiff != maxDiff) {
      updateXPos(rootNodeChildren[i], getX(rootNodeChildren[i - 1].image) + maxDiff);
    }
  }
}

function updateXPos(node, newXPos) {
  setX(node, newXPos);

  //if node has spouse
  if (node.spouse != null) {
    newXPos = newXPos + 100;
    setX(getNode(node.spouse), newXPos);
    
    //if node's spouse has children
    if (hasChildren(getNode(node.spouse))) {
      let nodeChildren = getChildren(getNode(node.spouse));
      for (let i = 0; i < nodeChildren.length; i++) {
        let firstRun = false;
        setX(nodeChildren[i], setChildX(nodeChildren[i], getWidthOfFamily(nodeChildren[i]), firstRun));
      }
    }
  }

  //if node has children
  if (hasChildren(node)) {
    let nodeChildren = getChildren(node);
    for (let i = 0; i < nodeChildren.length; i++) {
      let firstRun = false;
      setX(nodeChildren[i], setChildX(nodeChildren[i], getWidthOfFamily(nodeChildren[i]), firstRun));
    }
  }
}

/**
 * Finds the x positions of the leftmost and rightmost child 
 * of the root node and sets the x position of the rootnode
 * and root spouse at the central position of those two nodes.
 */
//FIXED: Issue was with getting the leftmost and rightmost nodes
function adjustRootNode() {

  let leftmostChild = getLeftmostChild(getRootNode(data[0]));
  let rightmostChild = getRightmostChild(getRootNode(data[0]));
  let leftChildX = getX(leftmostChild.image);
  let rightChildX = getX(rightmostChild.image);
  let newXPos = (leftChildX + rightChildX)/2;
  
  let rootNodeElement = document.getElementById(getRootNode(data[0]).image);
  let rootNodeSpouse = document.getElementById(getRootNode(data[0]).spouse);
  let originalY = parseAttribute('y', rootNodeElement.style.cssText);
  
  rootNodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos}px`);
  if (rootNodeSpouse != null) {
    rootNodeSpouse.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos + 100}px`);
  }
}

function setX(node, newXPos) {
  let nodeElement = document.getElementById(node.image);
  let originalY = parseAttribute('y', nodeElement.style.cssText);
  nodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos}px`);
}

//NEW getX Function (for gen1 and gen2 nodes)
function setHighGenX(node, map, width, placeInGen) {
  let keyGen = getGeneration(node);

  let xPos = (width/(getNumInGeneration(keyGen) + 1)) * (placeInGen + 1);
  return xPos;
}

//setX for gen3 and above nodes
function setChildX(node, widthOfFamily, firstRun) {
  let numChildren = getNumChildrenInFamily(node);
  let placeInFam = getPlaceInFamily(node);
  
  let nodeMother = node.mother;
  let momXPos = getX(nodeMother);
  
  let famSpacing = widthOfFamily/(numChildren + 1);

  let momGen = getGeneration(node.mother);
  let momsInGen = getMomsInGen(momGen);

  let xPos;
    for (let i = 0; i < momsInGen.length; i++) {
      xPos = (famSpacing * placeInFam) + (momXPos - (widthOfFamily/2));
    }
    
    //adjust positions of higher gen nodes
    if (firstRun) {
      if (numChildren > 1) {
        adjustHigherGenNodes(nodeMother, momXPos);
      }
    }

  return xPos;
}

function adjustHigherGenNodes(nodeMother, currentMomNodeXPos) {
  
  let motherId = getDataIndex(nodeMother);
  let mother = data[motherId];
  
  //Get an array of the children nodes
  let childNodeArray = getChildren(mother);
  let nodesToAdjust = []

  //1. Get the xPositions of all nodes besides the mom and her children
  for (let i = 0; i < data.length; i++) {
    if (!childNodeArray.some(element => element == data[i]) && isOnTree(data[i])) {
      nodesToAdjust.push(data[i]);
    }
  }
  let nodesXPositions = []
  for (let i = 0; i < nodesToAdjust.length; i++) {
    nodesXPositions.push(getX(nodesToAdjust[i].image));
  }

  //2. Adjust the xPositions of elements in the momXPositions array
  let adjustX = 30;
  for (let i = 0; i < nodesXPositions.length; i++) {
    if (nodesXPositions[i] > currentMomNodeXPos) {
      nodesXPositions[i] += adjustX;
    }
    else if (nodesXPositions[i] < currentMomNodeXPos) {
      nodesXPositions[i] -= adjustX;
    }
  }

  //3. Adjust the corresponding node elements with their new xPositions
  for (let i = 0; i < nodesToAdjust.length; i++) {
    let node = document.getElementById(nodesToAdjust[i].image);
    let originalY = parseAttribute('y', node.style.cssText);
    node.setAttribute('style', `--y: ${originalY}px; --x: ${nodesXPositions[i]}px`);
  }
}

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

  
  createChart(chartList);

  document.getElementById('confirmBox').innerHTML = '';

  closeMenu();

}

//TODO fix issues
//ADDED TEST SPACING FOR PRESENTATION
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
  
  createChart(chartList)

  document.getElementById('confirmBox').innerHTML = ''

  closeMenu();

}

//FIXME: If nodes are in different gens, it should not remove the line
//TODO: What is the purpose of this function? - Brandon
function removeSpouseLine(id1, id2) {
  let node1XPos = getX(id1);
  let node2XPos = getX(id2);
  let node1Elem = document.getElementById(id1);
  let node2Elem = document.getElementById(id2);
  let node1YPos = parseAttribute('y', node1Elem.style.cssText);
  let node2YPos = parseAttribute('y', node2Elem.style.cssText);
  
  const svgLines = document.querySelectorAll(".svg-line");
  for (let i = 0; i < svgLines.length; i++) {
    let elem1X = svgLines[i].x1.baseVal.value;
    let elem1Y = svgLines[i].y1.baseVal.value;
    let elem2X = svgLines[i].x2.baseVal.value;
    let elem2Y = svgLines[i].y2.baseVal.value;

    if (node2XPos == elem1X && node1XPos == elem2X && (node1YPos - elem1Y) < 30 && (node2YPos - elem2Y) < 30) {
      svgLines[i].remove();
    }
  }
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

    closeMenu();

    createChart(chartList);

    let box = document.getElementById('confirmBox');
    box.innerHTML = ''
    box.style.border = ''
    
    return;
  }

  //Removes Mother/Child Relationship
  id1Index = getDataIndex(id1);
  id2Index = getDataIndex(id2);

  if (data[id1Index].mother == id2) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i][0].data.image == id2) {
        for (let j = 0; j < momArray[i][0].children.length; ++j) {
          if (momArray[i][0].children[j].image == id1) {
            isRelated = true;

            data[id1Index].mother = null;

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image);
              data.splice(id1Index, 1);
            }

            id2Index = getDataIndex(id2);
            
            momArray = makeMomArray();

            if (!hasRelationship(data[id2Index])) {
              addToNodeContainer(data[id2Index].image);
              data.splice(id2Index, 1);
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

            data[id2Index].mother = null;

            if (!hasRelationship(data[id2Index])) {
              addToNodeContainer(data[id2Index].image);
              data.splice(id2Index, 1);
            }

            id1Index = getDataIndex(id1);

            momArray = makeMomArray();

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image);
              data.splice(id1Index, 1);
            }

            break;
          }
        }
      }
    }
  }


  if (!isRelated) {
    alert("Error, No Direct Relationship");
  }

  createChart(chartList)

  let box = document.getElementById('confirmBox');
  box.innerHTML = ''
  box.style.border = ''

  closeMenu();
}

function addToConfirmBox(id) {
  let box = document.getElementById("confirmBox");

  //Doesn't let you add a node twice
  for (let i = 0; i < box.children.length; ++i) {
    if (box.children[i].id == `node${id}`) {
      return;
    }
  }

  //Doesn't let you add more than 2 nodes
  if (box.children.length >= 2) {
    alert("Can't have more than 2 nodes in confirmation box.");
    $('#confirmBox').html('');
    return;
  }

  let nodeId = `node${id}`;
  let img = document.createElement('img');

  img.setAttribute('id', nodeId);
  img.setAttribute('class', 'node-image');
  img.setAttribute('src', `../../static/tree/images/pictures/Kennedy/${id}.PNG`);

  $('#confirmBox').append(img);

  //sets border for confirmBox

  if ($('#confirmBox').children.length > 0) {
    $('#confirmBox').css('border', '5px solid black');
  }

  //Parses id to just original ID
  let children = [];

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  //Opens menu with all the info
  if (children.length == 2) {
    let param1 = children[0];
    let param2 = children[1];

    let node1;
    let node2;

    let id1Index = getDataIndex(parseInt(param1));
    let id2Index = getDataIndex(parseInt(param2));
  
    //These statements account for if the node is in the data or nodeBoxData
    if (id1Index != null) {
      node1 = data[id1Index]
    }
    if (id2Index != null) {
      node2 = data[id2Index]
    }
    if (id1Index == null) {
      id1Index = getNodeBoxDataIndex(parseInt(param1));
      node1 = nodeBoxData[id1Index];
    }
    if (id2Index == null) {
      id2Index = getNodeBoxDataIndex(parseInt(param2));
      node2 = nodeBoxData[id2Index]
    }

    testAdd(node1, node2)
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
  img.setAttribute('src', `../../static/tree/images/pictures/Kennedy/${id}.PNG`);

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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function hoverMenu(nodeId) {

  let hMenu = document.getElementById('hover-menu');
  let nodeIndex = getDataIndex(nodeId);
  let node = document.getElementById(nodeId);

  let nodeX = parseAttribute('x', node.style.cssText);
  let nodeY = parseAttribute('y', node.style.cssText);

  let nodeIdName = data[getDataIndex(nodeId)].name

  //Make this class a datapoint technically and make XY pos's from there, just get X,Y from node and then adjust slightly for it to be near node
  hMenu.innerHTML = `
  <div id='hover-menu' class='hover-menu hover-point' style='--y: ${nodeY + 100}px; --x: ${nodeX - 25}px'>
    <div>Gen: ${getGeneration(data[nodeIndex])} <br> Node: ${data[nodeIndex].image}</b><br>Spouse: ${data[nodeIndex].spouse}<br>x: ${nodeX}</div>
      <img class='menu-pic' src='../../static/tree/images/pictures/Kennedy/${nodeId}.PNG'/>
      <div id ='node-${nodeId}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column;'>
        <div><b>${nodeIdName}</br></div>
        <div><b>${data[nodeIndex]?.birthyear}</b></div>
      </div>
  </div>
  `
}

function closeHoverMenu() {
  let menu = document.getElementById('hover-menu');
    menu.innerHTML = '';
}


function closeMenu() {
  let menu = document.getElementById('center-menu') 

  //TODO Add if that put nodedataBox nodes back to nodeBox
  menu.innerHTML = '';

  let confirmBox = document.getElementById('confirmBox');
  confirmBox.innerHTML = '';
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//All helper functions to access data, etc.
function hasSpouse(node) {
  if (node.spouse != null) {
    return true;
  } else {
    return false;
  }
}

function getNode(nodeId) {
  for (let i = 0; i < data.length; i++) {
    if(data[i].image == nodeId) {
      return data[i];
    }
  }
}

function getX(node) {
  if (node != null) {
    let thisNode = document.getElementById(node);
    let nodeXPos = parseAttribute('x', thisNode.style.cssText);
    return nodeXPos;
  }
}

function getY(height, generation) {
  let genCount = getLongestGenChain();
  return (chartWidth + 225) - (chartWidth/genCount + 1) * generation;
  //added a little to chartWidth to center it, can change later
}

function getLongestGenChain() {
  let genCount = 0;
  for (let j = 0; j < data.length; ++j) {
    let tmp = getGenerationCount(data[j], 1);
    if (tmp > genCount) {
      genCount = tmp;
    }
  }
  return genCount;
}

function getPlaceInGeneration(node, generation) {
  let nodeArray = [];
  nodeArray = getNodesInGeneration(generation);

  let placeInGen;
  for (let i = 0; i < nodeArray.length; i++) {
    if(nodeArray[i] == node) {
      placeInGen = i;
    }
  }
  return placeInGen;
}

function getPlaceInFamily(node) {
  let nodeArray = [];
  nodeArray = getFamilyArray(node);

  let placeInFamily;
  for (let i = 0; i < nodeArray.length; i++) {
    if(nodeArray[i] == node) {
      placeInFamily = i;
    }
  }
  return placeInFamily + 1;
}

function getNumChildrenInFamily(node) {
  
  let nodesInFamily = [];
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother == node.mother) {
      nodesInFamily.push(data[i]);
    }
  }
  return nodesInFamily.length;
}

function getFamilyArray(node) {
  
  let nodesInFamily = [];
  for (let i = 0; i < data.length; ++i) {
    if (data[i].mother == node.mother) {
      nodesInFamily.push(data[i]);
    }
  }
  return nodesInFamily;
}

function getWidthOfFamily(node) {
  let width = 800; //TODO: make it variable based on generation
  return width;
}

function getMomsInGen(generation) {
  theMomArray = [];
  //gets all motherId's in data
  for (let i = 0; i < data.length; i++) {
    if(data[i].mother != null) {
      if (theMomArray.every(element => element != data[i].mother)) {
        theMomArray.push(data[i].mother); //push the motherIds
      }
    }
  }
  //gets array of motherId's in generation
  newMomArray = []
  for (let i = 0; i < theMomArray.length; i++) {
    if (getGeneration(theMomArray[i]) == generation) {
      newMomArray.push(theMomArray[i]);
    }
  }
  return newMomArray;
}

function getMother(node) {
  return node.mother;
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

function hasChildren(node) {
  
  let hasChildren = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i]?.mother == node?.image) {
       hasChildren = true;
    }
  }
  return hasChildren;
}

function isOnTree(node) {
  let thisNode = document.getElementById(node.image);
  let checkNode = false;
  if (thisNode != null) {
    checkNode = true;
  }
  return checkNode;
}

function getHypotenuse(datapoint1, datapoint2, left1, left2) {
  triSide = datapoint1 - datapoint2;
  tmpSpacing = left1 - left2;
  hypotenuse = Math.sqrt((triSide * triSide) + (tmpSpacing * tmpSpacing));
  return hypotenuse;
}

function getAngle(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse);
  //Convert from radians to degrees
  sine = sine * (180 / Math.PI);

  return sine;
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

  if (hasChildren(node)) {
    hasRelationship = true;
  }

  if (node.mother != null) {
    hasRelationship = true;
  }

  return hasRelationship;

}

function getGenerationCount(node, count) {
  if (node?.mother == null) {
    if (node?.spouse != null) {
      let spouseIndex = getDataIndex(node.spouse);
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

function getChildren(motherNode) {
  let children = [];
  if (hasChildren(motherNode)) {
    let index = getMomArrayIndex(momArray, motherNode.image);
    for (let i = 0; i < momArray[index][0].children.length; ++i) {
      children.push(momArray[index][0].children[i]);
    }
  }

  return children;
}

function getRootNode(node) {
  if (node.mother == null) {
    let spouseIndex = getDataIndex(node.spouse);
    if (node.spouse != null && data[spouseIndex].mother != null) {
      let motherIndex = getDataIndex(data[spouseIndex].mother);
      return getRootNode(data[motherIndex]);
    }
    else {
      if (!hasChildren(node)) {
        return getNode(node.spouse);
      } else {
        return node;
      }
    }
  }

  if (node.mother != null) {
    let momIndex = getDataIndex(node.mother);
    return getRootNode(data[momIndex]);
  }
}

function getLeftmostChild(momNode) {
  let childElementXPos;
  let leftmostChild;

  for (let i = 0; i < momArray.length; ++i) {



    if (momArray[i][0].data.image == momNode.image) {

      //Initial comparing value
      let tmpChild = document.getElementById(`${momArray[i][0].children[0].image}`);
      childElementXPos = parseAttribute('x', tmpChild.style.cssText)
      leftmostChild = tmpChild.id

      for (let j = 0; j < momArray[i][0].children.length; ++j) {
        let child = document.getElementById(`${momArray[i][0].children[j].image}`);

        let childXPos = parseAttribute('x', child.style.cssText);

        if (childXPos < childElementXPos) {
          childElementXPos = childXPos;
          leftmostChild = child.id
        }
      }
      break;
    }
  }
  return data[getDataIndex(parseInt(leftmostChild))];
}

function getRightmostChild(momNode) {
  let childElementXPos;
  let rightmostChild;

  for (let i = 0; i < momArray.length; ++i) {
    if (momArray[i][0].data.image == momNode.image) {

      //Initial comparing value
      let tmpChild = document.getElementById(`${momArray[i][0].children[0].image}`);
      childElementXPos = parseAttribute('x', tmpChild.style.cssText)
      rightmostChild = tmpChild.id

      for (let j = 0; j < momArray[i][0].children.length; ++j) {
        let child = document.getElementById(`${momArray[i][0].children[j].image}`);

        let childXPos = parseAttribute('x', child.style.cssText);

        if (childXPos > childElementXPos) {
          childElementXPos = childXPos;
          rightmostChild = child.id;
        }
      }
      break;
    }
  }
  return data[getDataIndex(parseInt(rightmostChild))]
}