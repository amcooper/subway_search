var setLiToRoute = function(li, route) {
	li.setAttribute('id', 'route' + route.id);
	li.innerHTML = "";

	var routeText = route.nickname + ": from " + route.route_origin + " to " + route.route_destination;
	var routeTextNode = document.createTextNode(routeText);
	li.appendChild(routeTextNode);

	var edit = document.createElement('button');
	edit.innerHTML = "Edit";
	edit.addEventListener('click', function() {
		editRoute(li, route.nickname, route.route_origin, route.route_destination); 
	});
	li.appendChild(edit);

	var deleteButton = document.createElement('button');
	deleteButton.innerHTML = "Delete";
	deleteButton.addEventListener('click', deleteRoute); 
	li.appendChild(deleteButton);
};

var editRoute = function(li, nickname, route_origin, route_destination) {
	li.innerHTML = '';
	var id = li.id.substring(5);

	//route nickname input textbox
	var nicknameField = document.createElement('input');
	nicknameField.setAttribute('type', 'text');
	nicknameField.value = nickname;
	li.appendChild(nicknameField);

	//filler text
	// var isA = document.createTextNode(': ');
	// li.appendChild(isA);

	//route origin input textbox
	var originField = document.createElement('input');
	originField.setAttribute('type', 'text');
	originField.value = route_origin;
	li.appendChild(originField);

	//route destination input textbox
	var destinationField = document.createElement('input');
	destinationField.setAttribute('type', 'text');
	destinationField.value = route_destination;
	li.appendChild(destinationField);

	var updateButton = document.createElement('button');
	updateButton.innerHTML = 'Update';
	updateButton.addEventListener('click', function() {
		var newNickname = nicknameField.value;
		var newOrigin = originField.value;
		var newDestination = destinationField.value;
		updateRoute(li, newNickname, newOrigin, newDestination); 
	});
	li.appendChild(updateButton);
};

var updateRoute = function(li, newNickname, newOrigin, newDestination) {
	var id = li.id.substring(5);
	var xhr = new XMLHttpRequest();
	xhr.open('PUT', 'http://localhost:3000/route/' + id);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.addEventListener('load', function() {
		var returnedRoute = JSON.parse(xhr.responseText);
		setLiToRoute(li, returnedRoute); 
	});

	var updatedRoute = { nickname: newNickname, route_origin: newOrigin, route_destination: newDestination };
	xhr.send(JSON.stringify(updatedRoute));
};

var addRoute = function(route) {
	var li = document.createElement('li');
	setLiToRoute(li, route); 
	var ul = document.getElementById('routesList');
	ul.appendChild(li);
};

var addAllRoutes = function() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:3000/routes');
	xhr.addEventListener('load', function() {
		var routes = JSON.parse(xhr.responseText);
		routes.forEach(function(route) {
			addRoute(route); 
		});
	});

	xhr.send();
};

var addNewRouteButton = document.getElementById('addNewRoute');
addNewRouteButton.addEventListener('click', function() {
	var newNickname = document.getElementById('newRouteNickname');
	var newOrigin = document.getElementById('newRouteOrigin');
	var newDestination = document.getElementById('newRouteDestination');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:3000/route');
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.addEventListener('load', function() {
		var returnedRoute = JSON.parse(xhr.responseText);
		addRoute(returnedRoute); 
		newNickname.value = '';
		newOrigin.value = '';
		newDestination.value = '';
	});

	var newRoute = { nickname: newNickname.value, route_origin: newOrigin.value, route_destination: newDestination.value };
	xhr.send(JSON.stringify(newRoute));
});

var deleteRoute = function() {
	var li = this.parentNode;
	var id = li.id.substring(3);
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', 'http://localhost:3000/route/' + id);
	xhr.addEventListener('load', function() {
		if(JSON.parse(xhr.responseText)['deleted'] === true) {
			li.remove();
		}
	});

	xhr.send();
};

addAllRoutes(); 