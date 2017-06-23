//Using OpenWeatherMap API: https://openweathermap.org/
function GetWeatherData(lat, long)
{
    var result = {temp: 0,
    description: ''};
    return $.get( "http://api.openweathermap.org/data/2.5/weather?lat=" + encodeURIComponent(lat) + 
                "&lon="+ encodeURIComponent(long) +"&units=metric&appid=5dff28ed35d569235c2b02c4fa76cdc9")
                .done(function(data){
                    result.temp = data.main.temp;
                    result.description = data.weather[0].description;
                    return result;
                })
   .fail(function(){
        console.log('Error retriving weather data.');
        alert('Unable to retrive weather data. Please try again.');
    });    
}