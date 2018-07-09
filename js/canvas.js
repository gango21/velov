var canvas  = document.querySelector('#canvas');
var context = canvas.getContext('2d');
context.strokeStyle = "gold";
context.strokeRect(0, 0, 250, 100);

var md = false;

canvas.addEventListener("mousedown", down);
canvas.addEventListener("mouseup", toggledraw);
canvas.addEventListener("mousemove", 
                       function(evt){
    var mousePos = getMousePos (canvas, evt);
    var posx = mousePos.x;
    var posy = mousePos.y;
    draw(canvas, posx, posy);
});

function down(){
    md = true;
}
function toggledraw(){
    md = false;
}
function getMousePos(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return{
        x:evt.clientX - rect.left,
        y:evt.clientY - rect.top
    };
}
function draw(canavas, posx, posy){
    var context = canvas.getContext("2d")
    if(md){
        context.fillRect(posx, posy, 4, 4);
    }
}