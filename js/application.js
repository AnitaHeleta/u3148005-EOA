var map;

function onClickMenu() {
  document.getElementById("menu").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
  document.getElementById("menu-bg").classList.toggle("change-bg");
}

function displayData(apiData) {
  if (apiData.data.length === 0) {
    clearAll();
    $(".item-container").append("<p>No Results found</p>");
    return;
  }
  var chunkedResults = _.chunk(apiData.data, 4);
  for (const resultsChunk of chunkedResults) {
    var section = buildSection(resultsChunk);
    $(".item-container").append(section);
  }

  if (apiData.links && apiData.links.next) {
    loadDataFrom(apiData.links.next);
  }
}

function buildSection(results) {
  var s = $('<div class="section">');
  var items = _.map(results, buildIndividualResult);
  s.append(items);
  return s;
}

function buildIndividualResult(r) {
  var item = $(`<div class="col span-1-of-4 box">
            <h3>Title</h3>
            <p class="result-title" >${r.title}</p>
            <h3> Description</h3>
            <p class="physdesc">${r.physicalDescription}</p>
            <h3>Type</h3>
            <p class="type">${r.additionalType}</p>
            <h3>Collection</h3>
            <p class="collection"> ${r.collection.title}</p>
        </div>`);

  var endDate = extractEndDate(r);
  if (endDate) {
    item.append("<h3>Period</h3> <p class='period'>" + endDate + "</p>");
  }
  var thumbnail = extractThumbnail(r);
  if (thumbnail) {
    item.append('<img src="' + thumbnail + '" class="thumbnail">');
  }
  var geo = extractGeo(r);
  if (geo) {
    L.marker(geo.split(",")).addTo(map).bindPopup(r.title).openPopup();
  }

  return item;
}

function paragraphWithReadMore(value) {
  const carLmt = 280;
  if (value.length > carLmt) {
    const readMoreTxt = " ... Read More";
    const readLessTxt = " Read Less";
    const firstSet = value.substring(0, carLmt);
    const secdHalf = value.substring(carLmt, value.length);
    return `<p class="addReadMore showlesscontent">
            ${firstSet}
            <span class='SecSec'>${secdHalf}</span>
            <span class='readMore' title='Click to Show More'>${readMoreTxt}</span>
            <span class='readLess' title='Click to Show Less'>${readLessTxt}</span>
        </p>`;
  }
  return `<p>${value}</p>`;
}

function extractEndDate(row) {
  if (row.temporal) {
    var event = _.findWhere(row.temporal, { type: "Event" });
    return event.title;
  }
  return undefined;
}

function extractGeo(row) {
  if (row.spatial) {
    var geo = _.filter(row.spatial, row.geo);
    return geo ? geo[0].geo : undefined;
  }
  return undefined;
}

function extractThumbnail(row) {
  if (row.hasVersion) {
    var images = _.findWhere(row.hasVersion, { type: "StillImage" });
    var thumbnail = _.findWhere(images.hasVersion, {
      version: "thumbnail image",
    });
    return thumbnail.identifier;
  }
  return undefined;
}

function loadDataFrom(path) {
  var searchUrl = "https://data.nma.gov.au/" + path;
  $.getJSON(searchUrl, displayData);
}

function searchByTitle(query) {
  clearAll();
  var path = getObjectPath(`title=${query}`);
  loadDataFrom(path);
}

function searchByCollection(query) {
  clearAll();
  map.eachLayer(function (layer) {
    if (layer.options.id === "mapbox/streets-v11") return;
    console.log(layer);
    map.removeLayer(layer);
  });
  var path = getObjectPath(`collection=${query}`);
  loadDataFrom(path);
}

function searchByLocation(suburb, city) {
  clearAll();
  var path = getObjectPath(`spatial=${suburb}&spatial=${city}`);
  loadDataFrom(path);
}

function searchByType(type) {
  clearAll();
  var path = getObjectPath(`additionalType=${type}`);
  loadDataFrom(path);
}

function searchByMedium(medium) {
  clearAll();
  var path = getObjectPath(`medium=${medium}`);
  loadDataFrom(path);
}

function clearAll() {
  $(".item-container").empty();
  map.eachLayer(function (layer) {
    if (layer.options.id === "mapbox/streets-v11") return;
    console.log(layer);
    map.removeLayer(layer);
  });
}

function getObjectPath(query) {
  return `object?limit=51&format=simple&apikey=4SDwv6pd4DyiBrJ5xu2PnVUmaLhIogIk&${query}`;
}

function getLocationName(lat, long) {
  // my OpenCage Geocoder API key
  var geoApi = "33e3b3aefbaa415fa6393bcb1a1831e5";
  var geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${long}&key=${geoApi}`;
  $.getJSON(geocodeUrl, function (locationData) {
    var suburb = locationData.results[0].components.suburb;
    var city = locationData.results[0].components.city;
    var state = locationData.results[0].components.city;
    var city = locationData.results[0].components.state;
    var country = locationData.results[0].components.country;
    console.log(locationData.results[0].components);
    localStorage.setItem("suburb", `${suburb}, ${city}, ${state}, ${country}`);
    localStorage.setItem("city", `${city}, ${state}, ${country}`);
  });
}

function findNearMe() {
  var suburb = localStorage.getItem("suburb");
  var city = localStorage.getItem("city");
  searchByLocation(suburb, city);
}

function performSearch(searchQuery) {
  var searchBy = $("input[name='searchBy']:checked").val();
  if (searchBy === "title") {
    searchByTitle(searchQuery);
  } else if (searchBy === "collection") {
    searchByCollection(searchQuery);
  }
}

function fetchGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      getLocationName(pos.coords.latitude, pos.coords.longitude);
    });
  }
}

function setupSuggestionForSearch() {
  var suggestions = [
    { value: "Wood", data: "wood" },
    { value: "Glass", data: "glass" },
    { value: "Ceramic", data: "ceramic" },
    { value: "vase", data: "vase" },
    { value: "Lense", data: "lense" },
    { value: "Boomarang", data: "boomarang" },
    { value: "Carved", data: "carved" },
    { value: "Plate", data: "plate" },
    { value: "Doll", data: "doll" },
  ];

  $("#myInput").autocomplete({
    lookup: suggestions,
    onSelect: function (suggestion) {
      performSearch(suggestion.data);
    },
  });
}

$(document).on("keypress", "input", function (e) {
  if (e.key == "Enter") {
    var searchQuery = $(this).val();
    performSearch(searchQuery);
  }
});

$(function () {
  fetchGeoLocation();
  setupSuggestionForSearch();
  $(document).on("click", ".readMore,.readLess", function () {
    $(this)
      .closest(".addReadMore")
      .toggleClass("showlesscontent showmorecontent");
  });

  map = L.map("mapid").setView([-26.289033, 134.605947], 5);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiaGFuaXRhIiwiYSI6ImNrb282cGtlbzAxdmwydW9qeTRlYmF6aHIifQ.tgxopbicQoMcjq0E1BXHiQ",
    }
  ).addTo(map);
});
