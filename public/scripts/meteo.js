$(document).one('click', '#location-button', function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position)

            var apiKey = 'b803f67e7e126192dd4d5536337b2462'
            var baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            var params = {
                url: baseUrl + '?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey + '&units=metric',
                method: 'GET'
            };



            $.ajax(params).done(function (res) {
                console.log(res)

                var city = res.name
                var temp = Math.round(res.main.temp)
                var tempMax = Math.round(res.main.temp_max)
                var image = res.weather[0].icon;

                jQuery('#weather').append('<h3>Chez vous</h3><br><h4>' + city + '</h4>' + '<img src="http://openweathermap.org/img/w/' + image + '.png"></strong><br><strong>Température: </strong>' + temp + '°C<br><strong>Maximum de la journée: </strong>' + tempMax + '°C</p>');
                console.log(counter)
            })
                .fail(function () {
                    console.log('erreur')
                })

        });

    } else {
        console.log("Erreur lors de la récupération de la")
    }

    var callBackGetSuccess = function (data) {
        var city = data.name
        var temp = Math.round(data.main.temp)
        var tempMax = Math.round(data.main.temp_max)
        var image = data.weather[0].icon;
        jQuery('#weather2').append('<h4>' + city + '</h4>' + '<img src="http://openweathermap.org/img/w/' + image + '.png"></strong><br><strong>Température: </strong>' + temp + '°C<br><strong>Maximum de la journée: </strong>' + tempMax + '°C</p>');
    }

    var url = "https://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=b803f67e7e126192dd4d5536337b2462&units=metric"
    var url1 = "https://api.openweathermap.org/data/2.5/weather?q=Marseille,fr&appid=b803f67e7e126192dd4d5536337b2462&units=metric"
    var url2 = "https://api.openweathermap.org/data/2.5/weather?q=Lyon,fr&appid=b803f67e7e126192dd4d5536337b2462&units=metric"
    var url3 = "https://api.openweathermap.org/data/2.5/weather?q=Lille,fr&appid=b803f67e7e126192dd4d5536337b2462&units=metric"
    var url4 = "https://api.openweathermap.org/data/2.5/weather?q=Montpellier,fr&appid=b803f67e7e126192dd4d5536337b2462&units=metric"

    $.get(url, callBackGetSuccess).done(function () {
        //alert( "second success" );
    })
        .fail(function () {
            alert("error");
        });
        
    $.get(url1, callBackGetSuccess).done(function () {
        //alert( "second success" );
    })
        .fail(function () {
            alert("error");
        });
        
    $.get(url2, callBackGetSuccess).done(function () {
        //alert( "second success" );
    })
        .fail(function () {
            alert("error");
        });
        
    $.get(url3, callBackGetSuccess).done(function () {
        //alert( "second success" );
    })
        .fail(function () {
            alert("error");
        });
        
    $.get(url4, callBackGetSuccess).done(function () {
        //alert( "second success" );
    })
        .fail(function () {
            alert("error");
        });
})
