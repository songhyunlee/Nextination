var searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', function () {
  var term = document.getElementById('term').value;
  showResults(results, photos, term);
});

var theTerm = document.getElementById("term")
theTerm.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    var term = document.getElementById('term').value;
    e.preventDefault();
    showResults(results, photos, term);
  }
});

var home = document.getElementById("home");
home.addEventListener('click', function(e) {
  showArea(searchBar);
  hideArea(registration);
  clear(results);
  clearFields('term');
})

var loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', function(e){
  swap('two-btns','login-form');

  var loginButton = document.getElementById('login-btn2');
  loginButton.addEventListener('click', function (){

    var username = document.getElementById('username').value;
    var userpassword = document.getElementById('password').value;

    var credentials = {
      "username":username,
      "password":userpassword
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(credentials));

    xhr.addEventListener('load', function(e){
      homepage();
    })
  })
})

var signupBtn = document.getElementById('signup-btn');
signupBtn.addEventListener('click', function(e) {
  swap('search-box', 'register');

  var accountBtn = document.getElementById('account-btn');
  accountBtn.addEventListener('click', function registration(newName, newUsername, newPw) {
    e.preventDefault();

    var name = document.getElementById('new-name').value;
    var username = document.getElementById('new-username').value;
    var password = document.getElementById('new-password').value;

    var newUser = {
      "name":name,
      "username": username,
      "password": password
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST','/register/:name');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(newUser));

    xhr.addEventListener('load', function(e){
      var accountResponse = JSON.parse(xhr.responseText);
    })
    swap('register-box', 'search-box');
    alert("Registration success!");
  })
})

var plane = document.getElementById('homeicon');
plane.addEventListener('click', function(e) {
  if (matchedUser) {
    hideArea(searchBar);
    hideArea(registration);

    var nextCity = matchedUser.nextCity;
    bookmarks(nextCity);
  }
})

function homepage() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login/home');
  xhr.send();

  xhr.addEventListener('load', function() {
    if (xhr.responseText) {
      matchedUser.push(JSON.parse(xhr.responseText));
      swap('login-form','user-home');
      var user = document.getElementById('user');
      var matched = JSON.parse(xhr.responseText);
      user.textContent = matched.name;
      hideArea(searchBar);
      hideArea(registration);
      hideArea(signupBtns);
    }
  })
}

function search(term) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/search/' + term);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();

  xhr.addEventListener('load', function() {
    var responseData = JSON.parse(xhr.responseText);
    show(responseData);
    getPhotos(term, responseData[0].tags, responseData[0].lat, responseData[0].lon, responseData[0].name);
    getWeather(term, responseData[0].name, responseData[0].country);
  });
}

function getPhotos(term, tags, lat, lon, name) {
  clear(photos);
  var term = document.getElementById('term').value;

  var searchterms = {
    tag: tags,
    lat: lat,
    lon: lon,
    name: name
  }

  var request = new XMLHttpRequest();
  request.open('POST', '/photo/' + term);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(searchterms));

  request.addEventListener('load', function() {
    var data = JSON.parse(request.response);
    var thePhoto = data.photos.photo;
    var theCarousel = carouselItems(thePhoto);
    photos.appendChild(theCarousel);
  })
  return photos;
};

function getWeather(term, name, country) {
  var term = document.getElementById('term').value;

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

      var theWeather = tableItems(forecasts);
      weather.appendChild(theWeather);

      return weather;
    }
  }
}

function tableItems(forecasts) {
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

  theWeather.setAttribute('class','col-offset-md-1 col-md-8 weather');
  theWeather.appendChild(theTable);

  return theWeather;
}

function tableData(dayN) {
  var theInfo = document.createElement('tr');
  var day = document.createElement('td');
  day.textContent = dayN.Date.slice(0,10);
  var dayPhrase = document.createElement('td');
  var temp = document.createElement('td');
  temp.textContent = dayN.Temperature.Maximum.Value + '°F' + '/ '
  + dayN.Temperature.Minimum.Value + '°F';
  dayPhrase.textContent = dayN.Day.ShortPhrase;
  var nightPhrase = document.createElement('td');
  nightPhrase.textContent = dayN.Night.ShortPhrase;

  theInfo.appendChild(day);
  theInfo.appendChild(temp);
  theInfo.appendChild(dayPhrase);
  theInfo.appendChild(nightPhrase);

  return theInfo;
}

function show(city) {

  for (var i = 0; i < city.length; i++) {
    var where = document.getElementById('results');
    var info = document.createElement('div');
    var cityNameArea = document.createElement('div');
    var cityName = document.createElement('span');
    var country = document.createElement('p');
    var localTime = document.createElement('p');
    var description = document.createElement('p');
    var iconLink = document.createElement('a');
    var icon = document.createElement('i');

    info.setAttribute('class', 'col-offset-md-1 col-md-8 info');
    cityName.textContent = city[i].name;
    cityName.setAttribute('class', 'cityname');
    country.textContent = city[i].country;
    localTime.textContent = "Local Time: " + new Date().toLocaleString('en-US', { timeZone: city[i].time })
    description.textContent = city[i].description;
    iconLink.setAttribute('href', '##');
    icon.setAttribute('class', 'fa fa-plane');

    iconLink.appendChild(icon);
    cityNameArea.appendChild(cityName);
    cityNameArea.appendChild(iconLink);

    icon.addEventListener('click', function(e){
      bookmarked.push(cityName.textContent);
      if (matchedUser) {
        matchedUser.nextCity = bookmarked;
      } else {
        alert ('You need to be logged in to view your destinations!')
      }
    })

    var theContainer = document.createElement('div');
    theContainer.setAttribute('class', 'container');

    var theNav = document.createElement('ul');
    theNav.setAttribute('class','nav nav-tabs');

    var basicli = document.createElement('li');
    basicli.setAttribute('class', 'active');
    var basictoggle = document.createElement('a');
    basictoggle.setAttribute('data-toggle', 'tab');
    basictoggle.setAttribute('href', '#basicinfo');
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

    var basicinfo = document.createElement('div');
    basicinfo.setAttribute('id', 'basicinfo');
    basicinfo.setAttribute('class','tab-pane fade in active');
    basicinfo.appendChild(info);

    var photomenu = document.createElement('div');
    photomenu.setAttribute('id', 'menu1');
    photomenu.setAttribute('class', 'tab-pane fade');
    photomenu.appendChild(photos);

    var weathermenu = document.createElement('div');
    weathermenu.setAttribute('id', 'menu2');
    weathermenu.setAttribute('class', 'tab-pane fade');
    weathermenu.appendChild(weather);

    info.appendChild(cityNameArea);
    info.appendChild(country);
    info.appendChild(localTime);
    info.appendChild(description);

    theNav.appendChild(basicli);
    theNav.appendChild(photoli);
    theNav.appendChild(weatherli);
    theContainer.appendChild(theNav);
    tabContent.appendChild(basicinfo);
    tabContent.appendChild(photomenu);
    tabContent.appendChild(weathermenu);
    theContainer.appendChild(tabContent);
    where.appendChild(theContainer);

  }
  return where
}

function carouselItems(thePhoto) {
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
    var imgURL = 'https://farm' + thePhoto[i].farm + '.staticflickr.com/' +
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

  return theCarousel;
}

function bookmarks(nextCity) {
  if (nextCity) {
    var heading = document.createElement('h3');
    heading.textContent ='Your Next Destinations: ';
    var box = document.createElement('div');
    box.setAttribute('class', 'col-md-offset-md-1 col-md-8');
    box.setAttribute('id', 'destination-box');

    for (var i = 0; i < nextCity.length; i++) {
      var listLink = document.createElement('a');
      listLink.setAttribute('href','#');
      var destination = document.createElement('li');
      destination.setAttribute('class', 'destinationLink');
      destination.textContent = nextCity[i];
      listLink.appendChild(destination);
      box.appendChild(listLink);

      var destinations = [];
      destinations.push(destination);

      destinations.forEach(function(destination) {
        destination.addEventListener('click', function(e) {
          clear(results);
          var newTerm = destination.textContent;
          search(newTerm);
        })
      })
    }
    clear(results);
    results.appendChild(heading);
    results.appendChild(box);

    return results;
  } else {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-md-offset-md-1 col-md-8');
    box.setAttribute('id', 'destination-box');
    var heading = document.createElement('h4');
    heading.textContent = 'You have no bookmarked destinations.';
    clear(results);
    results.appendChild(heading);

    return results;
  }
}

function showResults(results, photos, term) {
  clear(results);
  clear(photos);
  search(term);
}

function clear(area) {
  while (area.firstChild) {
    area.removeChild(area.firstChild);
  }
}

function clearFields(id) {
  document.getElementById(id).value = "";
}

function showArea (area) {
  if (area.className == 'hide') {
    area.classList.remove('hide');
    area.classList.add('current');
  }
}

function hideArea (area) {
  if (area.className == 'current') {
    area.classList.remove('current');
    area.classList.add('hide');
  }
}

function swap(current, next) {
  var theCurrent = document.getElementById(current);
  theCurrent.classList.remove('current');
  theCurrent.classList.add('hide');

  var theNext = document.getElementById(next);
  theNext.classList.add('current');
  theNext.classList.remove('hide');
}


var results = document.getElementById('results');
var photos = document.createElement('div');
var weather = document.createElement('div');
var registration = document.getElementById('register');
var searchBar = document.getElementById('search-box');
var signupBtns = document.getElementById('two-btns');
var response = [];
var bookmarked = [];
var matchedUser = [];
// console.log(response.data[0].name);
