
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
    let bodyRect = document.body.getBoundingClientRect()

    console.log(" Position of " + id + " Relative to Page View: \n")
    console.log("Top: " + pos.top + " Right: " + pos.right + " Bottom: " + pos.bottom + " Left: " + pos.left)

    /*
    topOffset = pos.top - bodyRect.top
    rightOffset = bodyRect.right - pos.right
    bottomOffset = bodyRect.bottom - pos.bottom
    leftOffset = pos.left - bodyRect.left

    console.log("Position of " + id + " Relative to Full Page: \n")
    console.log("Top: " + topOffset + " Right: " + rightOffset + " Bottom: " + bottomOffset + " Left: " + leftOffset)
    */

    return pos
    
}

function changeSVG(position1, position2) {

    //FIXME I'm not getting the middle position, coordinates are wrong
    //FIXME fix top position, then doesn't extend all the way to div

    let x1 = (position1.right / 2) - position1.left
    let y1 = position1.top / 2

    let x2 = (position2.right / 2) - position2.left
    let y2 = position2.top * 2

    document.getElementById('SVG1').innerHTML = '<line x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' stroke="red"/>'
}







//I'm gonna need to change the innerHTML to make new <div> tags whenever I drag between the tree

//Finding positions of elements https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
//Use this to use a function that calculates position so that SVG line can follow wherever you drag too