//Drag and drop section

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


//To allow dropping between elements, consider messing around with DOM


/*
//Test code, will probably delete
function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
       (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
 }



 function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('dragme');
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
 }
 function drag_over(event) {
    event.preventDefault();
    return false;
 }

var dm = document.getElementById('dragme');
dm.addEventListener('dragstart', drag_start, false);
document.body.addEventListener('dragover', drag_over, false);
document.body.addEventListener('drop', drop, false);
*/


// Option to look at for examples //https://github.com/frontend-collective/react-sortable-tree    