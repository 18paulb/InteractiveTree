//Getting X,Y Positions Relative to current view of page
function getPosition(id) {
    
    let tmpEl = document.getElementById(id);
    let pos = tmpEl.getBoundingClientRect();    //Gets position of element relative to viewport

    console.log(" Position of " + id + " Relative to Page View: \n")
    console.log("Top: " + pos.top + " Right: " + pos.right + " Bottom: " + pos.bottom + " Left: " + pos.left)

    //This should get position relative to pageView
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

function changeSVG(id1, id2, SVGId) {

    //FIXME Coordinates are right SVG is being dumb and not showing, I think part of problem is positioning
    //Try doing it based on position relative to whole page

//Get positions of the two elements
    let pos1 = getPosition(id1)
    let pos2 = getPosition(id2)

//Tries to aproximate height and width of SVG    //FIXME Might need work
    let width = Math.abs(pos1.left - pos2.right)
    let height = Math.abs((pos1.bottom - pos1.top) + (pos2.bottom - pos2.top))

    //Gets avg to get middle of div element
    let x1 = (pos1.right + pos1.left) / 2
    let y1 = (pos1.top + pos1.bottom) / 2

    //Gets avg to get middle of div element
    let x2 = (pos2.right + pos2.left) / 2
    let y2 = (pos2.top + pos2.bottom) / 2

    document.getElementById(SVGId).innerHTML = '<svg width="' + width + '" height="' + height + '"><line x1=' + x1 + ' y1=' + y1 + ' x2=' + x2 + ' y2=' + y2 + ' stroke="red"/></svg>'

}







//I'm gonna need to change the innerHTML to make new <div> tags whenever I drag between the tree

//Finding positions of elements https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
//Use this to use a function that calculates position so that SVG line can follow wherever you drag too



//For sorting in specific positions: https://jqueryui.com/sortable/