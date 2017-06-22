var map;

function generateMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(48.0784396,-121.5692511),
    disableDefaultUI: true});  
    locations.forEach(function(element) {
        var marker = new google.maps.Marker({
            position: {lat: element.Lat, lng: element.Long},
            map: map,
            animation: google.maps.Animation.DROP,
            title: element.name
        });
        var infoWindow = new google.maps.InfoWindow({
            content: element.name
        });
        marker.addListener('click', function() {
            toggleBounce(marker);
            infoWindow.open(map, marker);
        });
    }, this);    
}

function toggleBounce(marker) {
    marker.setAnimation(null);

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 1500);
    }
}

var trailheads = [];
locations.forEach(function(location) {
    var data = GetWeatherData(location.Lat, location.Long);
    trailheads.push({
        name: location.name, 
        lat: location.Lat, 
        long: location.Long,
        temp: data.temp + ' °C',
        description: data.description
    })
}, this);

var viewModel = {
    trailheads: ko.observableArray(trailheads),
    filter: ko.observable('')
};

var stringStartsWith = function (string, startsWith) {          
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

viewModel.filteredItems = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.trailheads();
    } else {
        return ko.utils.arrayFilter(this.trailheads(), function(trailhead) {
            return stringStartsWith(trailhead.name.toLowerCase(), filter);
        });
    }
}, viewModel);

ko.applyBindings(viewModel);

function generateMapError() {
    console.log('Failure in loading Goggle Map.');
}

GetWeatherData(48.0621, -121.8107);
