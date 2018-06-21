$(function(){
    
    $.get({
        type: 'GET',
        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8107a525c841e0b25de543e35fd372943e7b9f1f',
    }, function(data){
        var stations = data;
        for ( i=0 ; i<stations.length ; i++){
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
                document.getElementById("nomStation").innerHTML = marker.name ;
                document.getElementById("adresse").innerHTML = marker.adresse ;
                document.getElementById("nombreDePlaces").innerHTML = marker.places ;
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
                                console.log("Local storage : " + storeReservation);
                                save('data', storeReservation, 1);
                                load('data');
                                document.getElementById("placesDisponibles").innerHTML = marker.velosDisponibles - 1;
                                document.getElementById("reservationEnCours").innerHTML = "Vous avez reservé un vélo à la station " + marker.name
                                console.log("Vous avez reservé un vélo à la station " + marker.name)
                            }
                            else if (storeReservation !== null){
                                document.getElementById("reservationEnCours").innerHTML = "Veuillez annuler votre réservation à la station " + reservationEnCours.value
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
                addMarker(coords, nomStation)
            };
    
            // Ajout du cluster de markers
            // Ajout de d'une liste des "locations" et des "labels" pour chaque station
            
            var locations = []
            for (i=0 ; i<stations.length ; i++){
                locations.push({lat:stations[i].position.lat,
                lng:stations[i].position.lng})
                var labels = i+1
            }
            
            var markers = locations.map(function(location, i) {
              return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
              });
            });
            
            var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}); //mettre un chemin local ?
            
           
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
    setInterval(function(){
        var minutesRestantes = heureExpiration-Date.now()
        document.getElementById("compteARebours").innerHTML = "Expiration de la réservation dans " + convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
        if (minutesRestantes<0){
            localStorage.clear();
            document.getElementById("compteARebours").innerHTML = "Expirée"
        }
    }, 1000)
}

function eraseLocalData(){
    window.onbeforeunload = function () {
    localStorage.clear();
    };
}

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { d: d, h: h, m: m, s: s };
};
