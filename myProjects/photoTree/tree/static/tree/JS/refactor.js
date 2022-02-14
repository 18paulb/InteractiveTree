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

  //Sorts children oldest to youngest
  //n^3 bigO, gross
  /*
  for (let i = 0; i < tmpArray.length; i++) {
    for (let k = 0; k < tmpArray[i][0].children.length; ++k) {
      for (let j = 0; j < tmpArray[i][0].children.length - i - 1; j++) {
        if (tmpArray[i][0].children[j].birthyear > tmpArray[i][0].children[j+1].birthyear) {
          let tmp = tmpArray[i][0].children[j];
          tmpArray[i][0].children[j] = tmpArray[i][0].children[j+1];
          tmpArray[i][0].children[j+1] = tmp;
        }
      }
    }
  }
  */


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



//All functions for chart creation and functionality



function createChart(chart) {

  createDataPoints(chart);

  //Testing
  for (let i = 0; i < data.length; ++i) {
    if (data[i].spouse != null) {
      adjustSpouseXPos(data[i]);
    }
  }

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


    li.setAttribute('id', data[i].image);
    li.setAttribute('style', `--y: ${Math.round(yPos)}px; --x: ${Math.round(xPos)}px`);

    
    li.innerHTML += `<div id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'>
    <img class="data-point data-button" src="../../static/tree/images/pictures/${data[i].image}.PNG">
    </div>`
    
   /*
    $("li").html(`<div id='button${data[i].image}' onclick='addToConfirmBox(${data[i].image})'>
    <img class="data-point data-button" src="../../static/tree/images/pictures/${data[i].image}.PNG" onmouseenter='hoverMenu(${data[i].image})' onmouseleave='closeHoverMenu()'>
    </div>`)
  */
    chart.appendChild(li);
  }

}

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
      }
    }
  }
}

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

  xPos = (width/ getNumInGeneration(keyGen)) * currGeneration;
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

    /*
    //TESTING FOR PRESENTATION
    momIndex = getDataIndex(mother.image);
    data.splice(momIndex - 1, 0, child)
    //
    */

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

function changeAddButtonParameters() {
  let box = document.getElementById('confirmBox')
  let children = []

  for (let i = 0; i < box.children.length; ++i) {
    children.push(box.children[i].id.substr(4));
  }

  let button = document.getElementById('addMotherButton');
  let button2 = document.getElementById('addSpouseButton');
  let button3 = document.getElementById('swapButton');

  if (children.length != 0) {
    let param1 = children[0];
    let param2 = children[1];
    button.setAttribute('onclick',`changeAddButtonParameters(), addMotherRelationship(${param1}, ${param2})`);
    button2.setAttribute('onclick',`changeAddButtonParameters(), addSpouseRelationship(${param1}, ${param2})`);
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
  let box = document.getElementById("confirmBox");

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

  //sets border for confirmBox
  if (box.children.length > 0) {
    box.style.border = "5px solid black";
  }

  //Changes Parameters for Change Relationship button
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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


function openMenu(id1, id2) {

  let box = document.getElementById('confirmBox');

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


  if (box.children.length == 2) {
    let menu = document.getElementById('center-menu');

    menu.innerHTML = `<div id='center-menu' class='center-menu'>
  
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

  //TODO Add if that put nodedataBox nodes back to nodeBox


  menu.innerHTML = '';

  let confirmBox = document.getElementById('confirmBox');
  confirmBox.innerHTML = '';
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

  let spouse = document.getElementById(`${node.spouse}`);
  let currNode = document.getElementById(`${node.image}`);

  let spouseXPos = parseAttribute('x', spouse.style.cssText);
  let nodeXPos = parseAttribute('x', currNode.style.cssText);

  let generation = getGeneration(node)

  //FIXME everything below this has to change
  let spacing = 100;


  if (emptyXLocation(nodeXPos + spacing, generation)) {
    spouseXPos = nodeXPos + spacing;

    let originalY = parseAttribute('y', spouse.style.cssText);
    spouse.setAttribute('style', `--y: ${originalY}px; --x: ${spouseXPos}px`);
  }
  else if (emptyXLocation(nodeXPos - spacing, generation)) {
    spouseXPos = nodeXPos + spacing;

    let originalY = parseAttribute('y', spouse.style.cssText);
    spouse.setAttribute('style', `--y: ${originalY}px; --x: ${spouseXPos}px`);
  }
}

//FIXME could potentially be overlap of nodes because this checks for EXACT x, not range of x to account for node width
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
      
    
    if ((xPos >= tmpX - 30) && (xPos <= tmpX + 30)) {
      isEmpty = false;
      return isEmpty
    }
    
    
  }

  return isEmpty;
}
