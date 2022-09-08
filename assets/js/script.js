//*********************************** OPEN-WEATHER-API-JSCRIPT ************************************//

$(document).ready(function () {
//CITY NAME PLACEHOLDER//
  var cityName = "";

//LAT & LON RETRIEVED FROM 1ST CALL & USED FOR 2ND CALL//
  var lat = "";
  var lon = "";

//FUNCTION USED TO RETRIEVE WEATHER DATA//
  function getWeatherOneAPI(a,b) {
      var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + a + "&lon=" + b + "&exclude=minutely,hourly&appid=aec299195260a001b09706b5bfe740f7&units=imperial";
      
//2ND API CALL TO RETRIEVE 5-DAY FORECAST DATA//
      $.ajax({
          url: queryURL2,
          method: "GET"
      }).then(function (response) {
          console.log(response);

//EMPTIES CARD-DECK BEFORE FOR CITY-CHANGE//
          $(".card-deck").empty();

//RETRIEVES WEATHER ICONS & APPENDS THEM//
          var icon = response.current.weather[0].icon;
          var iconImg = $("<img>");
          iconImg.addClass("img-fluid");
          iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
          $("#city").append(iconImg);

//ARGUEMENT TO CHANGE UV-INDEX BACKGROUND COLOR UPON UPDATE//
          var uvi = parseInt(response.current.uvi);
          if (uvi <= 2) {
              $(".color").css({ "background-color": "green", "color": "white" });
          } else if (uvi >= 3 && uvi <= 5) {
              $(".color").css({ "background-color": "yellow", "color": "black" });
          } else if (uvi >= 6 && uvi <= 7) {
              $(".color").css({ "background-color": "orange" });
          } else if (uvi >= 8 && uvi <= 10) {
              $(".color").css({ "background-color": "red", "color": "white" });
          } else if (uvi >= 11) {
              $(".color").css({ "background-color": "violet", "color": "white" });
          }

//POPULATES CURRENT WEATHER DATA BASED ON HTML IDs//
          $("#temp").text("Temperature: " + response.current.temp + "° F");
          $("#humidity").text("Humidity: " + response.current.humidity + "%");
          $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
          $(".color").text(response.current.uvi);

//DISPLAYS HTML FOR USERS//
          $("#current").css({"display":"block"});

//ARRAY VAR FOR DAILY WEATHER DATA//
          var daily = response.daily;

//LOOP FOR DAILY WEATHER DATA/VARS//
          for (i = 1; i < daily.length - 2; i++) {

//SAVES RESPONSES IN VARIABLES//
              var dailyDate = moment.unix(daily[i].dt).format("dddd MM/DD/YYYY");
              var dailyTemp = daily[i].temp.day;
              var dailyHum = daily[i].humidity;
              var dailyIcon = daily[i].weather[0].icon;

//CREATES DYNAMIC ELEMENTS//
              var dailyDiv = $("<div class='card text-white bg-primary p-2'>")
              var pTemp = $("<p>");
              var pHum = $("<p>");
              var imgIcon = $("<img>");
              var hDate = $("<h6>");

//ADDS TEXTS & ATTRIBUTES TO DYNAMIC ELEMENTS//
              hDate.text(dailyDate);
              imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
              imgIcon.addClass("img-fluid");
              imgIcon.css({"width": "100%"});
              pTemp.text("Temp: " + dailyTemp + "° F");
              pHum.text("Humidity: " + dailyHum + "%");

//APPENDS DYNAMIC ELEMENTS TO HTML//
              dailyDiv.append(hDate);
              dailyDiv.append(imgIcon);
              dailyDiv.append(pTemp);
              dailyDiv.append(pHum);
              $(".card-deck").append(dailyDiv);

//DISPLAYS 5-DAY FORCASR FOR USER//
              $("#five-day").css({"display":"block"});
          }

      })
  }

//FUNCTION FOR API QUERY CALL BASED ON USER'S INPUT//
  function getWeather() {

      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&lang=en&appid=b5446c10c2ed7297baa52e28192fd696";

//1ST API CALL TO RETRIEVE LATs & LONs FOR 2ND API CALL//
      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(function (response) {
          
//STORES LATS & LONS//
          lat = response.coord.lat;
          lon = response.coord.lon;

//ADDS THE CITY NAME & DATE FOR CURRENT WEATHER//
          $("#city").text(response.name);
          $("#date").text(moment.unix(response.dt).format("dddd, MM/DD/YYYY"));
                      
//SAVES THE CITY NAME IN LOCAL-STORAGE//
          localStorage.setItem("cityname", response.name);
          
//PASSING THE COORDINATES FOR THE NEXT FUNC//
          getWeatherOneAPI(lat,lon);

      })
  }

//FUNC TO DISPLAY LAST QUERIED CITY'S DATA//
  function init(){
      cityName = localStorage.getItem("cityname");
      if (cityName !== null) {

          var cityList = $("<button>");
          cityList.addClass("list-group-item list-group-item-action");
          cityList.text(cityName);
          $("ul").prepend(cityList);
          getWeather()
      }
  }

  function searchButton() {
      cityName = $("input").val().trim();

//CREATES BUTTONS BASED ON USER'S INPUTS//
      var cityList = $("<button>");
      cityList.addClass("list-group-item list-group-item-action");
      cityList.text(cityName);

//BUTTONS POPLUATED ON SIDE-BAR//
      $("ul").prepend(cityList);

//AFTER THE LAST USER THE INPUT IS EMPTIED//
      $("input").val("");

      getWeather();
  }

  init();

  //SUBMIT INPUT DURING USER'S CITY SEARCH//
  $("#city-search").submit(function (event) {
      event.preventDefault();
      searchButton();
  })

  $("#form-submit").click(function (event) {
      event.preventDefault();
      searchButton();
  })

  //EVENT-LISTENER FOR STORED CITY BUTTONS//
  $("ul").on("click", "button", function () {
      cityName = $(this).text();
      console.log(cityName);

      getWeather();
  })

 //ADDRESSING ERRORS
  $( document ).ajaxError(function() {
      var error = $("<p>");
      error.addClass("error");
      error.css({"color": "red"});
      error.text("Please try again with a valid city");
      //prepends the error message below the text field
      $("ul").prepend(error);
      //find the button just created with the incorrect city name
      var p = $(this).find("button");
      //removes the button with the incorrect name
      p[1].remove();
      //error message goes away after 2 seconds
      setTimeout(function () {
          error.remove();
          }, 2000);
    });

})