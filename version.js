function graph(version, tag) {
  var url = 'https://api.adoptopenjdk.net/v2/info/releases/open' + version + '?release=' + tag;
  fetch(url.replace("+", "%2B"))
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
          for (var platform of data[0].binaries) {
            console.log(platform)
            labels.push(platform.os + '-' + platform.architecture + '-' + platform.binary_type + '-' + platform.openjdk_impl)
            downloads.push(platform.download_count)
          }
          var ctx = document.getElementById("graph");
          Chart.defaults.global.defaultFontSize = 20;
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Summary of ' + tag + ' Downloads',
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
                      ctx.fillText(data, bar._model.x, bar._model.y - 5);
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
                    display: false,
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  stacked: false,
                  beginAtZero: true,
                  ticks: {
                    maxRotation: 90,
                    minRotation: 90,
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

var url_string = window.location.href;
var url = new URL(url_string);
var version = url.searchParams.get("version");
var tag = url.searchParams.get("tag");
graph(version, tag)
