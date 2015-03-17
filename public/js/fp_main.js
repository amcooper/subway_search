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
var bigArray = [];
var request;
var map;

function initialize () {
  console.log("function: initialize"); //debug
	var mapProp = {
		center : new google.maps.LatLng(40.739888, -73.990075),
		zoom : 11,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("dummyMap"), mapProp);
  console.log("function: initialize: end");
}

function calcRoute() {
    var start = document.getElementById('address_origin').value;
    var end = document.getElementById('address_destination').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    // directionsService.route(request, function(response, status) {
    //   if (status == google.maps.DirectionsStatus.OK) {
    //     // console.log("Response: " + response);
    //     // directionsDisplay.setDirections(response);
    //     topTen(response);
    //   }
    // });
}

function compileAll() {
  console.log("compileAll starts."); //debug
// Sort big array by quotient
  function bigSort() {
    console.log("bigSort starts."); //debug

    function fullDisplay() {
      console.log("fullDisplay starts.");
      for (var m=0; m<20; m++) {
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(bigArray[m].geometry.location.k, bigArray[m].geometry.location.D),
              map: map,
              title: request.query
          });
          var olElement=document.getElementById("searchResultList");
          var liElement=document.createElement("li");
          liElement.innerHTML="<span style='font-size:12pt;font-family:serif'>" + bigArray[m].name + "</span><br>" + "<span style='font-size:10pt;font-family:serif'>" + bigArray[m].formatted_address + "</span>";
          olElement.appendChild(liElement);
      }

      console.log("all done.");
    }

    function compare(a,b) {
      if (a.myRank < b.myRank)
         return -1;
      if (a.myRank > b.myRank)
        return 1;
      return 0;
    }

    bigArray.sort(compare);

    console.log("Length: " + bigArray.length); //debug
    if (bigArray.length>20) { 
      bigArray.slice(0,19); 
      console.log("Array sliced"); //debug
    }

    fullDisplay();

  }

  function callback(results, status) {
    console.log("function callback starts."); //debug
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var ii = 0; ii < results.length; ii++) {
        // console.log("results[ii]: " + JSON.stringify(results[ii])); //debug
        if (results[ii].rating > 0) {
          var place = results[ii].geometry.location;
          results[ii].distance = google.maps.geometry.spherical.computeDistanceBetween(request.location,place);
          // console.log("distance: " + results[ii].distance); //debug
          results[ii].myRank = parseFloat(results[ii].distance)/parseFloat(results[ii].rating);
          bigArray.push(results[ii]);
        }
      }
    }
  }


  for (var j=0; j<sampleRoute.length; j++) {

    console.log("Outer loop j: " + j.toString()); //debug
    var dummyMap = new google.maps.Map(document.getElementById("dummyMap"),
      {
        center : new google.maps.LatLng(40.739888, -73.990075),
        zoom : 11,
        mapTypeId : google.maps.MapTypeId.ROADMAP
      }
    );
    var service = new google.maps.places.PlacesService(dummyMap);
    request = {
      query : document.getElementById('search_term').value,
      location : new google.maps.LatLng(sampleRoute[j].latitude, sampleRoute[j].longitude),
      radius : 500
    };
    // console.log("request: " + JSON.stringify(request)); //debug
    service.textSearch(request, callback);
  }

  bigSort();
}

google.maps.event.addDomListener(window, 'load', initialize);
