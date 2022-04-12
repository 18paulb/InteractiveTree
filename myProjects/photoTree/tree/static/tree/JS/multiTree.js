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

//For multi Trees
let dataMap = new Map();
//Hard Coding Root Node for starting tree
dataMap.set(data[1].image, data);

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

function removeRelationship(id1, id2) {
  let id1Index = getDataIndex(id1);
  let id2Index = getDataIndex(id2);

  node1 = getNode(id1);
  node2 = getNode(id2);

  let isRelated = false;

  let oldRoot = getRootNode(getNode(id1));
  let newTree = []

  //Removes Spouse Relationship
  if (data[id1Index].spouse == id2) {

    isRelated = true;

    data[id1Index].spouse = null;
    data[id2Index].spouse = null;

    if (!(hasRelationship(data[id1Index]))) {
      addToNodeContainer(id1);
      data.splice(id1Index, 1);
    }

    id2Index = getDataIndex(id2);

    if (!(hasRelationship(data[id2Index]))) {
      addToNodeContainer(id2);
      data.splice(id2Index, 1);
    }

    closeMenu();

    createChart(chartList);

    let box = document.getElementById('confirmBox');
    box.innerHTML = ''
    box.style.border = ''


    //Testing for multi tree changes
    
    //FIXME: Think about and change these if statements, what if one of the nodes got put in the nodeBoxContainer, etc. Look at fringe cases
    //Note: Spouse is already removed
    if (node1.mother == null && !inNodeBox(node1.image)) {
      newTree = getTreeLine(node1, newTree);
    }
    else if (node2.mother == null && !inNodeBox(node2.image)) {
      newTree = getTreeLine(node2, newTree);
    }
    else {
      //Something
    }

    addToTreeMap(newTree, dataMap.get(oldRoot.image));

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
            
            debugger
            //TODO: Test, will probably break
            //If it is it's own root node
            if ((getRootNode(node1).image == node1.image || getRootNode(node1).image == node1.spouse) && !inNodeBox(node1.image)) {
              newTree = getTreeLine(node1, newTree);
              oldRoot = getRootNode(node2);
              addToTreeMap(newTree, dataMap.get(oldRoot.image));
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

            //debugger

            //TODO: Test, will probably break
            //If it is it's own root node AKA its own tree
            if ((getRootNode(node2).image == node2.image || getRootNode(node2).image == node2.spouse) && !inNodeBox(node2.image)) {
              newTree = getTreeLine(node2, newTree);
              oldRoot = getRootNode(node1);
              addToTreeMap(newTree, dataMap.get(oldRoot.image));
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

function addToTreeMap(newTree, oldTree) {

  let root = getRootNode(newTree[0])

  for (let i = 0; i < oldTree.length; ++i) {
    for (let j = 0; j < newTree.length; ++j) {
      if (newTree[j].image == oldTree[i].image) {
        oldTree.splice(i,1);
        i -= 1
        break;
      }
    }
  }

  dataMap.set(root.image, newTree)
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



//Spacing


/**
 * Currently calls:
 * 1. shiftNodesByMargin
 * 2. fixSecondGenSpacing (since all other gen's spacing depends on 2nd generation)
 *  - TODO: cannot currently add spouses on 3rd or lower gens
 * 3. adjustRootNode
**/
 
 function shiftChart() {
  //1. Shift all nodes to the left to better align on the screen
  //XBuffer: A specified X value to shift all of the nodes to the left by
  let xBuffer = 300;
  shiftNodesByMargin(xBuffer);
  
  //3. Adjust spacing between children of the 2nd gen (and their children) so they are all equally spaced
  fixSecondGenNodeSpacing();
  
  //4. Center Root Node between her leftmost and rightmost child
  //FIXED: adjust root node (just got rid of the loop, don't know why I was iterating through all the data haha)
  adjustRootNode();
}


function fixOverlap(node, leftOverlap, rightOverlap) {
  
  //figure out who the "grandmother" node is (so you can find all her children)
  let nodeMother = getMother(node);
  if (nodeMother == null) 
  {
    nodeMother = getMother(getNode(node.spouse));
  }
  
  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);

  //2. If overlap is to the right:
  if (rightOverlap)
  {
    //get the rightmost child of node
    let rightmostChild;
    if (hasChildren(node)) 
    {
      rightmostChild = getRightmostChild(node);
    } else if (hasChildren(getNode(node.spouse)))
    {
      rightmostChild = getRightmostChild(getNode(node.spouse));
    }

    //get the next mother to the right
    let motherToRight = motherNodeChildren[motherPlaceInGen + 1];
    
    //get the leftmost child of mother to the right
    let rightMotherOverlapChild;
    if (hasChildren(motherToRight)) 
    {
      rightMotherOverlapChild = getLeftmostChild(motherToRight);
    } else if (hasChildren(getNode(motherToRight.spouse)))
    {
      rightMotherOverlapChild = getLeftmostChild(getNode(motherToRight.spouse));
    }

    //set an x value to adjust all nodes to the right by (based on the overlap)
    let xDiff = 151 - (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image));

    //adjust the x positions of all nodes to the right
    for (let motherIndex = motherPlaceInGen + 1; motherIndex < motherNodeChildren.length; motherIndex++)
    {
      let currMother = motherNodeChildren[motherIndex];
      let newXPos;
      
      newXPos = getX(currMother.image) + xDiff;
      updateXPos(currMother, newXPos);
    }
  }
    
  //If overlap is to the left:
  if (leftOverlap)  
  {
    //get the leftmost child of node
    let leftmostChild;
    if (hasChildren(node)) 
    {
      leftmostChild = getLeftmostChild(node);
    } else if (hasChildren(getNode(node.spouse)))
    {
      leftmostChild = getLeftmostChild(getNode(node.spouse));
    }

    //get the next mother to the left
    let motherToLeft = motherNodeChildren[motherPlaceInGen - 1];
    
    //get the rightmost child of mother to the left
    let leftMotherOverlapChild;
    if (hasChildren(motherToLeft)) 
    {
      leftMotherOverlapChild = getRightmostChild(motherToLeft);
    } else if (hasChildren(getNode(motherToLeft.spouse)))
    {
      leftMotherOverlapChild = getRightmostChild(getNode(motherToLeft.spouse));
    }

    //set an x value to adjust all nodes to the left by (based on the overlap)
    let xDiff = 151 - (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image));

    //adjust the x positions of all nodes to the left
    for (let motherIndex = motherPlaceInGen - 1; motherIndex >= 0; motherIndex--)
    {
      let currMother = motherNodeChildren[motherIndex];
      let newXPos;
      
      newXPos = getX(currMother.image) - xDiff;
      updateXPos(currMother, newXPos);
    }
  }

  // (should fix root node and spacing between rest of 2nd gen)
  //shiftChart();
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

//Not currently being used
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

function adjustHigherGenNodes(nodeMother, currentMomNodeXPos, isOverlap) {
  //debugger
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
  let adjustX;
  if (!isOverlap) {
    adjustX = 15;
  } else {
    adjustX = 75
  }
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

//FIXME: What's the purpose of this? This function could be too specific for a certain case
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
  for (let i = 0; i < rootNodeChildren.length; i++) {
    if (i == 0) {
      let isFirstChild = true;
      updateXPos(rootNodeChildren[i], getX(rootNodeChildren[i].image), isFirstChild);
    } else {
      updateXPos(rootNodeChildren[i], getX(rootNodeChildren[i - 1].image) + maxDiff);
    }
  }
  
  //fix overlaps
  checkOverlaps(rootNodeChildren);
}

function updateXPos(node, newXPos, isFirstChild) {
  
  if (!isFirstChild) {
    setX(node, newXPos);
  }
  
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
        if (hasChildren(nodeChildren[i])) {
          updateXPos(nodeChildren[i], setChildX(nodeChildren[i], getWidthOfFamily(nodeChildren[i])));
        }
      }
    }
  }

  //if node has children
  if (hasChildren(node)) {
    let nodeChildren = getChildren(node);
    for (let i = 0; i < nodeChildren.length; i++) {
      let firstRun = false;
      setX(nodeChildren[i], setChildX(nodeChildren[i], getWidthOfFamily(nodeChildren[i]), firstRun));
      if (hasChildren(nodeChildren[i])) {
        updateXPos(nodeChildren[i], setChildX(nodeChildren[i], getWidthOfFamily(nodeChildren[i])));
      }
    }
  }
}

/** 
 * Finds the x positions of the leftmost and rightmost child 
 * of the root node and sets the x position of the rootnode
 * and root spouse at the central position of those two nodes.
**/
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//All helper functions to access data, etc.



function hasSpouse(node) {
  if (node.spouse != null) {
    return true;
  } else {
    return false;
  }
}

function getNode(nodeId) {

  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].image == nodeId) {
        return value[i];
      }
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
  let width;
  let nodeGen = getGeneration(node);
  
  if (nodeGen <= 2) {
    width = 1000;
  } else if (nodeGen == 3) {
    width = 800;
  } else { // if Gen is greater than 3
    width = 600;
  }

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
  return getNode(node.mother);
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

//function for checking for any overlapping nodes
function checkOverlaps(rootNodeChildren) {
  for (let i = 0; i < rootNodeChildren.length; i++) 
  {
    let rightOverlap = false;
    let leftOverlap = false;

    if (hasChildren(rootNodeChildren[i])) 
    {
      if (checkForOverlapToRight(rootNodeChildren[i])) 
      {
        console.log("Found overlap to right")
        rightOverlap = true;
        fixOverlap(rootNodeChildren[i], leftOverlap, rightOverlap);
      }
      if (checkForOverlapToLeft(rootNodeChildren[i])) 
      {
        console.log("Found overlap to left")
        leftOverlap = true;
        fixOverlap(rootNodeChildren[i], leftOverlap, rightOverlap);
      }
    }
    else if (rootNodeChildren[i].spouse != null) 
    {
      if (hasChildren(getNode(rootNodeChildren[i].spouse))) 
      {
        if (checkForOverlapToRight(getNode(rootNodeChildren[i].spouse))) 
        {
          console.log("Found overlap to right")
          rightOverlap = true;
          fixOverlap(getNode(rootNodeChildren[i].spouse), leftOverlap, rightOverlap);
        }
        if (checkForOverlapToLeft(getNode(rootNodeChildren[i].spouse))) 
        {
          console.log("Found overlap to left")
          leftOverlap = true;
          fixOverlap(getNode(rootNodeChildren[i].spouse), leftOverlap, rightOverlap);
        }
      }
    }
  }
}

/**
 * checks for any overlap of any children to the right
 */
function checkForOverlapToRight(node) 
{
  //get the rightmost child
  let rightmostChild = getRightmostChild(node);
  
  //figure out who the "grandmother" node is (so you can find all her children)
  let nodeMother = getMother(node);
  if (nodeMother == null) 
  {
    nodeMother = getMother(getNode(node.spouse));
  }
  
  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);
  
  //if the size of mom's gen is greater than 1 and it is not the farthest right child in gen (otherwise, there wouldn't be overlap)
  if (motherNodeChildren.length > 1 && (motherPlaceInGen != motherNodeChildren.length - 1)) 
  {
    //checks the child that could potentially be overlapping (mother to right's leftmost child)
    let motherToRight = motherNodeChildren[motherPlaceInGen + 1];
    let rightMotherOverlapChild;
    if (hasChildren(motherToRight)) 
    {
      rightMotherOverlapChild = getLeftmostChild(motherToRight);
      if (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image) < 150)
      {
        return true;
      }
    }
    else if (hasSpouse(motherToRight))
    {
      let motherToRightSpouse = getNode(motherToRight.spouse);
      if (hasChildren(motherToRightSpouse)) 
      {
        rightMotherOverlapChild = getLeftmostChild(motherToRightSpouse);
        if (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image) < 150)
        {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * checks for any overlap of any children to the left
 */
function checkForOverlapToLeft(node) 
{
  //get the leftmost child
  let leftmostChild = getLeftmostChild(node);
  
  //figure out who the "grandmother" node is (so you can find all her children)
  let nodeMother = getMother(node);
  if (nodeMother == null) 
  {
    nodeMother = getMother(getNode(node.spouse));
  }
  
  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);
  
  //if the size of mom's gen is greater than 1 and it is not the farthest left child in gen (otherwise, there wouldn't be overlap)
  if (motherNodeChildren.length > 1 && (motherPlaceInGen != 0)) 
  {
    //checks the child that could potentially be overlapping (mother to left's rightmost child)
    let motherToLeft = motherNodeChildren[motherPlaceInGen - 1];
    let leftMotherOverlapChild;
    if (hasChildren(motherToLeft)) 
    {
      leftMotherOverlapChild = getRightmostChild(motherToLeft);
      if (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image) < 150)
      {
        return true;
      }
    }
    else if (hasSpouse(motherToLeft))
    {
      let motherToLeftSpouse = getNode(motherToLeft.spouse);
      if (hasChildren(motherToLeftSpouse)) 
      {
        leftMotherOverlapChild = getRightmostChild(motherToLeftSpouse);
        if (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image) < 150)
        {
          return true;
        }
      }
    }
  }
  return false;
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

function getMotherPlaceInGen(nodeMother, node) {
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen;
  
  for (let i = 0; i < motherNodeChildren.length; i++) 
  {
    if (motherNodeChildren[i] == node || motherNodeChildren[i] == getNode(node.spouse)) 
    {
      motherPlaceInGen = i;
    }
  }
  return motherPlaceInGen;
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
  //added node.spouse != null, might cause errors
  if (node.mother == null && node.spouse != null) {
    //let spouseIndex = getDataIndex(node.spouse);
    if (node.spouse != null && getNode(node.spouse).mother != null) {
      return getRootNode(getNode(node.mother));
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
    return getRootNode(getNode(node.mother));
  }
  return node;
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

function inNodeBox(image) {
  if (getNodeBoxDataIndex(image) != null) {
    return true;
  } else {
    return false;
  }
}



//FOR MULTITREE TESTING
//FIXME: Could possibly exceed call stack
//TODO: Get rid of duplicates during the function
function getTreeLine(node, tree) {

  //If node is Mother gets children
  let children = getChildren(node);

  tree.push(node)
  if (node.spouse != null) {
    tree.push(getNode(node.spouse))
  }

  //If node is Father gets children of wife if their is any
  if (children.length == 0) {
    if (node.spouse != null) {
      children = getChildren(getNode(node.spouse));
    }
  }

  //Base Case
  if (children.length == 0) {
    return tree;
  }
  else {
    for (let i = 0; i < children.length; ++i) {
      tree.push(children[i]);
    }
  }

  for (let i = 0; i < children.length; ++i) {
    tree.push(children[i]);
    if (children[i].spouse != null) {
      tree.push(getNode(children[i].spouse));
    }

    if (hasChildren(children[i]) || hasChildren(getNode(children[i].spouse))) {
      getTreeLine(children[i], tree)
    }
  }

  //To remove duplicates
  tree = new Set(tree);
  tree = Array.from(tree);

  return tree;
}
