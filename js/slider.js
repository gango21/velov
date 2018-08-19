var i = 0; 			// Start Point
var images = [];	// Images Array
var time = 9000;	// Time Between Switch
var suivant = document.getElementById("suiv")
var precedent = document.getElementById("prec")
	 
// Image List
images[0] = "../images/image1.png";
images[1] = "../images/image2.png";
images[2] = "../images/image3.png";

// Change Image
function changeImg(){
	document.slide.src = images[i];

	// Check If Index Is Under Max
	if(i < images.length - 1){
	  // Add 1 to Index
	  i++; 
	} else { 
		// Reset Back To O
		i = 0;
	}

	// Run function every x seconds
	setTimeout("changeImg()", time);
}
    
    suivant.addEventListener('click', function(){
            document.slide.src = images[i];

        // Check If Index Is Under Max
        if(i < images.length - 1){
          // Add 1 to Index
          i++; 
        } else { 
            // Reset Back To O
            i = 0;
        }
    })
    
    precedent.addEventListener('click', function(){
            document.slide.src = images[i];

        // Check If Index Is Under Max
        if(i > 0){
          // Delete 1 to Index
          i--; 
        } else { 
            // Reset To End
            i = images.length;
        }
    })


// Run function when page loads
window.onload=changeImg;