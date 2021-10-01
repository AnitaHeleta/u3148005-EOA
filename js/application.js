function onClickMenu() {
  document.getElementById("menu").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");

  document.getElementById("menu-bg").classList.toggle("change-bg");
}

// $(document).ready(function () {
//   // API to HTML 1
//   // Accessing an API and returning data
//   // need NMA API key
//   // https://data.nma.gov.au/object?limit=5&medium=*wood&format=simple
//   // docs: https://github.com/NationalMuseumAustralia/Collection-API/wiki/Getting-started

//   // my api key
//   var key = "aGyOTzAchbsscZt7OnZQ4hSvgSsiW0hW";

//   // API call
//   var url =
//     "https://data.nma.gov.au/object?limit=5&medium=*glass&format=simple" +
//     "&apikey=" +
//     key;

//   $.getJSON(url, function (apiData) {
//     console.log("im here");
//     console.log(apiData);

//     var title = apiData.data[0];
//     var collection = apiData.data[0];
//     var material = apiData.data[0];
//     var physicalDescription = apiData.data[0];
//     var contributor = apiData.data[0];
//     var temporal = apiData.data[0];

//     $(".title").html(title.title);
//     $(".collection").html(collection.collection.title);
//     $(".material").html(material.medium[0].title);
//     $(".physicalDescription").html(physicalDescription.physicalDescription);
//     $(".contributor").html(contributor.contributor[0].title);
//     $(".temporal").html(temporal.temporal[0].endDate);
//   });
// });
