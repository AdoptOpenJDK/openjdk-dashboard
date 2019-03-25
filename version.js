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
          generateGraph(labels, downloads, `Summary of ${tag} Downloads`)
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
if (!version) {
  alert('please specify a version e.g "?version=openjdk8|openjdk11"')
}
var tag = url.searchParams.get("tag");
if (!tag) {
  alert('please specify a version e.g "?tag=jdk8u172-b11"')
}
graph(version, tag)
