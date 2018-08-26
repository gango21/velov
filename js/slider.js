var compteur = 0; 			// Start Point
var images = [];	// Images Array
var time = 9000;	// Time Between Switch
var suivant = document.getElementById("suiv") //bouton suivant
var precedent = document.getElementById("prec") //bouton précédent
	 
// Image List
images[0] = "../images/image1.png";
images[1] = "../images/image2.png";
images[2] = "../images/image3.png";

// Change Image
function changeImg(){
    
	document.slide.src = images[compteur];

	// Check If Index Is Under Max
	if(compteur < images.length - 1){
	  // Add 1 to Index
	  compteur++; 
	} else { 
		// Reset Back To O
		compteur = 0;
	}

	// Run function every x seconds
	setTimeout("changeImg()", time);
}

//Change Image bouton suivant
suivant.addEventListener('click', function(){
            
    // Check If Index Is Under Max
    if(compteur < images.length - 1){
        // Add 1 to Index
        compteur++; 
    } else { 
        // Reset Back To O
        compteur = 0;
    }
    document.slide.src = images[compteur];
    console.log("suivant" + compteur)    
})
   
//Change Image bouton précédent
precedent.addEventListener('click', function(){
           
    // Check If Index Is Over Min
    if(compteur > 0){
        // Delete 1 to Index
        compteur--; 
    } else { 
        // Reset To End
        compteur = images.length-1;
    }
    console.log("precedent" + compteur)
    document.slide.src = images[compteur];
})

//Change keydown
window.addEventListener("keydown", checkKeyPressed, false);
 
function checkKeyPressed(e) {
    if (e.keyCode == "39") {
        // Check If Index Is Under Max
        if(compteur < images.length - 1){
            // Add 1 to Index
            compteur++; 
        } else { 
            // Reset Back To O
            compteur = 0;
        }
        document.slide.src = images[compteur];
        console.log("suivant" + compteur)    
    } else if (e.keyCode == "37") {
        // Check If Index Is Over Min
        if(compteur > 0){
            // Delete 1 to Index
            compteur--; 
        } else { 
            // Reset To End
            compteur = images.length-1;
        }
        console.log("precedent" + compteur)
        document.slide.src = images[compteur];
    }
}

// Run function when page loads
window.onload=changeImg;
