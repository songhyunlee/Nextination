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
    getResults();
  }
});

function search(form) {
  var inputs = form.getElementsByTagName('input');
  var search = {};
  search.term = inputs.term.value;
  return search;
}

function showButton() {
  var hidden = document.getElementsByClassName('hide')[0];
  hidden.classList.remove('hide');
  hidden.classList.add('current');
}

function show(city) {
  for (var i = 0; i < city.length; i++) {
    var where = document.getElementById('results');
    var info = document.createElement('div');
    var cityName = document.createElement('h3');
    var country = document.createElement('p');
    var localtime = document.createElement('p');
    var description = document.createElement('p');
    var photobtn = document.createElement('button');
    info.setAttribute('class', 'col-offset-md-1 col-md-8 info');
    cityName.textContent = city[i].name;
    country.textContent = city[i].country;
    localtime.textContent = "Local Time: " + new Date().toLocaleString('en-US', { timeZone: city[i].time })
    description.textContent = city[i].description;
    photobtn.setAttribute('class', 'btn btn-default btn-xs');
    photobtn.textContent = 'Photos';
    photobtn.setAttribute('id', 'photobtn');

    info.appendChild(cityName);
    info.appendChild(country);
    info.appendChild(localtime);
    info.appendChild(description);
    info.appendChild(photobtn);
    where.appendChild(info);

    var photobtn = document.getElementById("photobtn");
    photobtn.addEventListener('click', function(e) {
      getPhotos();
    });
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
  });
}

function getPhotos() {
  var theForm = document.getElementById('search');
  var details = search(theForm);
  console.log(details.term);
  var tag = {
    tag: details.term
  }
  var request = new XMLHttpRequest();
  request.open('POST', '/search/:term');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(tag));

  request.addEventListener('load', function() {
    var data = JSON.parse(request.response);
    var thePhoto = data.photos.photo;
    var photos = document.getElementById('photos');

    var theCarousel = document.createElement('div');
    theCarousel.setAttribute('class', 'carousel slide');
    theCarousel.setAttribute('data-ride', 'carousel');
    theCarousel.setAttribute('id', 'my-carousel');

    var theList = document.createElement('ol');
    theList.setAttribute('class', 'carousel-indicators');

    var theActive = document.createElement('li');
    theActive.setAttribute('data-target', '#my-carousel');
    theActive.setAttribute('data-slide-to', '0');
    theActive.setAttribute('class', 'active');

    var theItems = [];
    var one = document.createElement('li');
    one.setAttribute('data-target', '#my-carousel');
    one.setAttribute('data-slide-to', '1');
    var two = document.createElement('li');
    two.setAttribute('data-target', '#my-carousel');
    two.setAttribute('data-slide-to', '2');
    var three = document.createElement('li');
    three.setAttribute('data-target', '#my-carousel');
    three.setAttribute('data-slide-to', '3');
    var four = document.createElement('li');
    four.setAttribute('data-target', '#my-carousel');
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
      image.setAttribute('class', 'img-responsive');
      var photoId = thePhoto[i].id;
      var owner = thePhoto[i].owner;
      var imgURL = 'http://farm' + thePhoto[i].farm + '.staticflickr.com/' +
      thePhoto[i].server + '/' + thePhoto[i].id + '_' + thePhoto[i].secret + '.jpg';
      image.src = imgURL;
      images.push(image);
      console.log(image);
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
    inactiveItems.forEach(function(inactiveItem) {
      theInner.appendChild(inactiveItem)
    });
    theList.appendChild(theActive);
    theItems.forEach(function(theItem) {
      theList.appendChild(theItem)
    });
    theCarousel.appendChild(theInner);
    theCarousel.appendChild(theList);
    photos.appendChild(theCarousel);
  })
};

var results = document.getElementById('results');
var photos = document.getElementById('photos');
