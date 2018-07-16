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
                var buttonResvervation = document.getElementById("reservation")
                buttonResvervation.addEventListener('click', function(){
                    var reservation = Object.create(Reservation);
                    reservation.init(station.nom);
                })
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
        // Permettre la réservation si des places sont disponibles
        if (this.placesDisponibles===0) {
            document.getElementById("reservation").style.display = "none";
        } else if (this.placesDisponibles>0){
            document.getElementById("reservation").style.display = "block";
        }
    }
}

// A faire un prototype de reservation

var Reservation = {
    //Initialise la reservation
    init: function (station){
        this.station = station;
        document.getElementById("reservationEnCours").innerHTML = "Vous avez reservé un vélo à la station " + this.station
        var record = {
            stationReservee: (this.station), 
            tempsExpiration: new Date().getTime() + 1*60*1000
        }
        localStorage.setItem("key", JSON.stringify(record));
        setInterval(function(){
            var minutesRestantes = record.tempsExpiration-Date.now()
            if (minutesRestantes>0){
            document.getElementById("compteARebours").innerHTML = "Expiration de la réservation dans " + convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
            } else if (minutesRestantes<0){
                localStorage.removeItem("key")
                document.getElementById("compteARebours").innerHTML = "Expirée"
            }
        }, 1000)
    }
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
