var buttonResvervation = document.getElementById("reservation")
var buttonAnnulation = document.getElementById("annuler")
var nomStation = document.getElementById("nomStation")
var adresseStation = document.getElementById("adresse")
var nombreDePlaces = document.getElementById("nombreDePlaces")
var placesDisponiblesStation = document.getElementById("placesDisponibles")
var reservationEnCours = document.getElementById("reservationEnCours")
var compteARebours = document.getElementById("compteARebours")
var checkCompteRebours = null
var temps = null

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
            document.getElementById("etatstation").style.opacity = 1;
            var station = Object.create(Station);
            station.init(stations[i].name, stations[i].bike_stands, stations[i].available_bikes, stations[i].address)
            // créer un objet reservation
            buttonResvervation.addEventListener('click', function(){
                var reservation = Object.create(Reservation);
                reservation.init(station.nom);
                // créer un objet d'annulation
                buttonAnnulation.addEventListener('click', function(){ 
                    var annulation = Object.create(Annulation);
                    annulation.init(station.nom);
                })
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
        nomStation.innerHTML = this.nom;
        adresseStation.innerHTML = this.adresse;
        nombreDePlaces.innerHTML = this.places;
        placesDisponiblesStation.innerHTML = this.placesDisponibles;
        // Permettre la réservation si des places sont disponibles
        if (this.placesDisponibles===0) {
            //buttonResvervation.style.display = "none";
            canvas.style.display = "none"
        } else if (this.placesDisponibles>0){
            canvas.style.display = "block"
        }
    }
}

var Reservation = {
    //Initialise la reservation
    init: function (station){
        this.station = station;
        reservationEnCours.innerHTML = " Vous avez réservé un vélo à la station " + this.station
        buttonAnnulation.value = "Annuler " + this.station
        canvas.style.display = "none"
        var record = {
            station: this.station,
            tempsExpiration: new Date().getTime() + 20*60*1000,
            signature: dataURL
        }
        localStorage.setItem("reservation", JSON.stringify(record));
        var checkCompteRebours = setInterval(myTimer,500) //
    }
}

var Annulation = {
    //Initialise la reservation
    init: function (station){
        this.station = station;
        reservationEnCours.innerHTML = "Vous avez annulé une réservation à la station " + this.station
        var record = {
            station: this.station,
            tempsExpiration: "annulée"
        }
        localStorage.setItem("reservation", JSON.stringify(record));
        clearInterval(checkCompteRebours)
        console.log("Annulation de la reservation")
    }
}

function myTimer() {
    var storage = localStorage.getItem("reservation")
    var localStorageJSON = JSON.parse(storage)
    var tempsExpiration = localStorageJSON.tempsExpiration
    var minutesRestantes = tempsExpiration-Date.now();
    if (minutesRestantes>0){
        var temps = convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
        console.log(temps)
        compteARebours.innerHTML = "Expiration de la réservation dans " + convertMS(minutesRestantes).m + ":"+ convertMS(minutesRestantes).s;
        buttonResvervation.style.display = "none"
        buttonAnnulation.style.display = "block"
        document.getElementById("introduction").style.display = "none"
    } else if (tempsExpiration === "annulée") {
        compteARebours.innerHTML = "";   
        buttonResvervation.style.display = "block"
        buttonAnnulation.style.display = "none"
        console.log("annulée")
        location.reload()
    } else if (minutesRestantes<0){
        compteARebours.innerHTML = "Votre réservation est expirée ";
        buttonResvervation.style.display = "block"
        buttonAnnulation.style.display = "none"
        canvas.style.display = "block"
        clearInterval(checkCompteRebours)
        console.log("compteàrebours")
        location.reload()
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

window.addEventListener('unload', function() {
        localStorage.clear()
      });
