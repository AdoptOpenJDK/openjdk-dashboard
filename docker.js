function graph(version) {
  fetch('https://cors-anywhere.herokuapp.com/https://hub.docker.com/v2/repositories/adoptopenjdk?page_size=100', {})
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
          for (var tag of data.results) {
            labels.push(tag.name.replace('openj9', 'oj9'))
            downloads.push(tag.pull_count)
          }
          var graphVersion = document.getElementById('graph').getContext('2d');
          Chart.defaults.global.defaultFontSize = 20;
          var myChart = new Chart(graphVersion, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Docker Repo Pulls',
                data: downloads,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: {
              "hover": {
                "animationDuration": 0
              },
              "animation": {
                "duration": 1,
                "onComplete": function() {
                  var chartInstance = this.chart,
                    ctx = chartInstance.ctx;

                  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'bottom';
                  this.data.datasets.forEach(function(dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function(bar, index) {
                      var data = dataset.data[index];
                      ctx.fillText(addComma(data), bar._model.x, bar._model.y - 5);
                    });
                  });
                }
              },
              tooltips: {
                "enabled": false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  stacked: false,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    min: 0,
                    autoSkip: false
                  }
                }],
              }
            }
          });
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

graph()
