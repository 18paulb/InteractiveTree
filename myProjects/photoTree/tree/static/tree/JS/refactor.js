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

function makeMomArray(data) {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function allowDrop(ev) {
  ev.preventDefault();
}

//FIXME: was just ev, might cause problems
function drop(ev, data) {
  ev.preventDefault();

  let box = document.getElementById("confirmBox");
  let children = [];

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4))
  }

  //Opens menu with all the info
  if (children.length == 2) {
    let param1 = children[0];
    let param2 = children[1];

    testRemoveFromConfirmBox(param1, param2, data)
  }
}

let chartList = document.getElementById('chart');

$.ajax({
  type: "GET",
  dataType: "json",
  url: "/tree/get/ajax/getNodes",
  success: function (response) {
    let test = response

    for (let i = 0; i < test.length; ++i) {
      test[i] = test[i].fields;
    }

    let momArray = makeMomArray(test)
    createChart(test, momArray)
  },
  
  error: function (response) {
      console.log(response);
  },
})



//All functions for chart creation and functionality



function createChart(data, momArray) {

  createDataPoints(data, momArray);

  createLines(data, momArray);
}

function createDataPoints(data) {
  //In case you have to redraw chart, removes previously placed nodes
  $('#chart').empty();

  let generationMap = new Map();
  let genCount = 0;
  for (let j = 0; j < data.length; ++j) {
    let tmp = getGenerationCount(data[j], 1, data);
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
      let tmp = getGenerationCount(data[j], 1, data);
      if (tmp > genCount) {
        genCount = tmp;
      }
    }

    //Getting X and Y Positions
    let gen = getGeneration(data[i], data);

    let dividedHeight = chartWidth / genCount;
    let yPos = getY(dividedHeight, gen);

    let xPos = getX(data[i], generationMap, chartWidth, data);

    //Took out divId that was buttonID
    $('#chart').append(
      `<li id=${data[i].image} style='--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px'>
        <div onclick='addToConfirmBox(${data[i].image}, ${data})' ondrop='addToConfirmBox(${data[i].image}, ${data}), drop(event, ${data})' ondragover='allowDrop(event)'>
          <img class="data-point data-button" src="../../static/tree/images/pictures/${data[i].image}.PNG">
        </div>
      </li>`)

  }
}

//Works for clicking on the lines
function testAdd(node1, node2, data) {

  let id1 = node1.image;
  let id2 = node2.image;

  let id1Birthyear;
  let id2Birthyear;

  let id1Index = getDataIndex(parseInt(id1), data);
  let id2Index = getDataIndex(parseInt(id2), data);

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
      <button id='removeButton' class='button-34' onclick='removeRelationship(${id1}, ${id2}, ${data})'>Remove Relationship</button>
      <button id='addMotherButton' class='button-34' onclick='addMotherRelationship(${id1}, ${id2}, ${data})'>Add Mother/Child Relationship</button>
      <button id='addSpouseButton' class='button-34' onclick='addSpouseRelationship(${id1}, ${id2}, ${data})'>Add Spouse Relationship</button>
    </div>
  </div>`)

  removeFromNodeContainer(id1)

}

function testRemoveFromConfirmBox(id1, id2, data) {
  
  if (nodeBoxData[getNodeBoxDataIndex(id1)] != null) {
    testAdd(nodeBoxData[getNodeBoxDataIndex(id1)], data[getDataIndex(id2)], data)
  }
}

//FIXME
function createLines(data, momArray) {

  //FIXME: SVG has to be wider than chartwidth, however find better way of doing this, don't use magic number
  let svgString = `<svg id='lines' height="${chartWidth}" width="${chartWidth+100}" xmlns="http://www.w3.org/2000/svg" style='z-index:-1;'>`;

  for (let i = 0; i < data.length; ++i) {

    let li = $(`#${data[i].image}`);
    let yPos = parseAttribute('y', li[0].style.cssText);
    let xPos = parseAttribute('x', li[0].style.cssText);

    //Creates Child Lines
    if (isMom(data[i], momArray)) {   

      let index = getMomArrayIndex(momArray, data[i].image);

      for (let j = 0; j < momArray[index][0].children.length; ++j) {

        let childElement = $(`#${momArray[index][0].children[j].image}`)

        let x1 = xPos;
        let x2 = parseAttribute('x', childElement[0].style.cssText);
        let y1 = yPos;
        let y2 = parseAttribute('y', childElement[0].style.cssText);

        svgString += `<line class='svg-line' x1="${x1}" y1="${chartWidth - y1}" x2="${x2}" y2="${chartWidth - y2}" stroke="black" stroke-width='8' onclick='testAdd(data[${i}], momArray[${index}][0].children[${j}], ${data})'/>`
      }
    }

    //Creates Spouse Lines
    if (data[i].spouse != null) {

      let spouseElement = $(`#${data[i].spouse}`);
      let spouseXPos = parseAttribute('x', spouseElement[0].style.cssText);
      let spouseYPos = parseAttribute('y', spouseElement[0].style.cssText);

      let line = `<line class='svg-line' x1="${xPos}" y1="${chartWidth - yPos}" x2="${spouseXPos}" y2="${chartWidth - spouseYPos}" stroke="blue" stroke-width='8' onclick='testAdd(data[${i}], data[getDataIndex(data[${i}].spouse, data)], ${data})'/>`

      //if statement so that two spouse lines aren't drawn between spouses
      if (spouseXPos > xPos) {
        svgString += line
      }
    }
  }

  svgString += "</svg>"
  $('#chart').html($('#chart').html() + svgString);
}

function getY(dividedHeight, generation) {
  //Added chartWidth / 6 for better centered spacing
  //FIXME Avoid magic numbers
  return (chartWidth  + (chartWidth / 6)) - dividedHeight * generation;
}

function getX(node, map, width, data) {
  let genCount = 0;
  let xPos;

  //Gets highest Generation
  for (let j = 0; j < data.length; ++j) {
    let tmp = getGenerationCount(data[j], 1, data);
    if (tmp > genCount) {
      genCount = tmp;
    }
  }

  let currGeneration;
  let keyGen = getGeneration(node, data);

  currGeneration = map.get(keyGen);

  xPos = (width / getNumInGeneration(keyGen, data)) * currGeneration;
  currGeneration++;

  map.set(keyGen, currGeneration);

  //TEST ADDED THIS RULE TO STOP TOP NODE FROM SHIFTING
  //SIDEFFECTS, ANY GENERATION WITH 1 node will be placed directly in center, might not be beneficial at all
  if (getNumInGeneration(keyGen, data) == 1) {
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

function addSpouseRelationship(id1, id2, data) {
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

  if (getDataIndex(spouse1.image, data) != null) {
    spouse1Index = getDataIndex(spouse1.image, data);
    data[spouse1Index].spouse = spouse2.image;
  }

  if (getDataIndex(spouse2.image, data) != null) {
    spouse2Index = getDataIndex(spouse2.image, data);
    data[spouse2Index].spouse = spouse1.image;
  }

  createChart(chartList);

  $('#confirmBox').html('')

  closeMenu();

}

//TODO fix issues
function addMotherRelationship(id1, id2, data) {
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

  if (getDataIndex(child.image, data) != null) {
    childIndex = getDataIndex(child.image, data);
    data[childIndex].mother = mother.image;
  }

  momArray = makeMomArray()
  
  createChart(chartList)

  $('#confirmBox').html('');

  closeMenu();

}





function removeRelationship(id1, id2, momArray, data) {

  let id1Index = getDataIndex(id1, data)
  let id2Index = getDataIndex(id2, data)

  let isRelated = false

  //Removes Spouse Relationship
  if (data[id1Index].spouse == id2) {
    isRelated = true

    data[id1Index].spouse = null
    data[id2Index].spouse = null

    if (!(hasRelationship(data[id1Index]))) {
      addToNodeContainer(id1, data)
      data.splice(id1Index, 1)
    }

    id2Index = getDataIndex(id2, data)

    if (!(hasRelationship(data[id2Index]))) {
      addToNodeContainer(id2, data)
      data.splice(id2Index, 1)
    }

    closeMenu()

    createChart(chartList)

    $('#confirmBox').html('');
    $('#confirmBox').css('border', '');

    return;
  }

  //Removes Mother/Child Relationship
  id1Index = getDataIndex(id1, data);
  id2Index = getDataIndex(id2, data);

  if (data[id1Index].mother == id2) {
    for (let i = 0; i < momArray.length; ++i) {
      if (momArray[i][0].data.image == id2) {
        for (let j = 0; j < momArray[i][0].children.length; ++j) {
          if (momArray[i][0].children[j].image == id1) {
            isRelated = true;

            data[id1Index].mother = null;

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image, data);
              data.splice(id1Index, 1);
            }

            id2Index = getDataIndex(id2, data);
            
            momArray = makeMomArray();

            if (!hasRelationship(data[id2Index])) {
              addToNodeContainer(data[id2Index].image, data);
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
              addToNodeContainer(data[id2Index].image, data);
              data.splice(id2Index, 1);
            }

            id1Index = getDataIndex(id1, data);

            momArray = makeMomArray();

            if (!hasRelationship(data[id1Index])) {
              addToNodeContainer(data[id1Index].image, data);
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

//FIXME finish JQuery
function addToConfirmBox(id, data) {

  debugger

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
  img.setAttribute('src', `../../static/tree/images/pictures/${id}.PNG`);

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

    let id1Index = getDataIndex(parseInt(param1), data);
    let id2Index = getDataIndex(parseInt(param2), data);
  
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

function addToNodeContainer(id, data) {

  let index = getDataIndex(id, data);

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
  button.setAttribute('onclick', `addToConfirmBox(${id}, ${data}), removeFromNodeContainer(${id})`);
  
  button.setAttribute('ondragstart', `addToConfirmBox(${id}, ${data})`)
  button.setAttribute('onclick', `addToConfirmBox(${id}, ${data}), removeFromNodeContainer(${id})`);

  button.appendChild(img);

  container.appendChild(button);
}

function removeFromNodeContainer(id) {
  $(`#button${id}`).remove();
}

function closeMenu() {
  //TODO: Add if that put nodedataBox nodes back to nodeBox
  $('#center-menu').html('');
  $('#confirmBox').html('');
}


//All helper functions to access data, etc.



function getDataIndex(id, data) {
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

function isMom(node, momArray) {
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

function hasRelationship(node, momArray) {

  let hasRelationship = false;

  if (node.spouse != null) {
    hasRelationship = true;
  }

  if (isMom(node, momArray)) {
    hasRelationship = true;
  }

  if (node.mother != null) {
    hasRelationship = true;
  }

  return hasRelationship;

}

//Gets highest generation count
function getGenerationCount(node, count, data) {
  if (node.mother == null) {
      if (node.spouse != null) {
      let spouseIndex = getDataIndex(node.spouse, data);
      if (data[spouseIndex].mother != null) {
        let motherIndex = getDataIndex(data[spouseIndex].mother, data);
        return count += getGenerationCount(data[motherIndex], count, data);
      }
      else {
        return count;
      }
    }
    else {
      return count;
    }
  }

  let motherIndex = getDataIndex(node.mother, data);

  if (node.mother != null) {
    return count += getGenerationCount(data[motherIndex], count, data);
  }
}

function getGeneration(node, data) {
  let count = 1;

  count = getGenerationCount(node, count, data);

  return count;
}

function getNumInGeneration(generation, data) {
  let numInGen = 0;
  for (let i = 0; i < data.length; ++i) {
    if (getGeneration(data[i], data) == generation) {
      numInGen++;
    }
  }
  return numInGen;
}

function getNodesInGeneration(generation) {
  let nodeGeneration = [];
  for (let i = 0; i < data.length; ++i) {
    if (getGeneration(data[i], data) == generation) {
      nodeGeneration.push(data[i]);
    }
  }

  return nodeGeneration;
}

function getChildren(motherNode, momArray) {
  let children = [];
  if (isMom(motherNode), momArray) {
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
    let spouseIndex = getDataIndex(node.spouse, data);
    if (node.spouse != null && data[spouseIndex].mother != null) {
      let motherIndex = getDataIndex(data[spouseIndex].mother, data);
      return getRootNode(data[motherIndex]);
    }
    else {
      return node;
    }
  }

  if (node.mother != null) {
    let momIndex = getDataIndex(node.mother, data);
    return getRootNode(data[momIndex]);
  }
}

function partOfFamilyLine(targetNode, node, momArray) {
  let children = [];
  if (isMom(node), momArray) {
    children = getChildren(node, momArray);
  }

  //Accounts for if spouse is Mom
  if (node.spouse != null) {
    let spouseIndex = getDataIndex(node.spouse, data);
    if (isMom(data[spouseIndex]), momArray) {
      children = getChildren(data[spouseIndex], momArray);
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
        return partOfFamilyLine(targetNode, children[i], momArray)
      }
    }
  }

  return false;
}

function getSpacing(rootNode, spacing, targetNode, momArray) {
  let children = [];
  if (isMom(rootNode), momArray) {
    children = getChildren(rootNode, momArray);
  }

  //Accounts for if spouse is Mom
  if (rootNode.spouse != null) {
    let spouseIndex = getDataIndex(rootNode.spouse, data);
    if (isMom(data[spouseIndex], momArray)) {
      children = getChildren(data[spouseIndex], momArray);
    }
  }

  //Base Case
  if (children.length == 0) {
    return spacing;
  }

  if (children.length != 0) {
    for (let i = 0; i < children.length; ++i) {
      if (partOfFamilyLine(targetNode, children[i], momArray)) {
        return getSpacing(children[i], (spacing / children.length), targetNode, momArray);
      }
    }
  }

  return spacing
}

//FIXME: prioritize moving spouses with no moms and also spouses who are already on the tree
function adjustSpouseXPos(node, data) {

  let spouse = $(`#${node.spouse}`);
  let currNode = $(`#${node.image}`);

  let spouseXPos = parseAttribute('x', spouse[0].style.cssText);
  let nodeXPos = parseAttribute('x', currNode[0].style.cssText);

  let generation = getGeneration(node, data)

  //FIXME: everything below this has to change
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

//FIXME: could potentially be overlap of nodes because this checks for EXACT x, not range of x to account for node width
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

