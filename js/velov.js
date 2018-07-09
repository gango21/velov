function init(){
    
    $.get({
        type: 'GET',
        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8107a525c841e0b25de543e35fd372943e7b9f1f',
    }, function(data){
        var stations = data;
        var reservation = false;
        console.log(reservation)
        console.log(stations)
        if (stations != undefined){
            initMap(stations)
        }
        
    })
}


function initMap(stations){
            var options = {
                zoom:13,
                center:{lat:45.750000,lng:4.850000}
            }
            
            //nouvelle carte
            var map = new google.maps.Map(document.getElementById('map'),options);
    
            //Add Marker function
            /*function addMarker(coords, nomStation){
                var marker = new google.maps.Marker({
                    position:coords,
                    name:nomStation,
                    adresse:adresse,
                    places:places,
                    velosDisponibles:velosDisponibles,
                    map:map,
                });
            
            eraseLocalData() ;
        
            
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
                console.log(stations[i].name)
            };*/
    
            // Ajout du cluster de markers
            // Ajout de d'une liste des "locations" et des "labels" pour chaque station
            
            var locations = []
            for (i=0 ; i < stations.length ; i++){
                locations.push({
                    lat:stations[i].position.lat,
                    lng:stations[i].position.lng
                });
                var labels = i+1;
            }
    
            var markers = locations.map(function(location, i) {
                var marker = new google.maps.Marker({
                position: location,
                labels: labels[i % labels.length],
                map:map,
                });
            
                //Evènement au clic sur un marker et reservation
            marker.addListener('click', function() {
                document.getElementById("nomStation").innerHTML = stations[i].name ;
                document.getElementById("adresse").innerHTML = stations[i].address ;
                document.getElementById("nombreDePlaces").innerHTML = stations[i].bike_stands ;
                document.getElementById("placesDisponibles").innerHTML = stations[i].available_bikes ;
                if (stations[i].available_bikes === 0){
                    document.getElementById("reservation").style.display = "none";
                }
                else {
                    document.getElementById("reservation").style.display = "block";
                    var buttonResvervation = document.getElementById("reservation")
                    buttonResvervation.addEventListener('click', function(){
                            if (stations[i].available_bikes > 0){
                                var storeReservation = stations[i].name;
                                save('data', storeReservation, 0.5);
                                load('data');
                                stations[i].available_bikes --;
                                document.getElementById("placesDisponibles").innerHTML = stations[i].available_bikes;
                                document.getElementById("reservationEnCours").innerHTML = "Vous avez reservé un vélo à la station " + stations[i].name
                            }
                            else if (stations[i].available_bikes === 0){
                                document.getElementById("reservationEnCours").innerHTML = "Pas de vélos disponibles à la station " + stations[i].name
                                document.getElementById("placesDisponibles").innerHTML = 0;
                            }
                    })
                }
                
                
            });
                return marker
            });
            
            var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}); //mettre un chemin local ? 
    
            // Si il y a une réservation permettre l'annulation
                setInterval(function(){
                    if (reservation) {
                    document.getElementById("annuler").style.display = "block";
                    var buttonAnnulation = document.getElementById("annuler")
                    buttonAnnulation.addEventListener('click', function(){
                        localStorage.clear()
                        document.getElementById("compteARebours").innerHTML = "Annulée"
                    })
                    }
                }, 1000)
}

function save(key, jsonData, expirationMin){
        var reservation = true;
		var expirationMS = expirationMin * 60 * 1000;
		var record = {value: (jsonData), timestamp: new Date().getTime() + expirationMS}
		localStorage.setItem(key, JSON.stringify(record));
        document.getElementById("annuler").value = "Annuler " +  record.value
		return jsonData;
}

function load(key){
		var record = JSON.parse(localStorage.getItem(key));
		if (!record){return false;}
        tempsRestant(record);
		return (new Date().getTime() < record.timestamp && (record.value))
}

function tempsRestant(record){
    var heureExpiration = record.timestamp;
    setInterval(function(){
        var minutesRestantes = heureExpiration-Date.now()
        document.getElementById("compteARebours").innerHTML = "Expiration de la réservation dans " + convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
        if (minutesRestantes<0){
            localStorage.removeItem("data")
            document.getElementById("compteARebours").innerHTML = "Expirée"
            var reservation = false;
        }
    }, 1000)
}

/*function eraseLocalData(){
    window.onbeforeunload = function () {
    localStorage.clear();
    };
}*/

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
