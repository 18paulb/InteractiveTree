
function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

//Getting X,Y Positions Relative to current view of page
function getPosition(id) {
    
    let tmpEl = document.getElementById(id);
    let pos = tmpEl.getBoundingClientRect();

    console.log(" Position of " + id + " Relative to Page View: \n")
    console.log("Top: " + pos.top + " Right: " + pos.right + " Bottom: " + pos.bottom + " Left: " + pos.left)

    /*
    let bodyRect = document.body.getBoundingClientRect()
    topOffset = pos.top - bodyRect.top
    rightOffset = bodyRect.right - pos.right
    bottomOffset = bodyRect.bottom - pos.bottom
    leftOffset = pos.left - bodyRect.left

    console.log("Position of " + id + " Relative to Full Page: \n")
    console.log("Top: " + topOffset + " Right: " + rightOffset + " Bottom: " + bottomOffset + " Left: " + leftOffset)
    */

    return pos;
    
}

function changeSVG(id1, id2) {

    //FIXME I'm not getting the middle position, coordinates are wrong
    //Try doing it based on position relative to whole page


    let pos1 = getPosition(id1)
    let pos2 = getPosition(id2)

    document.getElementById('SVG1').style.width = pos1.right - pos1.left
    document.getElementById('SVG1').style.height = (pos1.bottom - pos1.top) + (pos2.bottom - pos2.top)


    pos1 = getPosition(id1)
    pos2 = getPosition(id2)

    let x1 = (pos1.right / 2) + pos1.left
    let y1 = pos1.top

    let x2 = (pos2.right / 2) + pos2.left
    let y2 = pos2.top

    document.getElementById('SVG1').innerHTML = '<line x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' stroke="red"/>'


/*
var line = document.getElementById('SVG1')
var div1 = document.getElementById('test1');
var div2 = document.getElementById('test2');

var x1 = div1.offsetLeft + (div1.style.width/2);
var y1 = div1.offsetTop + (div1.style.height/2);
var x2 = div2.offsetLeft + (div2.style.width/2);
var y2 = div2.offsetTop + (div2.style.height/2);

line.innerHTML = '<line x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' stroke="red"/>'
//line.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);
*/
    
}







//I'm gonna need to change the innerHTML to make new <div> tags whenever I drag between the tree

//Finding positions of elements https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
//Use this to use a function that calculates position so that SVG line can follow wherever you drag too