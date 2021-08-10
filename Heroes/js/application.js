$ (document).ready (function () {
  var key = 'SVn7KuyPIp4znnMajTuep1ewhd3T1BTN8xlu93Ne';
  var url = 'https://qjeqzny91m.execute-api.ap-southeast-2.amazonaws.com/alpha?q=*:*&wt=json&rows=2';
  fetch(url, {
    headers: new Headers({
      'X-Api-Key': key
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => console.error(error))
});
