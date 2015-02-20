var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize () {
	var mapProp = {
		center : new google.maps.LatLng(40.739888, -73.990075),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directions-panel'));
	var control = document.getElementById('control');
	control.style.display = 'block';
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
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
      	console.log(response);
        directionsDisplay.setDirections(response);
      }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
