
var buttonResvervation = document.getElementById("reservation")
buttonResvervation.style.display = "none"
var canvas  = document.querySelector('#canvas');
canvas.style.display = "none"
var destCanvas = document.getElementById('destCanvas');
destCanvas.style.display = "none"
var dataURL = canvas.toDataURL('image/jpeg',0.5);
var context = canvas.getContext('2d');
var destCtx = destCanvas.getContext('2d');
context.strokeStyle = "gold";
context.strokeRect(0, 0, 250, 100);
context.fillStyle = "rgb(189,212,148)";
context.fillRect(0,0,250,100);
destCtx.fillRect(0,0,250,100);


var md = false;

buttonResvervation.addEventListener("click", save);
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

function draw(canvas, posx, posy){
    var context = canvas.getContext("2d")
    if(md){
        context.fillRect(posx, posy, 5, 5);
        context.fillStyle = "rgb(100,100,100)";
        buttonResvervation.style.display="block";
    }
}

function save(){
    var dataURL = canvas.toDataURL("image/png", 1);
    destCtx.drawImage(canvas, 0, 0);
    destCanvas.style.display = "block"
    context.fillStyle = "rgb(189,212,148)";
    context.fillRect(0,0,250,100);
}