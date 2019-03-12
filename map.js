//Chargement de la map//

var lat = 41.9263991;
var lon = 8.7376029;
var map = null;
function initMap() {
    map = new google.maps.Map(document.getElementById("map-container"), {
        center: new google.maps.LatLng(lat, lon), 
        zoom: 11, 
        mapTypeId: google.maps.MapTypeId.ROADMAP, 
        mapTypeControl: true,
        scrollwheel: false, 
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR 
        },
        navigationControl: true, 
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.ZOOM_PAN 
        }
    });
}
window.onload = function(){
    initMap(); 
};

//Ajout des marqueurs
var xhr = new XMLHttpRequest(), monResultat; 
xhr.open('GET', "https://opendata-corse.edf.fr/api/records/1.0/search/?dataset=parc-des-installations-de-production&facet=territoire&facet=producteur&facet=filiere&refine.territoire=Corse"); 
xhr.onreadystatechange = function(){ 
    if(xhr.readyState == 4 && xhr.status == 200){ 
      monResultat = xhr.responseText; 
      var objJson = JSON.parse(monResultat);
      var nombreRecords = objJson.records.length;
      
      for(i = 0; i < nombreRecords; i++){
          var lng = objJson.records[i].geometry.coordinates[0];
          var lat = objJson.records[i].geometry.coordinates[1];
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map, 
        });
        if(objJson.records[i].fields.groupe == null){
          objJson.records[i].fields.groupe = "Non défini"
        }
        infoWindowOptions = '<h2>' + objJson.records[i].fields.site + '</h2>' +
        '<h4> Groupe : ' + objJson.records[i].fields.groupe + '</h4>' +
        '<h4> Puissance : ' + objJson.records[i].fields.puissance_mw + ' MW</h4>' +
        '<h4> Filière : ' + objJson.records[i].fields.filiere + '</h4>' +
        '<h4> Année de mise en service : ' + objJson.records[i].fields.date_de_mise_en_service + '</h4>';
        ajoutDonnees();
              
      } 
  }; 
}
xhr.send('variable=valeur'); 


function ajoutDonnees(){
  
  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowOptions
  });
  
  google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, this);
  });
}