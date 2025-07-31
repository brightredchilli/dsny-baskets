import { createReadStream, appendFile, writeFile } from 'fs';
import { createInterface } from 'readline/promises'
import { cwd } from 'process';
import { resolve } from 'path';


// This script parses and cleans the raw data download from the NYC OpenData portal
const csvPath = resolve(cwd(), 'data', 'inventory.csv');
const csvOutPath = resolve(cwd(), 'src', 'assets', 'inventory_clean.csv');
const geoJsonOutPath = resolve(cwd(), 'src', 'assets', 'inventory_geojson.json');
const fileStream = createReadStream(csvPath);

// Note: we use the crlfDelay option to recognize all instances of CR LF
// ('\r\n') in input.txt as a single line break.
const rl = createInterface({ input: fileStream, crlfDelay: Infinity, });


writeFile(csvOutPath, '', (err) => {
  if (err) {
    console.log(`Error clearing file!: ${err}`);
  }
});

function toFeature(lat, lng) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat] // GeoJSON uses [lng, lat]
    },
    properties: {}
  };
}

function toGeoJSON(features) {
  const fc = {
    type: 'FeatureCollection',
    features: features
  };

  return JSON.stringify(fc, null, 2)
}

let firstLine = true;
let features = []
for await (const line of rl) {
  if (firstLine) {
    firstLine = false;
    console.log(`Header: ${line}`);
    const header = line.split(',');
    console.log(header.map((x, idx) => `[${idx}]: ${x}`));
    appendFile(csvOutPath, 'basketId,basketType,lat,lng\n', 'utf8', (err) => {
      if (err) {
        console.error('An error occurred:', err);
      }
    });
    continue;
  }
  // Each line in input.txt will be successively available here as `line`.
  const tokens = line.split(',');

  const basketId = tokens[0];
  const basketType = tokens[1];
  const pointStr = tokens[13];
  let m = pointStr.match(/POINT \((.*) (.*)\)$/) ?? [];
  let lng = parseFloat(m[1]);
  let lat = parseFloat(m[2]);

  features.push(toFeature(lat, lng))


  let data = `${basketId},${basketType},${lat},${lng}` + "\n";

  appendFile(csvOutPath, data, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred:', err);
    }
  });
}

writeFile(geoJsonOutPath, toGeoJSON(features), (err) => {
  if (err) {
    console.log(`Error writing geojson: ${err}`);
  }
});
