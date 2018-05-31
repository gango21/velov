$(function(){
    
    $.get({
        type: 'GET',
        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8107a525c841e0b25de543e35fd372943e7b9f1f',
    }, function(data){
        var stations = data;
        for ( i=0 ; i<stations.length ; i++){
            console.log("Nome de la station : " + stations[i].name + ", latitude : " + stations[i].position.lat + ", longitude : " + stations[i].position.lng)
        }
        initMap(stations)
    })
})


function initMap(stations){
            var options = {
                zoom:13,
                center:{lat:45.750000,lng:4.850000}
            }
            
            //nouvelle carte
            var map = new google.maps.Map(document.getElementById('map'),options);
            
            
            //Add Marker function
            function addMarker(coords, nomStation){
                var marker = new google.maps.Marker({
                    position:coords,
                    name:nomStation,
                    adresse:adresse,
                    places:places,
                    velosDisponibles:velosDisponibles,
                    map:map,
                });

        
            //Evènement au clic sur un marker
            marker.addListener('click', function() {
                console.log(marker.name)
                document.getElementById("nomStation").innerHTML = marker.name ;
                console.log(marker.adresse)
                document.getElementById("adresse").innerHTML = marker.adresse ;
                console.log(marker.places)
                document.getElementById("nombreDePlaces").innerHTML = marker.places ;
                console.log(marker.velosDisponibles)
                document.getElementById("placesDisponibles").innerHTML = marker.velosDisponibles ;
                var buttonResvervation = document.getElementById("reservation")
                    buttonResvervation.addEventListener('click', function(){
                        if (marker.velosDisponibles > 0){
                        document.getElementById("placesDisponibles").innerHTML = marker.velosDisponibles - 1;
                        console.log("Vous avez reservé un vélo à la station " + marker.name)
                        }
                        else {
                            console.log("Pas de vélos disponible")
                        }
                    })
                });
            }
    
           
    
            
            //Ajouter des marqueurs
            for (i=0 ; i<stations.length ; i++){
                var coords = {
                    lat:stations[i].position.lat,
                    lng:stations[i].position.lng
                }
                var nomStation = stations[i].name ;
                var adresse = stations[i].address ;
                var places = stations[i].bike_stands ;
                var velosDisponibles = stations[i].available_bikes ;
                
                console.log(coords)
                console.log(nomStation)
                console.log(adresse)
                addMarker(coords, nomStation)
            };
            
}


