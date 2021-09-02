const express = require("express");
const app = express();
const bodyParser = require('body-parser'); //npm install body-parser

const https = require('https');

app.use(bodyParser.urlencoded({extended: true})); //code to use everytime you use bodyParser
app.use(express.static(__dirname));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  var city = req.body.city;
  console.log(city);
  //const apiKey = ;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=metric";
  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      if(weatherData.cod == 200){
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const feelsLike = weatherData.main.feels_like;
      const humidity = weatherData.main.humidity;
      const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
      console.log("Temperature: " + temp);
      console.log("Description: " + description);
      res.send(`<!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="description" content="">
              <meta name="author" content="">
              <title>Weather App</title>
              <link rel="stylesheet" type="text/css"  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
              <link rel="stylesheet" type="text/css" href="styles.css" />
              </head>
            <body>
            <div class="jumbotron ">
              <div class="container">
              <h1 class="display-4">The temperature in ${city} is ${temp} °C </h1>
              <h2>Feels like: ${feelsLike} °C</h2>
              <h2>Humidity: ${humidity}</h2>
              <h2>Description: ${description} <img src=${imageURL}></h2>
              <form action="/return" method="post">
              <button class="searchButton" type="submit" name="button"> Return </button>
              </form>
              </div>
              </div>
              </body>
              <div id="footer"> Andrew Pereira &copy; 2021 </div>
              </html>`);
            } //end of if
            else{
              res.send(`<!doctype html>
                  <html lang="en">
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                      <meta name="description" content="">
                      <meta name="author" content="">
                      <title>Weather App</title>
                      <link rel="stylesheet" type="text/css"  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
                      <link rel="stylesheet" type="text/css" href="styles.css" />
                      </head>
                    <body>
                    <div class="jumbotron jumbotron-fluid">
                      <div class="container">
                      <h1> Error! Unable to find information for the city you specified. Please try again</h1>
                      <form action="/return" method="post">
                      <button class="searchButton" type="submit" name="button"> Return </button>
                      </form>
                      </div>
                      </div>
                      </body>
                      <div id="footer"> Andrew Pereira &copy; 2021 </div>
                      </html>`);
            }
    });
})
});


app.post("/return", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running");
})
