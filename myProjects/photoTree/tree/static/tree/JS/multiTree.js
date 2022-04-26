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
dataMap.set(data[1].image, Array.from(data));

let nodeBoxData = [];

//Change this and HTML in order to change graph size
let chartWidth = 1200;

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

//REFACTORED
//Big O isn't ideal but it will save costs in other parts of the program
function makeMomArray() {
  let tmpArray = [];

  //Initializes momObjects and pushes data to the object
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].mother != null) {
        let tmpMom = new mom;
        tmpMom.data = getNode(value[i].mother);
        tmpArray.push(tmpMom);
      }
    }
  }

  //DELETES DUPLICATES
  for (let i = 0; i < tmpArray.length; ++i) {
    for (let j = 0; j < tmpArray.length; ++j) {
      if (tmpArray[i].data.image == tmpArray[j].data.image) {
        if (i == j) {
          continue;
        }
        tmpArray.splice(j,1);
        j--;
      }
    }
  }

  //Adds children to mom Object
  for (let i = 0; i < tmpArray.length; ++i) {
    let tmpChildren = []
    for (let value of dataMap.values()) {
      for (let j = 0; j < value.length; ++j) {
        if (value[j].mother == tmpArray[i].data.image) {
          tmpChildren.push(value[j]);
        }
      }
    }
    tmpArray[i].children = tmpChildren;
  }

  for (let i = 0; i < tmpArray.length; ++i) {
    if (tmpArray[i].spouse != null) {
      let spouse = getNode(tmpArray[i].data.spouse);
      tmpArray[i].spouse = spouse.image;
    }
  }

  return tmpArray;
}

//Used to connect children to moms
let momArray = makeMomArray();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let chartList = document.getElementById('chart');
createChart(chartList);

/*
//TODO: Test adding <ul>
/////////////////////////////////////////////////////
let treeChart = document.getElementById('treeChart');

//TODO: Turn this into function
//Makes UL's
for (let key of dataMap.keys()) {

  //To make sure there are no copies of ul's
  if (document.getElementsById(`tree${key}`) == null) {
    continue;
  }

  let ul = document.createElement('ul');
  ul.setAttribute('id', `tree${key}`);
  ul.setAttribute('class', 'line-chart');

  treeChart.appendChild(ul);
}

//This is the loop for creating the entire chart
for (let key of dataMap.keys()) {
  let chartList = document.getElementById(`tree${key}`);
  createChart(chartList);
}
/////////////////////////////////////////////////////
*/

//All functions for chart creation and functionality

function createChart(chart) {

  createDataPoints(chart);

  //Makes sure mother is root node and not father (needed because of certain addRelationship conditions)
  checkRootNode();

  createLines();

  console.log("Number of Trees", dataMap.size);
  for (let key of dataMap.keys()) {
    console.log("Tree ", key)
  }

}

//Creates Data Points
//REFACTORED
function createDataPoints(chart) {
  //In case you have to redraw chart
  removeAllChildNodes(chart);

  let generationMap = new Map();
  let genCount = getLongestGenChain();

  for (let j = 0; j < genCount; ++j) {
    generationMap.set(j + 1, 1);
  }

  //rewrite FIXME: O(n^3), make better
  for (let genIndex = 0; genIndex < (genCount + 1); genIndex++) { //creates data points now from oldest to youngest gen
    for (let value of dataMap.values()) {
      for (let i = 0; i < value.length; ++i) {
        let gen = getGeneration(value[i]);
        if (gen == genIndex) {

          //Getting X and Y Positions
          let li = document.createElement('li');
          let dividedHeight = chartWidth / genCount;
          let yPos = getY(dividedHeight, gen);

          let placeInGen = getPlaceInGeneration(value[i], gen);
          if (placeInGen == undefined) {
            placeInGen = 0;
          }

          li.setAttribute('id', value[i].image);
          let xPos;

          if (gen < 3) {
            //If it is a first or second gen node
            xPos = setHighGenX(value[i], generationMap, chartWidth, placeInGen);
          }
          else {
            //If it is a third gen or greater node
            let widthOfFamily = getWidthOfFamily(value[i]);
            let firstRun = true;
            xPos = setChildX(value[i], widthOfFamily, firstRun);
          }

          li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`);

          li.innerHTML += `<div id='button${value[i].image}' onclick='addToConfirmBox(${value[i].image})'>
          <img class="data-point data-button" src="../../static/tree/images/pictures/Kennedy/${value[i].image}.PNG" onmouseenter='hoverMenu(${value[i].image})' onmouseleave='closeHoverMenu()'>
          </div>`

          chart.appendChild(li);
        }
      }
    }
  }
  //center the chart
  //shiftChart();
}

function createLines() {
  let svgString = '';

  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {

      let li = $(`#${value[i].image}`);
      let yPos = parseAttribute('y', li[0].style.cssText);
      let xPos = parseAttribute('x', li[0].style.cssText);

      //Creates Child Lines
      if (hasChildren(value[i])) {

        let index = getMomArrayIndex(momArray, value[i].image);

        for (let j = 0; j < momArray[index].children.length; ++j) {

          let childElement = $(`#${momArray[index].children[j].image}`)

          let x1 = xPos;
          let x2 = parseAttribute('x', childElement[0].style.cssText);
          let y1 = yPos;
          let y2 = parseAttribute('y', childElement[0].style.cssText);

          let valId = value[i].image;

          svgString += `<line class='svg-line' x1="${x1}" y1="${chartWidth - y1}" x2="${x2}" y2="${chartWidth - y2}" stroke="black" stroke-width='6' onclick='testAdd(getNode(${valId}), momArray[${index}].children[${j}])'/>`
        }
      }

      //Creates Spouse Lines
      if (value[i].spouse != null) {

        let spouseElement = $(`#${value[i].spouse}`);
        let spouseXPos = parseAttribute('x', spouseElement[0].style.cssText);
        let spouseYPos = parseAttribute('y', spouseElement[0].style.cssText);

        let valId = value[i].image;
        let valSpouse = value[i].spouse;

        let line = `<line class='svg-line' x1="${xPos}" y1="${chartWidth - yPos}" x2="${spouseXPos}" y2="${chartWidth - spouseYPos}" stroke="blue" stroke-width='6' onclick='testAdd(getNode(${valId}), getNode(${valSpouse}))'/>`

        //if statement so that two spouse lines aren't drawn between spouses
        if (spouseXPos > xPos) {
          svgString += line
        }
      }
    }
  }

  svgString += "</svg>"
  $('#lines').html(svgString);
}

//REFACTORED
function testAdd(node1, node2) {

  let id1 = node1.image;
  let id2 = node2.image;

  let id1Birthyear = node1.birthyear;
  let id2Birthyear = node2.birthyear;

  $('#center-menu').html(
    `<div id='center-menu' class='center-menu'>
    <div><button onclick='returnConfirmBoxNodes(); closeMenu()'>X</button></div>
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
}


//REFACTORED
function addSpouseRelationship(id1, id2) {
  //For Spouse -> Spouse
  let spouse1 = getNode(id1);
  let spouse2 = getNode(id2);

  //checks nodeBox
  let currTree;
  let spouse1Index;
  let spouse2Index;

  //If spouse1 is in nodeBox and spouse2 is on tree, push spouse1 onto tree
  if (inNodeBox(spouse1) != null && isOnTree(spouse2)) {
    currTree = getTree(spouse2);
    currTree.push(spouse1);
    spouse1Index = getNodeBoxDataIndex(spouse1.image);
    nodeBoxData.splice(spouse1Index, 1);
  }

  //If spouse2 is in nodeBox and spouse1 is on tree, push spouse2 onto tree
  if (inNodeBox(spouse2) != null && isOnTree(spouse1)) {
    currTree = getTree(spouse1);
    currTree.push(spouse2);
    spouse2Index = getNodeBoxDataIndex(spouse2.image);
    nodeBoxData.splice(spouse2Index, 1);
  }

  //This statement can cause issue, might make the rootNode the father instead of mother, function adjustRootNodes fixes this problem
  if (inNodeBox(spouse1) && inNodeBox(spouse2)) {
    let tree = [spouse1, spouse2];

    //creates new tree
    dataMap.set(spouse1.image, tree);

    let spouse1Index = getNodeBoxDataIndex(spouse1.image);
    nodeBoxData.splice(spouse1Index, 1);
    let spouse2Index = getNodeBoxDataIndex(spouse2.image);
    nodeBoxData.splice(spouse2Index, 1);
  }

  //TODO: Finish case, do we account for polygamy?
  if (isOnTree(spouse1) && isOnTree(spouse2)) {
    //Gets rid of the old spouse's spouse value
    if (spouse1.spouse != null) {
      getNode(spouse1.spouse).spouse = null;
    }
    if (spouse2.spouse != null) {
      getNode(spouse2.spouse).spouse = null;
    }

    spouse1.spouse = null;
    spouse2.spouse = null;
  }

  //assigns each node their new spouse
  if (getDataIndex(spouse1.image) != null) {
    spouse1.spouse = spouse2.image;
  }

  if (getDataIndex(spouse2.image) != null) {
    spouse2.spouse = spouse1.image
  }

  createChart(chartList);

  document.getElementById('confirmBox').innerHTML = '';

  closeMenu();
}

//TODO: FINISH REFACTORING, testing for case
function addMotherRelationship(id1, id2) {

  let node1 = getNode(id1);
  let node2 = getNode(id2);

  let mother;
  let child;

  if (node1.birthyear > node2.birthyear) {
    mother = node2;
    child = node1;
  } else {
    mother = node1;
    child = node2;
  }

  //If child is in nodeBox and mother in tree
  if (inNodeBox(child) && isOnTree(mother)) {
    let currTree = getTree(mother);
    currTree.push(child);
    let childIndex = getNodeBoxDataIndex(child.image);
    nodeBoxData.splice(childIndex, 1);
  }

  //If child is on tree and mother in nodeBox
  if (isOnTree(child) && inNodeBox(mother)) {
    let children = [child];

    //Removes child from old tree
    let currTree = getTree(child);
    let childIndex = getDataIndex(child.image);
    currTree.splice(childIndex, 1);

    //Removes mom from nodeBoxData
    let momIndex = getNodeBoxDataIndex(mother.image);
    nodeBoxData.splice(momIndex, 1)

    //creates new tree
    dataMap.set(mother.image, children);
  }

  //if both are in nodeBox
  if (inNodeBox(child) && inNodeBox(mother)) {
    let tree = [child, mother]

    //creates new tree
    dataMap.set(mother.image, tree);

    //Removes mom and child from nodeBoxData
    let childIndex = getNodeBoxDataIndex(child.image);
    nodeBoxData.splice(childIndex, 1);
    let momIndex = getNodeBoxDataIndex(mother.image);
    nodeBoxData.splice(momIndex, 1);
  }

  //if both are on the chart
  //TODO: Test to see what happens if you try doing this and they are on the same tree
  //FIXME: This breaks with the spacing rules
  if (isOnTree(child) && isOnTree(mother)) {

    let momTree = getTree(mother);
    let childTree = getTree(child);

    combineTrees(momTree, childTree)
  }

  child.mother = mother.image;

  momArray = makeMomArray()

  createChart(chartList)

  document.getElementById('confirmBox').innerHTML = ''

  closeMenu();
}

//REFACTORED
function removeRelationship(id1, id2) {

  node1 = getNode(id1);
  node2 = getNode(id2);

  let isRelated = false;

  let oldRoot = getRootNode(node1);
  let newTree = []

  //Removes Spouse Relationship
  if (node1.spouse == id2) {

    isRelated = true;

    node1.spouse = null;
    node2.spouse = null;

    if (!hasRelationship(node1)) {
      addToNodeContainer(id1);
      removeNodeFromTree(node1);
    }

    if (!hasRelationship(node2)) {
      addToNodeContainer(id2);
      removeNodeFromTree(node2);
    }

    //multi tree changes
    //Note: Spouse is already removed
    if (node1.mother == null && !inNodeBox(node1)) {
      newTree = getTreeLine(node1, newTree);
      addToTreeMap(newTree, dataMap.get(oldRoot.image));
    }
    else if (node2.mother == null && !inNodeBox(node2)) {
      newTree = getTreeLine(node2, newTree);
      addToTreeMap(newTree, dataMap.get(oldRoot.image));
    }
    else {
      //Something
    }

    closeMenu();

    createChart(chartList);

    let box = document.getElementById('confirmBox');
    box.innerHTML = ''
    box.style.border = ''

    return;
  }

  //Removes Mother/Child Relationship
  if (node1.mother == id2) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i].data.image == id2) {
        for (let j = 0; j < momArray[i].children.length; ++j) {
          if (momArray[i].children[j].image == id1) {
            isRelated = true;

            node1.mother = null;

            if (!hasRelationship(node1)) {
              addToNodeContainer(node1.image);
              removeNodeFromTree(node1);
            }

            momArray = makeMomArray();

            if (!hasRelationship(node2)) {
              addToNodeContainer(node2.image);
              removeNodeFromTree(node2);
            }

            //If it is it's own root node
            if ((getRootNode(node1)?.image == node1.image || getRootNode(node1)?.image == node1.spouse) && !inNodeBox(node1)) {
              newTree = getTreeLine(node1, newTree);
              oldRoot = getRootNode(node2);
              addToTreeMap(newTree, dataMap.get(oldRoot.image));

              //TODO: TEST for making new ul's in html
              /*
              let ul = document.createElement('ul');
              ul.setAttribute('id', `tree${getRootNode(newTree[0].image)}`);
              ul.setAttribute('class', 'line-chart');
              treeChart.appendChild(ul);
              */
            }
            break;
          }
        }
      }
    }
  }

  else if (node2.mother == id1) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i].data.image == id1) {
        for (let j = 0; j < momArray[i].children.length; ++j) {
          if (momArray[i].children[j].image == id2) {
            isRelated = true;

            node2.mother = null;

            if (!hasRelationship(node2)) {
              addToNodeContainer(node2.image);
              removeNodeFromTree(node2);
            }

            momArray = makeMomArray();

            if (!hasRelationship(node1)) {
              addToNodeContainer(node1.image);
              removeNodeFromTree(node1);
            }

            //If it is it's own root node AKA its own tree
            if ((getRootNode(node2)?.image == node2.image || getRootNode(node2)?.image == node2.spouse) && !inNodeBox(node2)) {
              newTree = getTreeLine(node2, newTree);
              oldRoot = getRootNode(node1);
              addToTreeMap(newTree, dataMap.get(oldRoot.image));

              /*
              //TODO: TEST for making new ul's in html
              let ul = document.createElement('ul');
              ul.setAttribute('id', `tree${getRootNode(newTree[0].image)}`);
              ul.setAttribute('class', 'line-chart');
              treeChart.appendChild(ul);
              */
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

  //Gets rid of nodes in the oldTree
  for (let i = 0; i < oldTree.length; ++i) {
    for (let j = 0; j < newTree.length; ++j) {
      if (newTree[j].image == oldTree[i].image) {
        oldTree.splice(i, 1);
        i -= 1
        break;
      }
    }
  }

  dataMap.set(root.image, newTree)
}

//Takes an entire tree and pushes it to another tree
function combineTrees(originalTree, treeToBeAdded) {

  let rootKey = getRootNode(treeToBeAdded[0]);

  let cmpRootKey = getRootNode(originalTree[0]);

  //Case to make sure that tree isn't added to itself, if they both have the same root
  if (rootKey.image == cmpRootKey.image) {
    return;
  }

  for (let i = 0; i < treeToBeAdded.length; ++i) {
    originalTree.push(treeToBeAdded[i]);
  }

  dataMap.delete(rootKey.image);
}

//REFACTORED
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

    let node1 = getNode(parseInt(param1));
    let node2 = getNode(parseInt(param2))

    testAdd(node1, node2)
  }
}

//REFACTORED
function addToNodeContainer(id) {
  nodeBoxData.push(getNode(id))

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

//REFACTORED
function removeFromNodeContainer(id) {
  let container = document.getElementById('nodeContainer');

  let child = document.getElementById("button" + id);

  container.removeChild(child);
}

//REFACTORED
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//REFACTORED
function hoverMenu(nodeId) {

  let hMenu = document.getElementById('hover-menu');
  let node = document.getElementById(nodeId);

  let dataNode = getNode(nodeId);

  let nodeX = parseAttribute('x', node.style.cssText);
  let nodeY = parseAttribute('y', node.style.cssText);

  let nodeIdName = dataNode.name;

  //Make this class a datapoint technically and make XY pos's from there, just get X,Y from node and then adjust slightly for it to be near node
  hMenu.innerHTML = `
  <div id='hover-menu' class='hover-menu hover-point' style='--y: ${nodeY + 100}px; --x: ${nodeX - 25}px'>
    <div>Gen: ${getGeneration(dataNode)} <br> Node: ${dataNode.image}</b><br>Spouse: ${dataNode.spouse}<br>x: ${nodeX}</div>
      <img class='menu-pic' src='../../static/tree/images/pictures/Kennedy/${nodeId}.PNG'/>
      <div id ='node-${nodeId}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column;'>
        <div><b>${nodeIdName}</br></div>
        <div><b>${dataNode?.birthyear}</b></div>
      </div>
  </div>
  `
}

//REFACTORED
function closeHoverMenu() {
  let menu = document.getElementById('hover-menu');
  menu.innerHTML = '';
}

//REFACTORED
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
  if (nodeMother == null) {
    nodeMother = getMother(getNode(node.spouse));
  }

  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);

  //2. If overlap is to the right:
  if (rightOverlap) {
    //get the rightmost child of node
    let rightmostChild;
    if (hasChildren(node)) {
      rightmostChild = getRightmostChild(node);
    } else if (hasChildren(getNode(node.spouse))) {
      rightmostChild = getRightmostChild(getNode(node.spouse));
    }

    //get the next mother to the right
    let motherToRight = motherNodeChildren[motherPlaceInGen + 1];

    //get the leftmost child of mother to the right
    let rightMotherOverlapChild;
    if (hasChildren(motherToRight)) {
      rightMotherOverlapChild = getLeftmostChild(motherToRight);
    } else if (hasChildren(getNode(motherToRight.spouse))) {
      rightMotherOverlapChild = getLeftmostChild(getNode(motherToRight.spouse));
    }

    //set an x value to adjust all nodes to the right by (based on the overlap)
    let xDiff = 151 - (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image));

    //adjust the x positions of all nodes to the right
    for (let motherIndex = motherPlaceInGen + 1; motherIndex < motherNodeChildren.length; motherIndex++) {
      let currMother = motherNodeChildren[motherIndex];
      let newXPos;

      newXPos = getX(currMother.image) + xDiff;
      updateXPos(currMother, newXPos);
    }
  }

  //If overlap is to the left:
  if (leftOverlap) {
    //get the leftmost child of node
    let leftmostChild;
    if (hasChildren(node)) {
      leftmostChild = getLeftmostChild(node);
    } else if (hasChildren(getNode(node.spouse))) {
      leftmostChild = getLeftmostChild(getNode(node.spouse));
    }

    //get the next mother to the left
    let motherToLeft = motherNodeChildren[motherPlaceInGen - 1];

    //get the rightmost child of mother to the left
    let leftMotherOverlapChild;
    if (hasChildren(motherToLeft)) {
      leftMotherOverlapChild = getRightmostChild(motherToLeft);
    } else if (hasChildren(getNode(motherToLeft.spouse))) {
      leftMotherOverlapChild = getRightmostChild(getNode(motherToLeft.spouse));
    }

    //set an x value to adjust all nodes to the left by (based on the overlap)
    let xDiff = 151 - (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image));

    //adjust the x positions of all nodes to the left
    for (let motherIndex = motherPlaceInGen - 1; motherIndex >= 0; motherIndex--) {
      let currMother = motherNodeChildren[motherIndex];
      let newXPos;

      newXPos = getX(currMother.image) - xDiff;
      updateXPos(currMother, newXPos);
    }
  }

  // (should fix root node and spacing between rest of 2nd gen)
  //shiftChart();
}

//Shift all nodes over for better centering
function shiftNodesByMargin(xBuffer) {
  //Get the leftmost XPos on tree
  let xPos;

  //Gets initial val
  for (let values of dataMap.values()) {
    for (let i = 0; i < values.length; ++i) {
      xPos = getX(values[0].image);
      break;
    }
    break;
  }

  for (let values of dataMap.values()) {
    for (let i = 0; i < values.length; ++i) {
      let checkXPos = getX(values[i].image);
      if (checkXPos < xPos) {
        xPos = checkXPos;
      }
    }
  }

  let margin = Math.abs(xPos - xBuffer);

  //shift the xPos of every node by the margin
  for (let values of dataMap.values()) {
    for (let i = 0; i < values.length; ++i) {
      let node = document.getElementById(values[i].image);
      let originalY = parseAttribute('y', node.style.cssText);
      let originalX = parseAttribute('x', node.style.cssText);
      node.setAttribute('style', `--y: ${originalY}px; --x: ${originalX + margin}px`);
    }
  }
}

//REFACTORED
//FIXME: Not working
function adjustHigherGenNodes(nodeMother, currentMomNodeXPos, isOverlap) {
  let mother = getNode(nodeMother)

  //Get an array of the children nodes
  let childNodeArray = getChildren(mother);
  let nodesToAdjust = []

  //1. Get the xPositions of all nodes besides the mom and her children
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      for (let i = 0; i < childNodeArray.length; ++i) {
        if ((childNodeArray[i].image == value[i].image) && isOnTree(value[i])) {
          nodesToAdjust.push(value[i]);
        }
      }
    }
  }

  let nodesXPositions = []
  for (let i = 0; i < nodesToAdjust.length; i++) {
    //FIXME: Breaking here, nodes don't exist and it tries to grab the id
    nodesXPositions.push(getX(nodesToAdjust[i].image));
  }

  //2. Adjust the xPositions of elements in the momXPositions array
  let adjustX;
  /*
  if (!isOverlap) {
    adjustX = 15;
  } else {
    adjustX = 75
  }
  */
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


//FIXME: What's the purpose of this? This function could be too specific for a certain case, also we're gonna have to change this for multiTree
//TODO: Finish refactoring
function fixSecondGenNodeSpacing(tree) {

  let rootNode = getRootNode(data[0]);
  //let rootNode = getRootNode(tree[0])

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


//REFACTORED
//FIXME: Not all calls of this function passes in third parameter
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
  let newXPos = (leftChildX + rightChildX) / 2;

  let rootNodeElement = document.getElementById(getRootNode(data[0]).image);
  let rootNodeSpouse = document.getElementById(getRootNode(data[0]).spouse);
  let originalY = parseAttribute('y', rootNodeElement.style.cssText);

  rootNodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos}px`);
  if (rootNodeSpouse != null) {
    rootNodeSpouse.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos + 100}px`);
  }
}

//TODO: Finish Refactoring
/*
function adjustRootNode(tree) {

  let leftmostChild = getLeftmostChild(getRootNode(tree[0]));
  let rightmostChild = getRightmostChild(getRootNode(tree[0]));
  let leftChildX = getX(leftmostChild.image);
  let rightChildX = getX(rightmostChild.image);
  //Will place root node in the middle of the rightMost and leftMost children
  let newXPos = (leftChildX + rightChildX) / 2;
  
  let rootNodeElement = document.getElementById(getRootNode(tree[0]).image);
  let rootNodeSpouse = document.getElementById(getRootNode(tree[0]).spouse);
  let originalY = parseAttribute('y', rootNodeElement.style.cssText);
  
  rootNodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos}px`);
  if (rootNodeSpouse != null) {
    rootNodeSpouse.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos + 100}px`);
  }
}
*/

function setX(node, newXPos) {
  let nodeElement = document.getElementById(node.image);
  let originalY = parseAttribute('y', nodeElement.style.cssText);
  nodeElement.setAttribute('style', `--y: ${originalY}px; --x: ${newXPos}px`);
}

//NEW getX Function (for gen1 and gen2 nodes)
function setHighGenX(node, map, width, placeInGen) {
  let keyGen = getGeneration(node);

  let xPos = (width / (getNumInGeneration(keyGen) + 1)) * (placeInGen + 1);
  return xPos;
}


//setX for gen3 and above nodes
//FIXME: This breaks during bottom gen
//FIXME: firstRun is being passed in as true, and it never changes, so why is it needed?
function setChildX(node, widthOfFamily, firstRun) {

  let numChildren = getNumChildrenInFamily(node);
  let placeInFam = getPlaceInFamily(node);

  let nodeMother = node.mother;
  let momXPos = getX(nodeMother);

  let famSpacing = widthOfFamily / (numChildren + 1);

  let momGen = getGeneration(node.mother);
  let momsInGen = getMomsInGen(momGen);

  let xPos;
  for (let i = 0; i < momsInGen.length; i++) {
    xPos = (famSpacing * placeInFam) + (momXPos - (widthOfFamily / 2));
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

/**
 * Checks through all the trees and the nodeBox
 * @param {*node.image of the node we are looking for} nodeId 
 * @returns node with the matching nodeId
 */
function getNode(nodeId) {
  //checks trees for node
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].image == nodeId) {
        return value[i];
      }
    }
  }
  //checks nodeBox for node
  for (let i = 0; i < nodeBoxData.length; i++) {
    if (nodeBoxData[i].image == nodeId) {
      return nodeBoxData[i];
    }
  }
}

function getTree(node) {
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i] == node) {
        return value;
      }
    }
  }
}

//REFACTORED
function getX(nodeId) {
  if (nodeId != null) {
    let thisNode = document.getElementById(nodeId);
    let nodeXPos = parseAttribute('x', thisNode.style.cssText);
    return nodeXPos;
  }
}

//REFACTORED
function getY(height, generation) {
  let genCount = getLongestGenChain();
  return (chartWidth + 225) - (chartWidth / genCount + 1) * generation;
  //added a little to chartWidth to center it, can change later
}

//REFACTORED
function getLongestGenChain() {
  let genCount = 0;
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      let tmp = getGenerationCount(value[i], 1);
      if (tmp > genCount) {
        genCount = tmp;
      }
    }
  }

  return genCount;
}

//REFACTORED
function getPlaceInGeneration(node, generation) {
  let nodeArray = [];
  nodeArray = getNodesInGeneration(generation);

  let placeInGen;
  for (let i = 0; i < nodeArray.length; i++) {
    if (nodeArray[i] == node) {
      placeInGen = i;
    }
  }
  return placeInGen;
}

//REFACTORED
function getPlaceInFamily(node) {
  let nodeArray = [];
  nodeArray = getFamilyArray(node);

  let placeInFamily;
  for (let i = 0; i < nodeArray.length; i++) {
    if (nodeArray[i] == node) {
      placeInFamily = i;
    }
  }
  return placeInFamily + 1;
}

//REFACTORED
function getNumChildrenInFamily(node) {

  //FIXME: What if mother is null?
  /*
  if (node.mother == null) {
    return 1;
  }
  */

  let counter = 0;
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].mother == node.mother) {
        counter++;
      }
    }
  }
  return counter;
}

//REFACTORED
function getFamilyArray(node) {
  let nodesInFamily = [];
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].mother == node.mother) {
        nodesInFamily.push(value[i]);
      }
    }
  }
  return nodesInFamily;
}

//FIXME: This function probably should be changed
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

//REFACTORED
function getMomsInGen(generation) {
  theMomArray = [];
  //gets all motherId's in data
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i].mother != null) {
        if (theMomArray.every(element => element != value[i].mother)) {
          theMomArray.push(value[i].mother); //push the motherIds
        }
      }
    }
  }
  //gets array of motherId's in generation
  newMomArray = [];
  for (let i = 0; i < theMomArray.length; i++) {
    if (getGeneration(theMomArray[i] == generation)) {
      newMomArray.push(theMomArray[i]);
    }
  }
  return newMomArray;
}

//REFACTORED
function getMother(node) {
  return getNode(node.mother);
}

//REFACTORED
function getDataIndex(id) {
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (id == value[i].image) {
        return i;
      }
    }
  }
  return null;
}

//REFACTORED
function removeNodeFromTree(node) {
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (node.image == value[i].image) {
        value.splice(i, 1);
      }
    }
  }
}

//REFACTORED
function getNodeBoxDataIndex(id) {
  for (let i = 0; i < nodeBoxData.length; ++i) {
    if (id == nodeBoxData[i].image) {
      return i;
    }
  }
  return null;
}

//REFACTORED
function getMomArrayIndex(array, id) {
  for (let i = 0; i < array.length; ++i) {
    if (array[i].data.image == id) {
      return i;
    }
  }
}

//REFACTORED
function isOnTree(node) {
  let thisNode = document.getElementById(node.image);

  if (thisNode == null) {
    return false;
  }
  else {
    return true;
  }
}

//REFACTORED
function getHypotenuse(datapoint1, datapoint2, left1, left2) {
  triSide = datapoint1 - datapoint2;
  tmpSpacing = left1 - left2;
  hypotenuse = Math.sqrt((triSide * triSide) + (tmpSpacing * tmpSpacing));
  return hypotenuse;
}

//REFACTORED
function getAngle(opposite, hypotenuse) {
  let sine = Math.asin(opposite / hypotenuse);
  //Convert from radians to degrees
  sine = sine * (180 / Math.PI);

  return sine;
}

//REFACTORED
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
      if (attribute[i] == 'x' && attribute[i - 1] != 'p') {
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

//REFACTORED
function hasRelationship(node) {
  if (node.spouse != null || node.mother != null) {
    return true;
  }
  else if (hasChildren(node)) {
    return true;
  }
  return false
}

//function for checking for any overlapping nodes
//REFACTORED
function checkOverlaps(rootNodeChildren) {
  for (let i = 0; i < rootNodeChildren.length; i++) {
    let rightOverlap = false;
    let leftOverlap = false;

    if (hasChildren(rootNodeChildren[i])) {
      if (checkForOverlapToRight(rootNodeChildren[i])) {
        console.log("Found overlap to right")
        rightOverlap = true;
        fixOverlap(rootNodeChildren[i], leftOverlap, rightOverlap);
      }
      if (checkForOverlapToLeft(rootNodeChildren[i])) {
        console.log("Found overlap to left")
        leftOverlap = true;
        fixOverlap(rootNodeChildren[i], leftOverlap, rightOverlap);
      }
    }
    else if (rootNodeChildren[i].spouse != null) {
      if (hasChildren(getNode(rootNodeChildren[i].spouse))) {
        if (checkForOverlapToRight(getNode(rootNodeChildren[i].spouse))) {
          console.log("Found overlap to right")
          rightOverlap = true;
          fixOverlap(getNode(rootNodeChildren[i].spouse), leftOverlap, rightOverlap);
        }
        if (checkForOverlapToLeft(getNode(rootNodeChildren[i].spouse))) {
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
//REFACTORED
function checkForOverlapToRight(node) {
  //get the rightmost child
  let rightmostChild = getRightmostChild(node);

  //figure out who the "grandmother" node is (so you can find all her children)
  let nodeMother = getMother(node);
  if (nodeMother == null) {
    nodeMother = getMother(getNode(node.spouse));
  }

  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);

  //if the size of mom's gen is greater than 1 and it is not the farthest right child in gen (otherwise, there wouldn't be overlap)
  if (motherNodeChildren.length > 1 && (motherPlaceInGen != motherNodeChildren.length - 1)) {
    //checks the child that could potentially be overlapping (mother to right's leftmost child)
    let motherToRight = motherNodeChildren[motherPlaceInGen + 1];
    let rightMotherOverlapChild;
    if (hasChildren(motherToRight)) {
      rightMotherOverlapChild = getLeftmostChild(motherToRight);
      if (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image) < 150) {
        return true;
      }
    }
    else if (hasSpouse(motherToRight)) {
      let motherToRightSpouse = getNode(motherToRight.spouse);
      if (hasChildren(motherToRightSpouse)) {
        rightMotherOverlapChild = getLeftmostChild(motherToRightSpouse);
        if (getX(rightMotherOverlapChild.image) - getX(rightmostChild.image) < 150) {
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
//REFACTORED
function checkForOverlapToLeft(node) {
  //get the leftmost child
  let leftmostChild = getLeftmostChild(node);

  //figure out who the "grandmother" node is (so you can find all her children)
  let nodeMother = getMother(node);
  if (nodeMother == null) {
    nodeMother = getMother(getNode(node.spouse));
  }

  //get mother's place in gen (to compare the other mother's children to)
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen = getMotherPlaceInGen(nodeMother, node);

  //if the size of mom's gen is greater than 1 and it is not the farthest left child in gen (otherwise, there wouldn't be overlap)
  if (motherNodeChildren.length > 1 && (motherPlaceInGen != 0)) {
    //checks the child that could potentially be overlapping (mother to left's rightmost child)
    let motherToLeft = motherNodeChildren[motherPlaceInGen - 1];
    let leftMotherOverlapChild;
    if (hasChildren(motherToLeft)) {
      leftMotherOverlapChild = getRightmostChild(motherToLeft);
      if (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image) < 150) {
        return true;
      }
    }
    else if (hasSpouse(motherToLeft)) {
      let motherToLeftSpouse = getNode(motherToLeft.spouse);
      if (hasChildren(motherToLeftSpouse)) {
        leftMotherOverlapChild = getRightmostChild(motherToLeftSpouse);
        if (getX(leftmostChild.image) - getX(leftMotherOverlapChild.image) < 150) {
          return true;
        }
      }
    }
  }
  return false;
}

//REFACTORED
function getGenerationCount(node, count) {
  if (node?.mother == null) {
    if (node?.spouse != null) {
      let spouse = getNode(node.spouse);
      if (spouse.mother != null) {
        let mother = getNode(spouse.mother);
        return count += getGenerationCount(mother, count);
      }
      else {
        return count;
      }
    }
    else {
      return count;
    }
  }

  let motherNode = getNode(node.mother);

  if (node.mother != null) {
    return count += getGenerationCount(motherNode, count);
  }
}

function getGeneration(node) {
  let count = 1;

  count = getGenerationCount(node, count);

  return count;
}

//REFACTORED
function getMotherPlaceInGen(nodeMother, node) {
  let motherNodeChildren = getChildren(nodeMother);
  let motherPlaceInGen;

  for (let i = 0; i < motherNodeChildren.length; i++) {
    if (motherNodeChildren[i] == node || motherNodeChildren[i] == getNode(node.spouse)) {
      motherPlaceInGen = i;
    }
  }
  return motherPlaceInGen;
}

//REFACTORED
function getNumInGeneration(generation) {
  let numInGen = 0;
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (getGeneration(value[i]) == generation) {
        numInGen++;
      }
    }
  }
  return numInGen;
}

//REFACTORED
function getNodesInGeneration(generation) {
  let nodeGeneration = [];
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (getGeneration(value[i]) == generation) {
        nodeGeneration.push(value[i]);
      }
    }
  }
  return nodeGeneration;
}


//REFACTORED
function getChildren(motherNode) {

  let children = [];
  if (hasChildren(motherNode)) {
    for (let value of dataMap.values()) {
      for (let i = 0; i < value.length; ++i) {
        if (value[i].mother == motherNode.image) {
          children.push(value[i]);
        }
      }
    }
  }
  return children;
}

//REFACTORED
function hasChildren(node) {
  for (let value of dataMap.values()) {
    for (let i = 0; i < value.length; ++i) {
      if (value[i]?.mother == node?.image) {
        return true;
      }
    }
  }
  return false;
}

/*
//TEST
function getChildren(motherNode) {

  if (hasChildren(motherNode)) {
    for (let i = 0; i < momArray.length; ++i) {
      if (motherNode.image == momArray[i].data.image) {
        return momArray[i].children;
      }
    }
  }
  return [];
}
*/
//Test
//Checks if in momArray, more Efficient
/*
function hasChildren(node) {
  //debugger
  for (let i = 0; i < momArray.length; ++i) {
    if (momArray[i].data.image == node.image) {
      return true;
    }
  }
  return false;
}
*/


//FIXME: Test, error still exist
function getRootNode(node) {
  //check if node is the root node
  if (node.mother == null && getNode(node.spouse)?.mother == null) {
    //if (!hasChildren(node) && node.spouse != null) {
    if (!hasChildren(node) && node.spouse != null && hasChildren(getNode(node.spouse))) {
      return getNode(node.spouse);
    }
    else {
      return node;
    }
  }
  //if node is not the root node, then recursively check
  else {
    if (node.mother != null) {
      return getRootNode(getNode(node.mother));
    }
    if (node.spouse != null) {
      if (getNode(node.spouse).mother != null) {
        return getRootNode(getNode(getNode(node.spouse).mother));
      }
    }
  }
}

//REFACTORED
function getLeftmostChild(momNode) {
  let childElementXPos;
  let leftmostChild;

  for (let i = 0; i < momArray.length; ++i) {

    if (momArray[i].data.image == momNode.image) {

      //Initial comparing value
      let tmpChild = document.getElementById(`${momArray[i].children[0].image}`);
      childElementXPos = parseAttribute('x', tmpChild.style.cssText)
      leftmostChild = tmpChild.id

      for (let j = 0; j < momArray[i].children.length; ++j) {
        let child = document.getElementById(`${momArray[i].children[j].image}`);

        let childXPos = parseAttribute('x', child.style.cssText);

        if (childXPos < childElementXPos) {
          childElementXPos = childXPos;
          leftmostChild = child.id
        }
      }
      break;
    }
  }
  return getNode(parseInt(leftmostChild));
}

//REFACTORED
function getRightmostChild(momNode) {
  let childElementXPos;
  let rightmostChild;

  for (let i = 0; i < momArray.length; ++i) {
    if (momArray[i].data.image == momNode.image) {

      //Initial comparing value
      let tmpChild = document.getElementById(`${momArray[i].children[0].image}`);
      childElementXPos = parseAttribute('x', tmpChild.style.cssText)
      rightmostChild = tmpChild.id

      for (let j = 0; j < momArray[i].children.length; ++j) {
        let child = document.getElementById(`${momArray[i].children[j].image}`);

        let childXPos = parseAttribute('x', child.style.cssText);

        if (childXPos > childElementXPos) {
          childElementXPos = childXPos;
          rightmostChild = child.id;
        }
      }
      break;
    }
  }
  return getNode(parseInt(rightmostChild));
}

function inNodeBox(node) {
  if (getNodeBoxDataIndex(node.image) != null) {
    return true;
  } else {
    return false;
  }
}

//FOR MULTITREE TESTING
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

//In case root nodes aren't the mother, addRelationship functions may cause this when both nodes are in nodeBox
//Checks if root node or spouse has children, if yes, makes that node the rootNode, else, it doesn't matter who root node is
function checkRootNode() {
  for (let key of dataMap.keys()) {
    let tmpNode = getNode(key);
    let tmpSpouse = getNode(tmpNode.spouse)
    //If has children do nothing
    if (hasChildren(tmpNode)) {
      continue;
    }
    if (tmpSpouse != null && hasChildren(tmpSpouse)) {
      let tmpTree = dataMap.get(key);
      dataMap.set(tmpSpouse.image, tmpTree)
      dataMap.delete(key);
    }
  }
}

//If confirmBox menu is exited without changing relationship, confirmBox is cleared, this is to make sure that no node is lost
function returnConfirmBoxNodes() {

  let confirmBox = document.getElementById('confirmBox');

  for (let i = 0; i < confirmBox.children.length; ++i) {

    let tmpNode = document.getElementById(confirmBox.children[i].id.substr(4));

    if (tmpNode == null) {
      addToNodeContainer(confirmBox.children[i].id.substr(4))
    }
  }

  $('#confirmBox').html('');
}

//FOR PRESENTATION
function startEmpty() {
  for (let value of dataMap.values()) {
    while (value.length != 0) {
      value[0].mother = null;
      value[0].spouse = null;
      addToNodeContainer(value[0].image);
      value.splice(0, 1);
    }
  }

  dataMap.clear();

  momArray = [];
  createChart(chartList)
}