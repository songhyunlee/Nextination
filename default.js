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
