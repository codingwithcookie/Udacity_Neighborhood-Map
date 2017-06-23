var map;

var trailheads = [];

var viewModel = {
    trailheads: ko.observableArray(),
    filter: ko.observable(''),
    openMarker: function(trailhead) 
    {
        google.maps.event.trigger(trailhead.marker, 'click');
    }
};

function generateMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(48.0784396,-121.5692511),
    disableDefaultUI: true});   

    locations.forEach(function(location) {
    GetWeatherData(location.Lat, location.Long).done(function(data) {
        var temp =data.main.temp;
        var description = data.weather[0].description;
        var marker = new google.maps.Marker({
            position: {lat: location.Lat, lng: location.Long},
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.name
        });

        var infoWindow = new google.maps.InfoWindow({
                content: location.name + ' ' + temp + ' °C'
            });
            marker.addListener('click', function() {
                toggleBounce(marker);
                infoWindow.open(map, marker);
            });

        var trailhead = {
            name: location.name, 
            lat: location.Lat, 
            long: location.Long,
            temp: temp + ' °C',
            description: description,
            marker: marker
        };

        viewModel.trailheads.push(trailhead);
    });
    }, this);

    var stringStartsWith = function (string, startsWith) {          
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    viewModel.filteredItems = ko.dependentObservable(function() {
        var filter = this.filter().toLowerCase();
        if (!filter) {
            this.trailheads().forEach(function(element) {
                element.marker.setVisible(true);
            }, this);
            return this.trailheads();
        } else {
            return ko.utils.arrayFilter(this.trailheads(), function(trailhead) {
                var include = stringStartsWith(trailhead.name.toLowerCase(), filter);
                if (include)
                {
                    trailhead.marker.setVisible(true);
                }
                else
                {
                    trailhead.marker.setVisible(false);
                }
                return include;
            });
        }
    }, viewModel);

    ko.applyBindings(viewModel);
}

function toggleBounce(marker) {
    marker.setAnimation(null);

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 1500);
    }
};

function generateMapError() {
    console.log('Failure in loading Goggle Map.');
    alert('Failure in loading Goggle Map.');
}
