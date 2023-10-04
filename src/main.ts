import './main.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter'
import inventory from './assets/inventory_clean.csv'

import * as d3 from 'd3';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet.heat';
import './util/wicket';
import linesUrl from './assets/lines.geojson';
import matchesUrl from './assets/matches.geojson';
import clustersUrl from './assets/cluster_centers.geojson';
import ellipseUrl from './assets/ellipse.png';
import { makeHighways, polygonPoints, arrayWkt } from './util/geo';

import { drawPoints } from './util/drawing';


document.querySelector<HTMLDivElement>('body')!.innerHTML = `
  <div class='container px-5 mx-auto'>
    <h1 class='text-3xl text-left mt-5 mb-5'>How is easy it is for you to keep your city clean?</h1>

    <p>
      The following is a visualization of the locations of various
    <p>
    <div id="leafletcontainer">
    </div>
  </div>
`

console.log(linesUrl);
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)



function setUpCircles(arr: L.LatLngLiteral[], map: L.Map) {
  arr.forEach(x => {

    let c = L.circle([x.lat, x.lng], { radius: 3, weight: 3, color: "#c9291a", opacity: 1 });
    c.addTo(map);

    // add animation to circles
    // let e = c.getElement() as HTMLElement
    // e.classList.add("fadein");
    //
    // e.style.animationDelay = `3s`;
    // e.style.animationDuration = `${Math.random() * 2}s`
  });
}

async function setUpLine(map: L.Map) {
  let pointbuffered100 = await polygonPoints('src/util/linestrings/pointbuffered100.txt')
  L.polygon(pointbuffered100, {opacity: 0.5}).addTo(map);

  let allroads100 = await arrayWkt('src/util/linestrings/allroads100.json')
  allroads100.forEach(x => L.polyline(x, {color: 'red', opacity: 0.9}).addTo(map));

  let footway100 = await arrayWkt('src/util/linestrings/footway100.json')
  footway100.forEach(x => L.polyline(x, {color: 'blue', opacity: 0.9}).addTo(map));
  return;
}

function visualizeClusters(map: L.Map) {
  d3.json(clustersUrl).then(
    (clusters: any) => {

      // for (const c of clusters) {
      //   // const coords = c.geometry.coordinates;
      //   // var latlng = L.latLng(coords[1], coords[0]);
      //   //
      //   // var bounds = latlng.toBounds(20);
      //   // L.imageOverlay(ellipseUrl, bounds).addTo(map);
      //
      //   L.geoJson(c, {
      //     pointToLayer: (p, latlng) => {
      //       return L.circle(latlng, { radius: 2, weight: 1, color: "#c9291a", opacity: 1 });
      //     }
      //   }).addTo(map);
      // }
    },
    err => {
      debugger;
      console.log('error fetching geojson clusters');
    }
  );
}


function setupLeaflet(center: L.LatLngTuple) {
  let container  = document.getElementById("leafletcontainer") as HTMLDivElement;
  let rect = container.getBoundingClientRect();
  container.style.height = `${rect.width * 2/3}px`; // 3:2 aspect ratio

  const nyc_bounds = L.latLngBounds([40.38264, -74.31015], [41.14143, -73.22319]);
  let map = L.map(container, {
    maxBounds: nyc_bounds,
    maxBoundsViscosity: 0.8
  }).setView(center, 12); // initializes the map, sets zoom & coordinates



  // map.on('zoomend', (e) => {
  //   console.log(`zoom level changed to ${map.getZoom()}`);
  // });

//   L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//  }).addTo(map); //This adds the tile layer to the map. The map dynamically loads tiles based on current view the experience smooth and seamless. Make sure to add attribution to your map.


  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
}).addTo(map);

  // makeHighways(map);
  // setUpLine(map);
  // setUpCircles(map);
  // visualizeClusters(map);


  let smolInventory = inventory;

  let initialBounds = L.latLngBounds(smolInventory[0], smolInventory[1]!);

  let extent = smolInventory.reduce((bounds, basket) => bounds.extend(basket), initialBounds);
  let nw = extent.getNorthWest();
  let se = extent.getSouthEast();


  let nwContainer = map.latLngToContainerPoint(nw);
  let seContainer = map.latLngToContainerPoint(se);

  let w = seContainer.x - nwContainer.x;
  let h = seContainer.y - nwContainer.y;

  let imageBounds = L.bounds(
    map.latLngToContainerPoint(extent.getNorthWest()),
    map.latLngToContainerPoint(extent.getSouthEast())
  );


  L.circle(extent.getNorthWest(), { color: 'purple' }).addTo(map);
  L.circle(extent.getSouthEast(), { color: 'green' }).addTo(map);

  drawPoints(smolInventory, map, imageBounds).then(url => {
    L.imageOverlay(url, extent).addTo(map);
  });

  // setUpCircles(smolInventory, map);



  //
  // L.svg().addTo(map)// we have to make the svg layer clickable
  // let svg = map.getPanes().overlayPane.querySelector('svg') ;
  //


  // let pts = inventory.map(x => {
  //   return [x.lat, x.lng, 3] as L.HeatLatLngTuple;
  // })
  //
  // L.heatLayer(pts, {radius: 3, blur: 2}).addTo(map);

  // TODO:
  // - test animation while inserting nodes in leaflet [x]
  // - restrict panning using maxBounds [x]
  // - improve pan performance at higher zoom level by transforming data into heatmap(can we precalculate this?)[x]
  // - pre-parse lat lng out [x]
  // - find tight clusters with dbscan. visualize.
  // - see if we can find nearest polyline with turf
  // - load data into r tree to -
  // - improve pan performance at lower levels - only load adjacent data
  // - update tile map to use simpler, more unobstrusive tiles


  // makeHighways(map);
}

const test_basket_coords = [40.7213330173902, -73.9775556361144] as L.LatLngTuple;
const nyc_center = [40.730610, -73.935242] as L.LatLngTuple;

let pt = [40.65380800035172, -73.853205] as L.LatLngTuple;
setupLeaflet(nyc_center);
//setupLeaflet([40.648975100351116,-73.838399]);

