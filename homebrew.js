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
                generateGraph(labels, downloads, 'Homebrew cask downloads')
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
