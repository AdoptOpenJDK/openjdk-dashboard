function graph(version) {
  fetch('https://api.adoptopenjdk.net/v2/info/releases/open' + version)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          var labels = [];
          var downloads = [];
          for (var release in data) {
            labels.push(data[release].release_name)
            downloads.push(data[release].download_count)
          }
          var graphVersion = document.getElementById(version).getContext('2d');
          Chart.defaults.global.defaultFontSize = 40;
          var myChart = new Chart(graphVersion, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: '# of ' + version + ' Downloads',
                data: downloads,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
              }]
            },
          });
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

graph('jdk11')
graph('jdk10')
graph('jdk9')
graph('jdk8')
