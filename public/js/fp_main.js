var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var sampleRoute = [{stationName: "Lorimer St", latitude: 40.714067, longitude: -73.950275},
  {stationName: "Graham Av", latitude: 40.714588, longitude: -73.944031}, 
  {stationName: "Grand St", latitude: 40.711904, longitude: -73.940641}, 
  {stationName: "Montrose Av", latitude: 40.707732, longitude: -73.939868}, 
  {stationName: "Morgan Av", latitude: 40.706138, longitude: -73.933152}, 
  {stationName: "Jefferson St", latitude: 40.706609, longitude: -73.922959}, 
  {stationName: "DeKalb Av", latitude: 40.703828, longitude: -73.918378}, 
  {stationName: "Myrtle-Wyckoff Avs", latitude: 40.699826, longitude: -73.911608}, 
  {stationName: "Halsey St", latitude: 40.695572, longitude: -73.904120}, 
  {stationName: "Wilson Av", latitude: 40.688763, longitude: -73.904012}, 
  {stationName: "Bushwick Av - Aberdeen St", latitude: 40.682808, longitude: -73.905257}, 
  {stationName: "Broadway Jct", latitude: 40.678862, longitude: -73.903272}];
var finalList = [];

function initialize () {
	var mapProp = {
		center : new google.maps.LatLng(40.739888, -73.990075),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	// directionsDisplay = new google.maps.DirectionsRenderer();
	// directionsDisplay.setMap(map);
	// directionsDisplay.setPanel(document.getElementById('directions-panel'));
	// var control = document.getElementById('control');
	// control.style.display = 'block';
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}

function topTen(result) {
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: "bakery"
        });
        var olElement = document.getElementById("searchResultList");
        var liElement=document.createElement("li");
        liElement.innerHTML=place.name + " | " + place.formatted_address;
        olElement.appendChild(liElement);
      }
    }
  }

  var map = new google.maps.Map(document.getElementById("googleMap"), {center: new google.maps.LatLng(40.659700, -73.942594), zoom: 13});
  var service = new google.maps.places.PlacesService(map);
  // This is where the for loop of coordinates would go.
  // for (var j=0; j < sampleRoute.length; j++) {
  //   var request = {
  //     location: new google.maps.LatLng(sampleRoute[j].latitude, sampleRoute[j].longitude),
  //     radius: 500,
  //     query: document.getElementById('search_term').value
  //   };
  //   var stationResultSet = service.textSearch(request, callback);
  //   console.log("stationResultSet: " + stationResultSet);
  //   for (var k=0; k<stationResultSet.length; k++) {
  //     var place = stationResultSet[k];
  //     var placeCoord = new google.maps.LatLng(place.latitude, place.longitude);
  //     place.distance = google.maps.geometry.spherical.computeDistanceBetween(request.location,placeCoord);
  //     finalList.push(place);
  //   }
  // }

  var request = {
    location: map.center,
    radius: 500,
    query: document.getElementById('search_term').value
  };  
  service.textSearch(request, callback);
  // finalList.sort(function (a, b) {
  //   if (a.distance > b.distance) {
  //     return 1;
  //   }
  //   if (a.distance < b.distance) {
  //     return -1;
  //   }
  //   // a must be equal to b
  //   return 0;
  // });
  // console.log("finalList: " + finalList);
}


function calcRoute() {
    var start = document.getElementById('address_origin').value;
    var end = document.getElementById('address_destination').value;
    var request = {
    	origin: start,
    	destination: end,
    	travelMode: google.maps.TravelMode.TRANSIT
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
      	// console.log("Response: " + response);
        // directionsDisplay.setDirections(response);
        topTen(response);
      }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
