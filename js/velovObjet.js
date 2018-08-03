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
            // bouton de reservation
            var buttonResvervation = document.getElementById("reservation")
            // créer un objet reservation
            buttonResvervation.addEventListener('click', function(){
                var confirmation = true
                if (localStorage.getItem("key") !== null){
                    var confirmation = confirm("Vous allez annuler la réservation en cours à ")
                }
                if (confirmation) {
                    var reservation = Object.create(Reservation);
                    reservation.init(station.nom);
                    // bouton d'annulation
                    var buttonAnnulation = document.getElementById("annuler")
                    // créer un objet d'annulation
                    buttonAnnulation.addEventListener('click', function(){ 
                        var annulation = Object.create(Annulation);
                        annulation.init(station.nom);
                    })
                }
            })
        })
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

var Reservation = {
    //Initialise la reservation
    init: function (station){
        this.station = station;
        document.getElementById("reservationEnCours").innerHTML = " Vous avez reservé un vélo à la station " + this.station
        document.getElementById("annuler").value = "Annuler " + this.station
        var record = {
            stationReservee: (this.station), 
            tempsExpiration: new Date().getTime() + 1*60*1000
        }
        localStorage.setItem("key", JSON.stringify(record));
        clearInterval(checkCompteRebours)
        var checkCompteRebours = setInterval(myTimer, 1000);
    }
}

var Annulation = {
    //Initialise la reservation
    init: function (station){
        this.station = station;
        document.getElementById("reservationEnCours").innerHTML = "Vous avez annulé une réservation à la station " + this.station
        var record = {
            stationReservee: (this.station), 
            tempsExpiration: new Date().getTime()
        }
        localStorage.setItem("key", JSON.stringify(record));
        
        var checkCompteRebours = setInterval(myTimer, 0);
        clearInterval(checkCompteRebours);
    }
}

function myTimer() {
    var storage = localStorage.getItem("key")
    var localStorageJSON = JSON.parse(storage)
    var minutesRestantes = localStorageJSON.tempsExpiration-Date.now();
    if (minutesRestantes>0){
        document.getElementById("compteARebours").innerHTML = "Expiration de la réservation dans " + convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
        document.getElementById("annuler").style.display = "block";
    } else if (minutesRestantes<0){
        document.getElementById("compteARebours").innerHTML = "Expirée"
        document.getElementById("annuler").style.display = "none";
        localStorage.clear()
    }
    return minutesRestantes;
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

window.addEventListener('unload', function() {
        localStorage.clear()
      });