var CanvasSignature = function(){
    buttonResvervation = document.getElementById("reservation"); // élément buttonReservation
    buttonResvervation.style.display = "none";                   // élément buttonReservation initialement non affiché
    canvas = document.querySelector('#canvas');                  // élement canvas
    canvas.style.display = "none";                               // élement canvas initialement non affiché
    destCanvas = document.getElementById('destCanvas');          // élément destCanvas qui sera une copie du canvas signé dans le pied de page
    destCanvas.style.display = "none";                           // élément destCanvas initialement non affiché
    context = canvas.getContext('2d');                           // contexte de dessin sur l'élément canvas
    context.fillStyle = "rgb(189,212,148)";
    context.fillRect(0,0,250,100);
    destCtx = destCanvas.getContext('2d');                       // contexte de dessin sur l'élément destCanvas
    destCtx.fillRect(0,0,250,100);
    md = false;                                                  // mouse down initialement faux
    
    down = function down(){                                      // méthode down rend md vrai
        md = true;
        }
    toggledraw = function toggledraw(){                          // méthode toggledraw rend md faux
    md = false;
        }
    getMousePos = function getMousePos(canvas, evt){             // méhtode getMousePos, calcule et retourne les coordonnées de la souris
        rect = canvas.getBoundingClientRect();              
        return{
            x:evt.clientX - rect.left,
            y:evt.clientY - rect.top
        };
    }
    draw = function draw(canvas, posx, posy){                   // méthode draw dessine selon position de la souris et affiche le bouton de réservation
        if(md){
            context.fillRect(posx, posy, 5, 5);
            context.fillStyle = "rgb(100,100,100)";
            buttonResvervation.style.display="block";
        }
    }
    save = function save(){                                     // méthode save 
        dataURL = canvas.toDataURL("image/png", 1);             
        destCtx.drawImage(canvas, 0, 0);                        // - copie le canvas signé vers destCtx dans le pied de page
        destCanvas.style.display = "block"                      
        context.fillStyle = "rgb(189,212,148)";                 // - "efface" le canvas de signature
        context.fillRect(0,0,250,100);                          // - "efface" le canvas de signature
    }
    
    canvas.addEventListener("mousedown", down);                
    canvas.addEventListener("mouseup", toggledraw);
    canvas.addEventListener("mousemove", 
                       function(evt){
        mousePos = getMousePos (canvas, evt);
        posx = mousePos.x;
        posy = mousePos.y;
        draw(canvas, posx, posy);
    });
    buttonResvervation.addEventListener("click", save);
}

var canvasSignature = new CanvasSignature
















