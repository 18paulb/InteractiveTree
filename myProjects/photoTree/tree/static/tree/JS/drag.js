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











// Option to look at for examples //https://github.com/frontend-collective/react-sortable-tree    