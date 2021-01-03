const path = require("path");
const http = require("http");
const fs = require("fs");

const file = path.resolve("../data/ebird/ebd_export.csv");

const requestListener = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  let raw;
  try {
    raw = fs.readFileSync(file);
  } catch (e) {
    res.writeHead(500);
    return res.end(e.message);
  }

  res.writeHead(200);
  res.end(raw);
};

const port = 5001;
const server = http.createServer(requestListener);
server.listen(port);
console.info(`Listening on port ${port}`);
