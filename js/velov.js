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
                
            eraseLocalData() ;
        
            //Evènement au clic sur un marker et reservation
            marker.addListener('click', function() {
                console.log(marker.name)
                document.getElementById("nomStation").innerHTML = marker.name ;
                console.log(marker.adresse)
                document.getElementById("adresse").innerHTML = marker.adresse ;
                console.log(marker.places)
                document.getElementById("nombreDePlaces").innerHTML = marker.places ;
                console.log(marker.velosDisponibles)
                document.getElementById("placesDisponibles").innerHTML = marker.velosDisponibles ;
                if (marker.velosDisponibles === 0){
                    document.getElementById("reservation").style.display = "none";
                }
                else {
                document.getElementById("reservation").style.display = "block";
                var buttonResvervation = document.getElementById("reservation")
                    buttonResvervation.addEventListener('click', function(){
                        if (marker.velosDisponibles > 0){
                            var storeReservation = marker.name;
                            console.log("Local stroage : " + storeReservation);
                            save('data', storeReservation, 20);
                            load('data');
                            document.getElementById("placesDisponibles").innerHTML = marker.velosDisponibles - 1;
                            document.getElementById("reservationEnCours").innerHTML = "Vous avez reservé un vélo à la station " + marker.name
                            console.log("Vous avez reservé un vélo à la station " + marker.name)
                        }
                        else if (marker.velosDisponibles === 0){
                            console.log("Pas de vélos disponible")
                            document.getElementById("reservationEnCours").innerHTML = "Pas de vélos disponibles à la station " + marker.name
                            document.getElementById("placesDisponibles").innerHTML = 0;
                        }
                    })
                 }
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
    
            reservationEnCours();
            
}

function save(key, jsonData, expirationMin){
		var expirationMS = expirationMin * 60 * 1000;
		var record = {value: JSON.stringify(jsonData), timestamp: new Date().getTime() + expirationMS}
		localStorage.setItem(key, JSON.stringify(record));
		return jsonData;
	}
function load(key){
		var record = JSON.parse(localStorage.getItem(key));
		if (!record){return false;}
        tempsRestant(record);
		return (new Date().getTime() < record.timestamp && JSON.parse(record.value))
	}
function tempsRestant(record){
    var heureExpiration = record.timestamp;
    document.getElementById("compteARebours").innerHTML = "Expiration de la réservation : " + new Date(heureExpiration)
}

function reservationEnCours(){
    if (new Date().getTime() > localStorage.getItem("timestamp")){
        var reservationEnCours = JSON.parse(localStorage.getItem("data"))
        console.log(reservationEnCours.value)
        console.log("Reservation en cours");
        document.getElementById("reservationEnCours").innerHTML = "Vous avez reservé un vélo à la station " + reservationEnCours.value
        console.log(localStorage.getItem("data"))
        document.getElementById("compteARebours").innerHTML = "Expiration de la réservation : " + new Date(reservationEnCours.timestamp)
    }
    else {
        console.log("Pas de reservation")
    }
}

function eraseLocalData(){
    window.onbeforeunload = function () {
    localStorage.clear();
};
}