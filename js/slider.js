var Slider = function() {                                                                     
    compteur = 0;			                                                            // point de départ pour compter les images
    images = ["../images/image1.gif", "../images/image2.gif",  "../images/image3.gif"]; // images tableau
    suivant = document.getElementById("suiv");                                          // bouton suivant
    precedent = document.getElementById("prec");                                        // bouton précedent
    
    actualiser = function actualiser(){                                                 // méthode qui actualise la source de l'image
        document.slide.src = images[compteur];
    }
    sliderPlus = function sliderPlus(){                                                 // méthode qui incrémente d'une image
        if(compteur < images.length - 1){
            compteur++; 
        } else {
            compteur = 0;
        }
        actualiser();  
    }
    sliderMoins = function sliderMoints(){                                              // méthode qui décrémente d'une image
        if (compteur>0){
            compteur--;
        } else {
            compteur = images.length-1;
        }
        actualiser();
    }
    
    setInterval(sliderPlus,15000);                                                      // incrémente toutes les 15 secondes
    suivant.addEventListener('click', sliderPlus);                                      // événement incrémente au clic sur le bouton suivant
    precedent.addEventListener('click', sliderMoins);                                   // événement décrémente au clic sur le bouton précédent
    
    checkKeyPressed = function checkKeyPressed(e){                                      // méthode changement d'image au clavier
        if (e.keyCode == "39") {
            sliderPlus();
            actualiser();
        } else if (e.keyCode == "37") {
            sliderMoins();
            actualiser();
        }
    }
    window.addEventListener("keydown", checkKeyPressed, false);                         // événement changement d'image au clavier                         
}

var slider1 = new Slider                                                                // instanciation d'un objet slider1