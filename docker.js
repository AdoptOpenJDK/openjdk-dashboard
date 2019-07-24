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
          // Official Docker pulls
          let officialDockerStats = request("https://cors-anywhere.herokuapp.com/https://hub.docker.com/v2/repositories/library/adoptopenjdk/")
          labels.push('official')
          downloads.push(officialDockerStats.pull_count)
          
          for (var tag of data.results) {
            labels.push(tag.name.replace('openj9', 'oj9'))
            downloads.push(tag.pull_count)
          }
          generateGraph(labels, downloads, 'Docker Repo Pulls')
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

graph()
