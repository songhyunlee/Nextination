var myButton = document.getElementById('my-button');
myButton.addEventListener('click', function () {
  clear(results);
  getResults();
});

var term = document.getElementById("term")
term.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    clear(results);
    clear(photos);
    getResults();
  }
});

function search(form) {
  var inputs = form.getElementsByTagName('input');
  var search = {};
  search.term = inputs.term.value;
  return search;
}

function show(city) {

  for (var i = 0; i < city.length; i++) {
    var where = document.getElementById('results');
    var info = document.createElement('div');
    var cityName = document.createElement('h2');
    var country = document.createElement('p');
    var localtime = document.createElement('p');
    var description = document.createElement('p');

    info.setAttribute('class', 'col-offset-md-1 col-md-8 info');
    cityName.textContent = city[i].name;
    country.textContent = city[i].country;
    localtime.textContent = "Local Time: " + new Date().toLocaleString('en-US', { timeZone: city[i].time })
    description.textContent = city[i].description;

    var theContainer = document.createElement('div');
    theContainer.setAttribute('class', 'container');

    var theNav = document.createElement('ul');
    theNav.setAttribute('class','nav nav-tabs');

    var basicli = document.createElement('li');
    basicli.setAttribute('class', 'active');
    var basictoggle = document.createElement('a');
    basictoggle.setAttribute('data-toggle', 'tab');
    basictoggle.setAttribute('href', '#home');
    basictoggle.textContent = 'Basic Information';
    basicli.appendChild(basictoggle);

    var photoli = document.createElement('li');
    var phototoggle = document.createElement('a');
    phototoggle.setAttribute('data-toggle', 'tab');
    phototoggle.setAttribute('href', '#menu1');
    phototoggle.textContent = 'Photos';
    photoli.appendChild(phototoggle);

    var weatherli = document.createElement('li');
    var weathertoggle = document.createElement('a');
    weathertoggle.setAttribute('data-toggle', 'tab');
    weathertoggle.setAttribute('href', '#menu2');
    weathertoggle.textContent = 'Weather';
    weatherli.appendChild(weathertoggle);

    var tabContent = document.createElement('div');
    tabContent.setAttribute('class', 'tab-content');

    var home = document.createElement('div');
    home.setAttribute('id', 'home');
    home.setAttribute('class','tab-pane fade in active');
    home.appendChild(info);

    var photomenu = document.createElement('div');
    photomenu.setAttribute('id', 'menu1');
    photomenu.setAttribute('class', 'tab-pane fade');
    photomenu.appendChild(photos);

    var weathermenu = document.createElement('div');
    weathermenu.setAttribute('id', 'menu2');
    weathermenu.setAttribute('class', 'tab-pane fade');
    weathermenu.appendChild(weather);

    info.appendChild(cityName);
    info.appendChild(country);
    info.appendChild(localtime);
    info.appendChild(description);

    theNav.appendChild(basicli);
    theNav.appendChild(photoli);
    theNav.appendChild(weatherli);
    theContainer.appendChild(theNav);
    tabContent.appendChild(home);
    tabContent.appendChild(photomenu);
    tabContent.appendChild(weathermenu);
    theContainer.appendChild(tabContent);
    where.appendChild(theContainer);

  }
  return where
}

function clear(area) {
  while(area.firstChild) {
    area.removeChild(area.firstChild);
  }
}

function getResults() {
  var theForm = document.getElementById('search');
  var details = search(theForm);
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/search/' + details.term);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();

  xhr.addEventListener('load', function() {
    show(JSON.parse(xhr.responseText));
    response.data = JSON.parse(xhr.responseText);
    getPhotos();
    getWeather(details.term, response.data[0].name, response.data[0].country);
  });
}
var response = [];
// console.log(response.data[0].name);


function getWeather(term, name, country) {
  var theForm = document.getElementById('search');
  var details = search(theForm);

  var searchinput = {
    name: name,
    country: country,
  }

  var request = new XMLHttpRequest();
  request.open('POST', '/location/' + term);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(searchinput));

  request.addEventListener('load', function(data) {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.response);
      var locationKey = data[0].Key;
      forecast(locationKey);
    }
  })
}

function forecast(locationKey) {
  clear(weather);
  var xhr = new XMLHttpRequest();
  var input = {
    key: locationKey
  }
  xhr.open('POST', '/weather');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(input));

  xhr.onload = function(){
    if (xhr.status >= 200 && xhr.status < 400) {
      var weatherData = JSON.parse(xhr.response);
      var forecasts = weatherData.DailyForecasts;
      console.log(forecasts);

      var dayOne = forecasts[0].Temperature.Maximum.Value + '°F' + '/ '
      + forecasts[0].Temperature.Minimum.Value + '°F';
      var dayTwo = forecasts[1].Temperature.Maximum.Value + '°F' + '/ '
      + forecasts[1].Temperature.Minimum.Value + '°F';
      var dayThree = forecasts[2].Temperature.Maximum.Value + '°F' + '/ '
      + forecasts[2].Temperature.Minimum.Value + '°F';
      var dayFour = forecasts[3].Temperature.Maximum.Value + '°F' + '/ '
      + forecasts[3].Temperature.Minimum.Value + '°F';
      var dayFive = forecasts[4].Temperature.Maximum.Value + '°F' + '/ '
      + forecasts[4].Temperature.Minimum.Value + '°F';

      //create table elements.
      var theWeather = document.createElement('div');
      var theTable = document.createElement('table');
      theTable.setAttribute('class','table');
      var theHead = document.createElement('thead');
      var theHeaders = document.createElement('tr');
      var theDate = document.createElement('th');
      theDate.textContent = 'Day';
      var theDayPhrase = document.createElement('th');
      theDayPhrase.textContent = 'Description (Day)';
      var theNightPhrase = document.createElement('th');
      theNightPhrase.textContent = 'Description (Night)';
      var theTemp = document.createElement('th');
      theTemp.textContent = 'High/ Low';
      var theBody = document.createElement('tbody');

      var day1 = forecasts[0];
      var items1 = tableData(day1);
      var day2 = forecasts[1];
      var items2 = tableData(day2);
      var day3 = forecasts[2];
      var items3 = tableData(day3);
      var day4 = forecasts[3];
      var items4 = tableData(day4);
      var day5 = forecasts[4];
      var items5 = tableData(day5);

      theTable.appendChild(theHead);
      theHead.appendChild(theDate);
      theHead.appendChild(theTemp);
      theHead.appendChild(theDayPhrase);
      theHead.appendChild(theNightPhrase);
      theTable.appendChild(theBody);
      theBody.appendChild(items1);
      theBody.appendChild(items2);
      theBody.appendChild(items3);
      theBody.appendChild(items4);
      theBody.appendChild(items5);

      theWeather.setAttribute('class','container');
      theWeather.appendChild(theTable);
      weather.appendChild(theWeather);

      return weather;
    }
  }
}

function tableData(dayN) {

    var theInfo = document.createElement('tr');
    var day = document.createElement('td');
    day.textContent = dayN.Date.slice(0,10);
    var dayphrase = document.createElement('td');
    var temp = document.createElement('td');
    temp.textContent = dayN.Temperature.Maximum.Value + '°F' + '/ '
    + dayN.Temperature.Minimum.Value + '°F';
    dayphrase.textContent = dayN.Day.ShortPhrase;
    var nightphrase = document.createElement('td');
    nightphrase.textContent = dayN.Night.ShortPhrase;
    
    theInfo.appendChild(day);
    theInfo.appendChild(temp);
    theInfo.appendChild(dayphrase);
    theInfo.appendChild(nightphrase);

    return theInfo;
}

function getPhotos() {
  clear(photos);
  var theForm = document.getElementById('search');
  var details = search(theForm);

  var searchterms = {
    tag: response.data[0].tags,
    lat: response.data[0].lat,
    lon: response.data[0].lon,
    name: response.data[0].name
  }

  var request = new XMLHttpRequest();
  request.open('POST', '/search/:term');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(searchterms));

  request.addEventListener('load', function() {
    var data = JSON.parse(request.response);
    var thePhoto = data.photos.photo;
    var theCarousel = document.createElement('div');
    theCarousel.setAttribute('class', 'carousel slide');
    theCarousel.setAttribute('data-ride', 'carousel');
    theCarousel.setAttribute('id', 'myCarousel');

    var theList = document.createElement('ol');
    theList.setAttribute('class', 'carousel-indicators');

    var theActive = document.createElement('li');
    theActive.setAttribute('data-target', '#myCarousel');
    theActive.setAttribute('data-slide-to', '0');
    theActive.setAttribute('class', 'item0 active');

    var theItems = [];
    var one = document.createElement('li');
    one.setAttribute('data-target', '#myCarousel');
    one.setAttribute('data-slide-to', '1');
    var two = document.createElement('li');
    two.setAttribute('data-target', '#myCarousel');
    two.setAttribute('data-slide-to', '2');
    var three = document.createElement('li');
    three.setAttribute('data-target', '#myCarousel');
    three.setAttribute('data-slide-to', '3');
    var four = document.createElement('li');
    four.setAttribute('data-target', '#myCarousel');
    four.setAttribute('data-slide-to', '4');

    theItems.push(one, two, three, four);

    var theInner = document.createElement('div');
    theInner.setAttribute('class', 'carousel-inner');
    theInner.setAttribute('role', 'listbox');

    var active = document.createElement('div');
    active.setAttribute('class', 'item active');

    var images = [];
    for (var i = 0; i < thePhoto.length; i++) {
      var image = document.createElement('img');
      image.setAttribute('class','img-responsive');
      var photoId = thePhoto[i].id;
      var owner = thePhoto[i].owner;
      var imgURL = 'http://farm' + thePhoto[i].farm + '.staticflickr.com/' +
      thePhoto[i].server + '/' + thePhoto[i].id + '_' + thePhoto[i].secret + '.jpg';
      image.src = imgURL;
      images.push(image);
    }

    var inactiveItems = [];
    for (var i = 0; i < images.length; i++) {
      if(i === 0) {
        active.appendChild(images[0]);
        theInner.appendChild(active);
      } else {
        var inactive = document.createElement('div');
        inactive.setAttribute('class', 'item');
        inactive.appendChild(images[i]);
        inactiveItems.push(inactive);
      }
    }

    //left and right arrow buttons
    var left = document.createElement('a');
    left.setAttribute('class', 'left carousel-control');
    left.setAttribute('href', '#myCarousel');
    left.setAttribute('role', 'button');
    left.setAttribute('data-slide', 'prev');
    var leftIcon = document.createElement('span');
    leftIcon.setAttribute('class', 'glyphicon glyphicon-chevron-left');
    leftIcon.setAttribute('aria-hidden', 'true');
    var leftLabel = document.createElement('span');
    leftLabel.setAttribute('class','sr-only');
    leftLabel.textContent = 'Previous';
    left.appendChild(leftIcon);
    left.appendChild(leftLabel);

    var right = document.createElement('a');
    right.setAttribute('class', 'right carousel-control');
    right.setAttribute('href', '#myCarousel');
    right.setAttribute('role', 'button');
    right.setAttribute('data-slide', 'next');
    var rightIcon = document.createElement('span');
    rightIcon.setAttribute('class', 'glyphicon glyphicon-chevron-right');
    rightIcon.setAttribute('aria-hidden', 'true');
    var rightLabel = document.createElement('span');
    rightLabel.setAttribute('class','sr-only');
    rightLabel.textContent = 'Next';
    right.appendChild(rightIcon);
    right.appendChild(rightLabel);

    inactiveItems.forEach(function(inactiveItem) {
      theInner.appendChild(inactiveItem)
    });
    theList.appendChild(theActive);
    theItems.forEach(function(theItem) {
      theList.appendChild(theItem)
    });
    theCarousel.appendChild(theList);
    theCarousel.appendChild(theInner);
    theCarousel.appendChild(left);
    theCarousel.appendChild(right);
    photos.appendChild(theCarousel);
  })
  return photos;
};

var results = document.getElementById('results');
var photos = document.createElement('div');
var weather = document.createElement('div');
