const request = require('sync-request')
const {
  Client
} = require('pg')
const client = new Client({
  user: 'postgres',
  host: '37.153.110.144',
  database: 'downloadStats',
  password: process.env.PSQL_PASSWORD,
  port: 5432,
})

pushStats()

async function pushStats() {

  await client.connect()

  const java_version = [
    "openjdk8",
    "openjdk9",
    "openjdk10",
    "openjdk11",
    "openjdk12"
  ]

  // This is the total number displayed on the page
  let total = 0;
  let counter = 0;

  function get_request(url) {
    let res = request('GET', url);
    return JSON.parse(res.body);
  }

  // Dockerhub pulls
  let docker_stats = get_request("https://hub.docker.com/v2/repositories/adoptopenjdk?page_size=100")
  for (let repo of docker_stats.results) {
    total += repo.pull_count
  }

  // Github release downloads
  for (let version of java_version) {
    let github_stats = get_request(`https://api.adoptopenjdk.net/v2/info/releases/${version}`)

    counter += 1;
    let release_counter = 0

    for (var release of github_stats) {
      total += release.download_count
      release_counter += release.download_count
    }
  }

  let timestamp = new Date().toISOString()
  let queryString = "INSERT INTO downloads (counter, timestamp) VALUES (" + "'" + [total, timestamp].join("','") + "'" + ")";
  console.log(queryString);

  client.query(queryString, (err, res) => {
    if (err) {
      console.error(err)
    }
    client.end()
  })

}
