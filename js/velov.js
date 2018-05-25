$(function(){
    
    $.get({
        type: 'GET',
        url: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8107a525c841e0b25de543e35fd372943e7b9f1f',
    }, function(data){
        var stations = data;
        for ( i=0 ; i<=stations.length ; i++){
            console.log("Nome de la station : " + stations[i].name + ", latitude : " + stations[i].position.lat + ", longitude : " + stations[i].position.lng)
        }
    })
})

// Comment réutiliser stations[i].position dans ligne ???


function initMap(){
            var options = {
                zoom:13,
                center:{lat:45.750000,lng:4.850000}
            }
            
            //nouvelle carte
            var map = new google.maps.Map(document.getElementById('map'),options);
            

            //Add Marker function
            function addMarker(coords){
                var marker = new google.maps.Marker({
                    position:coords,
                    map:map,
                });
            }
            //Ajouter des marqueurs
            for (i=0 ; i<stations.length ; i++){
                addMarker({})
            };
}

