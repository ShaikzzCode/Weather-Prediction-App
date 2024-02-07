      // https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Anantapur?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json
      // calling temparature on load
      searchWeather();



      var celBtn = document.getElementById("cen_btn");
      var farBtn = document.getElementById("far_btn");

      // adding the search city on enter
      var myInput = document.getElementById("cityInput");
      myInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchWeather();
        }
    });


      function searchWeather() {
        const city = document.getElementById("cityInput").value;
        fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`
        )
        // fetch('./data.json') //this is dummy data
          .then((response) => response.json())
          .then((data) => {
            const city = data.address;
            const temparatureToday = data.days[0].temp;
            const address = data.resolvedAddress;
            const days = data.days;
            const hours = data.days[0].hours;
            const weatherData = data.days[0];
            const condition = weatherData.hours[0].icon;

            document.getElementById("right_tab_btns_holder").style.display =
              "flex";
            document.getElementById("left_sec_condition").innerHTML =
              weatherData.conditions;
            document.getElementById("left_sec_precip").innerHTML =
              "Prec - " + weatherData.precip + "%";

            // Today's Weather Cards
            let hourlyData = document.getElementById("weather_holder_today");
            hourlyData.innerHTML = "";
            hours.forEach((hour) => {
              const time = hour.datetime;
              const temp = hour.temp;
              const icon = hour.icon;
              hourlyData.innerHTML += `
                <div class="small_weather_card">
                  <h2>${time}</h2>
                  <img src="${getWeatherIconUrl(icon)}" alt="weather_card">
                  <p class="temp_value">${temp}°C</p>
                </div>`;
            });

            // Today's Weather Cards
            let weeklyData = document.getElementById("weather_holder_week");
            weeklyData.innerHTML = "";
            days.forEach((day) => {
              const time = day.datetime;
              const temp = day.temp;
              const icon = day.icon;
              weeklyData.innerHTML += `
                <div class="small_weather_card">
                  <h2>${time}</h2>
                  <img src="${getWeatherIconUrl(icon)}" alt="weather_card">
                  <p class="temp_value">${temp}°C</p>
                </div>`;
            });

            const currentImage = data.currentConditions.icon;
            const currentTEmp = data.currentConditions.temp;

            document.getElementById(
              "addressCard"
            ).innerText = `${data.resolvedAddress}`;

            document.getElementById("weatherIcon_main").src =
              getWeatherIconUrl(currentImage);
            document.getElementById("left_temparature").innerHTML =
              currentTEmp + "°C";

            // Calling the function of Today's Highlights
            showTodayHighlights(weatherData);

            var currentTime = getCurrentTime();
            document.getElementById("left_currentTime").innerHTML = currentTime;

            document.getElementById("temp_btns_holder").style.display =
              "inline-block";
            document.getElementById("no_data").style.display = "none";

            var celBtn = document.getElementById("cen_btn");
            celBtn.classList.add("active");

            showToday();

            // diasabling the farBtn
            farBtn.classList.remove("active");
            farBtn.disabled = false;
            celBtn.disabled = true;

            // END
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
            document.getElementById("no_data").style.display = "inline-block";
            document.getElementById("no_data").textContent = error;
          });
      }

      function getWeatherIconUrl(condition) {
        let bgImage = document.querySelector("#bgImg");
        switch (condition) {
          case "partly-cloudy-day":
            bgImage.src = "./assets/bg_images/partly-cloudy-day.webp";
            return "./assets/card_images/w_img1.png";
          case "partly-cloudy-night":
            bgImage.src = "./assets/bg_images/partly-cloudy-night.jpg";
            return "./assets/card_images/w_img2.png";
          case "rain":
            bgImage.src = "./assets/bg_images/rain.webp";
            return "./assets/card_images/w_img3.png";
          case "clear-day":
            bgImage.src = "./assets/bg_images/clear-day.jpg";
            return "./assets/card_images/w_img4.png";
          case "clear-night":
            bgImage.src = "./assets/bg_images/clear-night.jpg";
            return "./assets/card_images/w_img5.png";
          default:
            bgImage.src = "./assets/bg_images/partly-cloudy-day.webp";
            return "./assets/card_images/w_img1.png";
        }
      }

      function showTodayHighlights(weatherData) {
        //UV Index
        document.getElementById(
          "uvIndexCard"
        ).innerText = `${weatherData.uvindex}`;
        let uvIndexValue = weatherData.uvindex;
        if (uvIndexValue === 1 || uvIndexValue === 2) {
          document.getElementById("uvIndexCard_data").innerHTML = "Low";
        } else if (uvIndexValue >= 3 && uvIndexValue <= 5) {
          document.getElementById("uvIndexCard_data").innerHTML = "Moderate";
        } else if (uvIndexValue >= 6 && uvIndexValue <= 7) {
          document.getElementById("uvIndexCard_data").innerHTML = "High";
        } else if (uvIndexValue >= 8 && uvIndexValue <= 10) {
          document.getElementById("uvIndexCard_data").innerHTML = "Very High";
        } else if (uvIndexValue >= 11) {
          document.getElementById("uvIndexCard_data").innerHTML = "Extreme";
        } else {
          document.getElementById("uvIndexCard_data").innerHTML = "Unknown";
        }

        //Weather Status
        document.getElementById(
          "windStatusCard"
        ).innerText = `${weatherData.windspeed}`;

        //Sunrise and Sunset
        document.getElementById(
          "sunriseSunsetCard"
        ).innerText = `${weatherData.sunrise}`;
        document.getElementById(
          "sunsetCard_data"
        ).innerText = `${weatherData.sunset}`;

        //Humidity card
        document.getElementById(
          "humidityCard"
        ).innerText = `${weatherData.humidity}`;

        let humidityCardValue = weatherData.humidity;
        if (humidityCardValue >= 93.8 && humidityCardValue <= 96.9) {
          document.getElementById("humidityCard_data").innerHTML = "Good";
        } else if (humidityCardValue >= 82.2 && humidityCardValue <= 87.9) {
          document.getElementById("humidityCard_data").innerHTML = "Tolerable";
        } else if (humidityCardValue >= 70.3 && humidityCardValue <= 81.7) {
          document.getElementById("humidityCard_data").innerHTML = "Better";
        } else if (humidityCardValue >= 1 && humidityCardValue <= 69.6) {
          document.getElementById("humidityCard_data").innerHTML = "Worst";
        } else {
          document.getElementById("humidityCard_data").innerHTML = "Unknown";
        }

        //Visibility Card
        document.getElementById(
          "visibilityCard"
        ).innerText = `${weatherData.visibility}`;

        let visibilityCardValue = weatherData.visibility;
        if (visibilityCardValue === 0.03) {
          document.getElementById("visibilityCard_data").innerHTML = "Good";
        } else if (visibilityCardValue === 0.16) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Moderate Fog";
        } else if (visibilityCardValue === 0.35) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Light Fog";
        } else if (visibilityCardValue >= 0.54 && visibilityCardValue <= 1.03) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Very Light Fog";
        } else if (visibilityCardValue >= 1.08 && visibilityCardValue <= 2.15) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Light Mist";
        } else if (visibilityCardValue >= 2.16 && visibilityCardValue <= 5.3) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Very Light Mist";
        } else if (visibilityCardValue >= 5.4 && visibilityCardValue <= 10.7) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Clear Air";
        } else if (visibilityCardValue >= 10.8 && visibilityCardValue <= 27.0) {
          document.getElementById("visibilityCard_data").innerHTML =
            "Very Clear Air";
        } else {
          document.getElementById("visibilityCard_data").innerHTML = "Unknown";
        }

        //Air Quality Card
        document.getElementById(
          "airQualityCard"
        ).innerText = `${weatherData.feelslike}`;
      }
      function getCurrentTime() {
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        var now = new Date();
        var dayOfWeek = days[now.getDay()];
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var timeString = dayOfWeek + ", " + hours + ":" + minutes + " " + ampm;
        return timeString;
      }

      function showToday() {
        document.getElementById("weather_holder_today").style.display = "flex";
        document.getElementById("weather_holder_week").style.display = "none";

        document.getElementById("btn_today").classList.add("activeTab");
        document.getElementById("btn_week").classList.remove("activeTab");
      }

      function showWeek() {
        document.getElementById("weather_holder_week").style.display = "flex";
        document.getElementById("weather_holder_today").style.display = "none";

        document.getElementById("btn_week").classList.add("activeTab");
        document.getElementById("btn_today").classList.remove("activeTab");
      }

      celBtn.onclick = () => {
        // Convert Fahrenheit to Celsius for all temperature cards
        var currentTempF = parseFloat(
          document.getElementById("left_temparature").innerText
        );
        var currentTempC = ((currentTempF - 32) * 5) / 9;

        // Update temperature display to Celsius
        document.getElementById("left_temparature").innerText =
          currentTempC.toFixed(1) + "°C";

        var tempElements = document.getElementsByClassName("temp_value");
        for (var i = 0; i < tempElements.length; i++) {
          var currentTempF = parseFloat(tempElements[i].innerText);
          var currentTempC = ((currentTempF - 32) * 5) / 9;
          tempElements[i].innerText = currentTempC.toFixed(1) + "°C";
        }

        // Update button styles
        farBtn.classList.remove("active");
        celBtn.classList.add("active");
        celBtn.disabled = true;
        farBtn.disabled = false;
      };

      farBtn.onclick = () => {
        // Convert Celsius to Fahrenheit for all temperature cards
        var currentTempC = parseFloat(
          document.getElementById("left_temparature").innerText
        );
        var currentTempF = (currentTempC * 9) / 5 + 32;

        // Update temperature display to Fahrenheit
        document.getElementById("left_temparature").innerText =
          currentTempF.toFixed(1) + "°F";

        var tempElements = document.getElementsByClassName("temp_value");
        for (var i = 0; i < tempElements.length; i++) {
          var currentTempC = parseFloat(tempElements[i].innerText);
          var currentTempF = (currentTempC * 9) / 5 + 32;
          tempElements[i].innerText = currentTempF.toFixed(1) + "°F";
        }

        // Update button styles
        celBtn.classList.remove("active");
        farBtn.classList.add("active");
        celBtn.disabled = false;
        farBtn.disabled = true;
      };