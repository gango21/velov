function init(){
    
    $.get({
        type: 'GET',
        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8107a525c841e0b25de543e35fd372943e7b9f1f',
    }, function(data){
        var stations = data;
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
                
                // créer un objet station au clic sur un marqueur
            marker.addListener('click', function() {
                var station = Object.create(Station);
                station.init(stations[i].name, stations[i].bike_stands, stations[i].available_bikes, stations[i].address)
                console.log(station)
            });
                return marker
            });
            
            var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}); //mettre un chemin local ? 
}

// POO

// prototype d'une station
var Station = {
    // Initialise la station
    init: function (nom, places, placesDisponibles, adresse) {
        this.nom = nom;
        this.places = places;
        this.placesDisponibles = placesDisponibles;
        this.adresse = adresse;
        document.getElementById("nomStation").innerHTML = this.nom;
        document.getElementById("adresse").innerHTML = this.adresse;
        document.getElementById("nombreDePlaces").innerHTML = this.places;
        document.getElementById("placesDisponibles").innerHTML = this.placesDisponibles;
    }
}

// A faire un prototype de reservation
