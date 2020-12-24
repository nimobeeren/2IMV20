const path = require("path");
const http = require("http");

const dataDir = "../data/ebird/ebd_barswa_201901_201912_relNov-2020";
const file = path.resolve(dataDir, "ebd_export.json");
const raw = require(file);

const observations = [];
for (let i = 0; i < 100; i++) {
  observations.push({
    date: raw.date[i],
    lat: raw.lat[i],
    lon: raw.lon[i],
    count: raw.count[i],
  });
}

const requestListener = (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify(observations));
};

const port = 5000;
const server = http.createServer(requestListener);
server.listen(port);
console.info(`Listening on port ${port}`);
