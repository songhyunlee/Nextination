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

function show(city) {
  for (var i = 0; i < city.length; i++) {
    var where = document.getElementById('results');
    var info = document.createElement('div');
    var cityName = document.createElement('p');
    var country = document.createElement('p');
    info.setAttribute('class', 'col-md-8 info');
    cityName.textContent = city[i].name;
    country.textContent = city[i].country;

    info.appendChild(cityName);
    info.appendChild(country);
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
  console.log((xhr.responseText));

  xhr.addEventListener('load', function() {
    show(JSON.parse(xhr.responseText));
  });
}
