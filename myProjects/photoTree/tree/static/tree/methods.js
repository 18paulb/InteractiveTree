let myFunct = function() {
    document.getElementById('1').src='../../static/tree/images/test.jpg'
}




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








//I'm gonna need to change the innerHTML to make new <div> tags whenever I drag between the tree