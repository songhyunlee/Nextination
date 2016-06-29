var myButton = document.getElementById('my-button');
myButton.addEventListener('click', function () {
  clear(results);
  getResults()
});

var term = document.getElementById("term")
term.addEventListener("keydown", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    clear(results);
    getResults();
    getPhotos();
  }
});

function search(form) {
  var inputs = form.getElementsByTagName('input');
  var search = {};
  search.term = inputs.term.value;
  return search;
}

var photos = document.getElementById('photos');

function show(city) {
  for (var i = 0; i < city.length; i++) {
    var where = document.getElementById('results');
    var info = document.createElement('div');
    var cityName = document.createElement('h3');
    var country = document.createElement('p');
    var localtime = document.createElement('p');
    var description = document.createElement('p');
    info.setAttribute('class', 'col-offset-md-1 col-md-8 info');
    cityName.textContent = city[i].name;
    country.textContent = city[i].country;
    localtime.textContent = "Local Time: " + new Date().toLocaleString('en-US', { timeZone: city[i].time })
    description.textContent = city[i].description;

    info.appendChild(cityName);
    info.appendChild(country);
    info.appendChild(localtime);
    info.appendChild(description);
    where.appendChild(info);
  }
  return where
}

function clear(results) {
  var results = document.getElementById('results');
  while(results.firstChild) {
    results.removeChild(results.firstChild);
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
  });
}

function getPhotos() {
  var request = new XMLHttpRequest();
  request.open('POST', '/search/:term');
  console.log(request);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();

  request.addEventListener('load', function() {
    console.log('here');
    var data = JSON.parse(request.response);
    console.log(data);
    var photos = document.getElementById('photos');
      data.photos.photo.forEach(function (photo) {

          var image = document.createElement('p');
          image.textContent = 'image here'
          photos.appendChild(image);
      
    })

  })
};
