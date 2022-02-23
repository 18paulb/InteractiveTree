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
    //"mother": 10,
    "mother": null,  //FIXME CHANGED
    "spouse": 8,
    "birthyear": 1979,
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


// we start with the TrieNode
const TrieNode = function (key) {
  // the "key" value will be the character in sequence
  this.key = key;
  
  // we keep a reference to parent
  this.parent = null;

  this.spouse = null;
  
  // we have hash of children
  this.children = {};
  
  // check to see if the node is at the end
  this.end = false;
  
  this.getWord = function() {
    let output = [];
    let node = this;

    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }

    return output.join('');
  };
}

const Trie = function() {
  this.root = new TrieNode(null);
 
  //Other methods will go here...
  // inserts a word into the trie.
  this.insert = function(word) {
    let node = this.root; // we start at the root

    // for every character in the word
    for(let i = 0; i < word.length; i++) {
      // check to see if character node exists in children.
      if (!node.children[word[i]]) {
        // if it doesn't exist, we then create it.
        node.children[word[i]] = new TrieNode(word[i]);

        // we also assign the parent to the child node.
        node.children[word[i]].parent = node;
      }

      // proceed to the next depth in the trie.
      node = node.children[word[i]];

      // finally, we check to see if it's the last word.
      if (i == word.length-1) {
        // if it is, we set the end flag to true.
        node.end = true;
      }
    }
  };


   // check if it contains a whole word.
   this.contains = function(word) {
    let node = this.root;

    // for every character in the word
    for(let i = 0; i < word.length; i++) {
      // check to see if character node exists in children.
      if (node.children[word[i]]) {
        // if it exists, proceed to the next depth of the trie.
        node = node.children[word[i]];
      } else {
        // doesn't exist, return false since it's not a valid word.
        return false;
      }
    }

    // we finished going through all the words, but is it a whole word?
    return node.end;
  };



  // removes the given word
  this.remove = function (word) {
    let root = this.root;

    if(!word) return;

    // recursively finds and removes a word
    const removeWord = (node, word) => {

        // check if current node contains the word
        if (node.end && node.getWord() === word) {

            // check and see if node has children
            let hasChildren = Object.keys(node.children).length > 0;

            // if has children we only want to un-flag the end node that marks end of a word.
            // this way we do not remove words that contain/include supplied word
            if (hasChildren) {
                node.end = false;
            } else {
                // remove word by getting parent and setting children to empty dictionary
                node.parent.children = {};
            }

            return true;
        }

        // recursively remove word from all children
        for (let key in node.children) {
            removeWord(node.children[key], word)
        }

        return false
    };

  // call remove word on root node
  removeWord(root, word);
};
}



class Tree {
  rootNode;

  constructor(data) {
    this.rootNode = new TreeNode(data.image, data.mother, data.spouse, data.birthyear);
  }

  getRoot() {
    return this.rootNode;
  }

  addChild(currNode, parent, child) {

    if (currNode.image == parent.image) {
      parent.addChild(child);
    }

    if (currNode.image != parent.image) {
      for (let i = 0; i < currNode.children.length; ++i) {
        return this.addChild(currNode.children[i], parent, child);
      }
    }

    return "Error, could not find parent";
  }

  addChild(parent, child) {
    return this.addChild(this.rootNode, parent, child)
  }
}

class TreeNode {
  image;
  mother;
  spouse;
  birthyear;
  children = []

  constructor(image, mother, spouse, birthyear) {
    this.image = image;
    this.mother = mother;
    this.spouse = spouse;
    this.birthyear = birthyear;
  }

  addChild(child) {
    this.children.push(child);
  }

}


//debugger
//let tree = new Tree(data[getDataIndex(9)]);

//tree.addChild(data[getDataIndex(9)], data[0]);







let chartList = document.getElementById('chart');
createChart();
//All functions for chart creation and functionality


function createChart() {

  createDataPoints();

  //Testing
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      adjustSpouseXPos(data[i]);
    }
  }

  createLines();
}

function createDataPoints() {
  //In case you have to redraw chart, removes previously placed nodes
  $('#chart').empty();

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

    $('#chart').append(
      `<li id=${data[i].image} style='--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px'>
        <div id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'>
          <img class="data-point data-button" src="../../static/tree/images/pictures/${data[i].image}.PNG">
        </div>
      </li>`)
  }
}


function testAdd() {}


//FIXME
function createLines() {

  //FIXME SVG has to be wider than chartwidth, however find better way of doing this, don't use magic number
  let svgString = `<svg id='lines' height="${chartWidth}" width="${chartWidth+100}" xmlns="http://www.w3.org/2000/svg" style='z-index:-1; display:flex;'>`;

  for (let i = 0; i < data.length; ++i) {

    let li = $(`#${data[i].image}`);
    let yPos = parseAttribute('y', li[0].style.cssText);
    let xPos = parseAttribute('x', li[0].style.cssText);

    //Creates Child Lines
    if (isMom(data[i])) {   

      let index = getMomArrayIndex(momArray, data[i].image);

      for (let j = 0; j < momArray[index][0].children.length; ++j) {

        let childElement = $(`#${momArray[index][0].children[j].image}`)

        let x1 = xPos;
        let x2 = parseAttribute('x', childElement[0].style.cssText);
        let y1 = yPos;
        let y2 = parseAttribute('y', childElement[0].style.cssText);

        svgString += `<line class='svg-line' x1="${x1}" y1="${chartWidth - y1}" x2="${x2}" y2="${chartWidth - y2}" stroke="black" stroke-width='6' onclick='hi()'/>`
      }
    }

    //Creates Spouse Lines
    if (data[i].spouse != null) {

      let spouseElement = $(`#${data[i].spouse}`);
      let spouseXPos = parseAttribute('x', spouseElement[0].style.cssText);
      let spouseYPos = parseAttribute('y', spouseElement[0].style.cssText);

      let line = `<line class='svg-line' x1="${xPos}" y1="${chartWidth - yPos}" x2="${spouseXPos}" y2="${chartWidth - spouseYPos}" stroke="blue" stroke-width='6' onclick='hi()'/>`

      //if statement so that two spouse lines aren't drawn between spouses
      if (spouseXPos > xPos) {
        svgString += line
      }
    }
  }

  svgString += "</svg>"
  $('#chart').html($('#chart').html() + svgString);
}

function hi() {
  console.log('hi')
}

function getY(dividedHeight, generation) {
  //Added chartWidth / 6 for better centered spacing
  //FIXME Avoid magic numbers
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

  //TEST ADDED THIS RULE TO STOP TOP NODE FROM SHIFTING
  //SIDEFFECTS, ANY GENERATION WITH 1 node will be placed directly in center, might not be beneficial at all
  if (getNumInGeneration(keyGen) == 1) {
    xPos = width / 2
  } 

  return xPos;

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

  $('#confirmBox').html('')

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

  $('#confirmBox').html('');

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

    closeMenu()

    createChart(chartList)

    $('#confirmBox').html('');
    $('#confirmBox').css('border', '');

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

  $('#confirmBox').html('');
  $('#confirmBox').css('border', '');

  closeMenu();
}

function changeAddButtonParameters() {

  $('#confirmBox').children()

  let children = []

  children = $('#confirmBox').children();

  for (let i = 0; i < children.length; ++i) {
    children[i] = children[i].id.substr(4);
  }

  if (children.length != 0) {
    let param1 = children[0];
    let param2 = children[1];

    $('#addMotherButton').attr('onclick', `changeAddButtonParameters(), addMotherRelationship(${param1}, ${param2})`);
    $('#addSpouseButton').attr('onclick',`changeAddButtonParameters(), addSpouseRelationship(${param1}, ${param2})`);
  }
}

function changeRemoveButtonParameters() {
  $('#confirmBox').children()

  let children = []

  children = $('#confirmBox').children();

  for (let i = 0; i < children.length; ++i) {
    children[i] = children[i].id.substr(4);
  }

  if (children.length != 0) {
    let param1 = children[0];
    let param2 = children[1];

    $('#removeButton').attr('onclick', `changeRemoveButtonParameters(), removeRelationship(${param1}, ${param2})`);

  }
}

function addToConfirmBox(id) {
  let box = document.getElementById("confirmBox");

  for (let i = 0; i < box.children.length; ++i) {
    if (box.children[i].id == `node${id}`) {
      return;
    }
  }

  if (box.children.length >= 2) {
    alert("Can't have more than 2 nodes in confirmation box.");
    $('#confirmBox').html('');
    return;
  }

  let nodeId = `node${id}`;
  let img = document.createElement('img');

  img.setAttribute('id', nodeId);
  img.setAttribute('class', 'node-image');
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`);

  box.appendChild(img);

  //sets border for confirmBox
  if (box.children.length > 0) {
    box.style.border = "5px solid black";
  }

  //Changes Parameters for Change Relationship button
  let children = [];

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

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
  $(`#button${id}`).remove();
}

function openMenu(id1, id2) {

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

  if ($('#confirmBox').children().length == 2) {
    $('#center-menu').html(
    `<div id='center-menu' class='center-menu'>
      <div><button onclick='closeMenu()'>X</button></div>

      <div class='menu-pics-container'>
        <div>
          <img class='menu-pic' src='../../static/tree/images/pictures/${id1}.PNG'/>
          <div id ='node-${id1}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column; padding-top: 5px;'>
            <div><b>John Doe</b></div>
            <div><b>${id1Birthyear}</b></div>
          </div>
        </div>

        <div>
          <img class='menu-pic' src='../../static/tree/images/pictures/${id2}.PNG'/>
          <div id ='node-${id2}-info' style='display: flex; justify-content:center; align-items:center; flex-direction: column; padding-top: 5px;'>
            <div><b>John Doe</b></div>
            <div><b>${id2Birthyear}</b></div>
          </div>
        </div>
      </div>

      <div class='menu-button'>
        <button id='removeButton' class='button-34' onclick='removeRelationship(${id1}, ${id2})'>Remove Relationship</button>
        <button id='addMotherButton' class='button-34' onclick=addMotherRelationship(${id1}, ${id2})>Add Mother/Child Relationship</button>
        <button id='addSpouseButton' class='button-34' onclick=addSpouseRelationship(${id1}, ${id2})>Add Spouse Relationship</button>
      </div>
    </div>`)

  } else {
    $('#center-menu').html('');
  }
  changeRemoveButtonParameters()
  changeAddButtonParameters()
}

function closeMenu() {
  //TODO Add if that put nodedataBox nodes back to nodeBox
  $('#center-menu').html('');
  $('#confirmBox').html('');
}



//All helper functions to access data, etc.



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

//Gets highest generation count
function getGenerationCount(node, count) {
  if (node.mother == null) {
      if (node.spouse != null) {
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

  let momIndex = getDataIndex(childNode.mother);

  siblings = getChildren(data[momIndex]);

  return siblings;
}

function getRootNode(node) {
  if (node.mother == null) {
    let spouseIndex = getDataIndex(node.spouse);
    if (node.spouse != null && data[spouseIndex].mother != null) {
      let motherIndex = getDataIndex(data[spouseIndex].mother);
      return getRootNode(data[motherIndex]);
    }
    else {
      return node;
    }
  }

  if (node.mother != null) {
    let momIndex = getDataIndex(node.mother);
    return getRootNode(data[momIndex]);
  }
}

function partOfFamilyLine(targetNode, node) {
  let children = [];
  if (isMom(node)) {
    children = getChildren(node);
  }

  //Accounts for if spouse is Mom
  if (node.spouse != null) {
    let spouseIndex = getDataIndex(node.spouse);
    if (isMom(data[spouseIndex])) {
      children = getChildren(data[spouseIndex]);
    }
  }

  if (node == targetNode) {
    return true;
  }

  if (children.length != 0) {
    for (let i = 0; i < children.length; ++i) {
      if (children[i] == targetNode) {
        return true;
      }
      else {
        return partOfFamilyLine(targetNode, children[i])
      }
    }
  }

  return false;
}

function getSpacing(rootNode, spacing, targetNode) {
  let children = [];
  if (isMom(rootNode)) {
    children = getChildren(rootNode);
  }

  //Accounts for if spouse is Mom
  if (rootNode.spouse != null) {
    let spouseIndex = getDataIndex(rootNode.spouse);
    if (isMom(data[spouseIndex])) {
      children = getChildren(data[spouseIndex]);
    }
  }

  //Base Case
  if (children.length == 0) {
    return spacing;
  }

  if (children.length != 0) {
    for (let i = 0; i < children.length; ++i) {
      if (partOfFamilyLine(targetNode, children[i])) {
        return getSpacing(children[i], (spacing / children.length), targetNode);
      }
    }
  }

  return spacing
}

//FIXME prioritize moving spouses with no moms and also spouses who are already on the tree
function adjustSpouseXPos(node) {

  let spouse = $(`#${node.spouse}`);
  let currNode = $(`#${node.image}`);

  let spouseXPos = parseAttribute('x', spouse[0].style.cssText);
  let nodeXPos = parseAttribute('x', currNode[0].style.cssText);

  let generation = getGeneration(node)

  //FIXME everything below this has to change
  let spacing = 100;


  if (emptyXLocation(nodeXPos + spacing, generation)) {
    spouseXPos = nodeXPos + spacing;

    let originalY = parseAttribute('y', spouse[0].style.cssText);
    spouse.attr('style', `--y: ${originalY}px; --x: ${spouseXPos}px`);
  }
  else if (emptyXLocation(nodeXPos - spacing, generation)) {
    spouseXPos = nodeXPos - spacing;

    let originalY = parseAttribute('y', spouse[0].style.cssText);
    spouse.attr('style', `--y: ${originalY}px; --x: ${spouseXPos}px`);
  }
}

//FIXME could potentially be overlap of nodes because this checks for EXACT x, not range of x to account for node width
function emptyXLocation(xPos, generation) {

  let isEmpty = true;

  let nodesInGeneration = getNodesInGeneration(generation);

  for (let i = 0; i < nodesInGeneration.length; ++i) {
    let node = $(`#${nodesInGeneration[i].image}`);
    let tmpX = parseAttribute('x', node[0].style.cssText)
    
    if ((xPos == tmpX)) {
      isEmpty = false;
      return isEmpty;
    }
    
    if ((xPos >= tmpX - 30) && (xPos <= tmpX + 30)) {
      isEmpty = false;
      return isEmpty
    }
  }
  return isEmpty;
}

