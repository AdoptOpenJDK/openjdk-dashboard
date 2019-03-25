let casks = []

fetch('https://raw.githubusercontent.com/AdoptOpenJDK/homebrew-openjdk/master/README.md', {})
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.text().then(function(data) {
        // Grab all the cask files from the README.md
        const regex = /\b(\w*adoptopenjdk\w*[-]?\w*)\b/gm
        casks = data.match(regex);

        fetch('https://formulae.brew.sh/api/analytics/cask-install/365d.json', {})
          .then(
            function(response) {
              if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                  response.status);
                return;
              }
              var labels = [];
              var downloads = [];
              response.json().then(function(data) {
                for (cask of data.items) {
                  if (casks.includes(cask.cask)) {
                    labels.push(cask.cask)
                    downloads.push(cask.count.replace(/\,/g,''))
                  }
                }
                var graphVersion = document.getElementById('graph').getContext('2d');
                Chart.defaults.global.defaultFontSize = 20;
                var myChart = new Chart(graphVersion, {
                  type: 'bar',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Homebrew cask downloads',
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

      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
