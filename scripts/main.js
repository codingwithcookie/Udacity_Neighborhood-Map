var map;

var trailheads = [];

function generateMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(48.0784396,-121.5692511),
    disableDefaultUI: true});   

    locations.forEach(function(location) {
    var data = GetWeatherData(location.Lat, location.Long);
    var marker = new google.maps.Marker({
            position: {lat: location.Lat, lng: location.Long},
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.name
        });

        var infoWindow = new google.maps.InfoWindow({
                content: location.name + ' ' + data.temp + ' °C'
            });
            marker.addListener('click', function() {
                toggleBounce(marker);
                infoWindow.open(map, marker);
            });

        var trailhead = {
            name: location.name, 
            lat: location.Lat, 
            long: location.Long,
            temp: data.temp + ' °C',
            description: data.description,
            marker: marker
        };


        trailheads.push(trailhead);
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

// var viewModel = {
//     trailheads: ko.observableArray(trailheads),
//     filter: ko.observable('')
// };

// var stringStartsWith = function (string, startsWith) {          
//     string = string || "";
//     if (startsWith.length > string.length)
//         return false;
//     return string.substring(0, startsWith.length) === startsWith;
// };

// viewModel.filteredItems = ko.dependentObservable(function() {
//     var filter = this.filter().toLowerCase();
//     if (!filter) {
//         this.trailheads().forEach(function(element) {
//             element.marker.visible = true;
//         }, this);
//         return this.trailheads();
//     } else {
//         return ko.utils.arrayFilter(this.trailheads(), function(trailhead) {
//             var include = stringStartsWith(trailhead.name.toLowerCase(), filter);
//             if (include)
//             {
//                 trailhead.marker.visible=true;
//             }
//             else
//             {
//                 trailhead.marker.visible =false;
//             }
//             return include;
//         });
//     }
// }, viewModel);

// ko.applyBindings(viewModel);

function generateMapError() {
    console.log('Failure in loading Goggle Map.');
    alert('Failure in loading Goggle Map.');
}
