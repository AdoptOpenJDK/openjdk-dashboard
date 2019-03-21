function graph(version, tag) {
  var url = 'https://api.adoptopenjdk.net/v2/info/releases/' + version + '?release=' + tag;
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
            labels.push(platform.os + '-' + platform.architecture + '-' + platform.binary_type + '-' + platform.openjdk_impl.replace('openj9', 'oj9').replace('hotspot', 'hspt'))
            downloads.push(platform.download_count)
            if (platform.installer_name) {
              labels.push(platform.os + '-' + platform.architecture + '-' + platform.binary_type + '-' + platform.openjdk_impl.replace('openj9', 'oj9').replace('hotspot', 'hspt') + '-installer')
              downloads.push(platform.installer_download_count)
            }
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
                      ctx.fillText(Comma(data), bar._model.x, bar._model.y - 5);
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

function Comma(Num) { //function to add commas to textboxes
  Num += '';
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  x = Num.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1))
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  return x1 + x2;
}

var url_string = window.location.href;
var url = new URL(url_string);
var version = url.searchParams.get("version");
if (!version) {
  alert('please specify a version e.g "?version=openjdk8|openjdk11"')
}
var tag = url.searchParams.get("tag");
if (!tag) {
  alert('please specify a version e.g "?tag=jdk8u172-b11"')
}
graph(version, tag)
