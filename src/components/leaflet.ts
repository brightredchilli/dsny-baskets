import { drawPoints } from "../util/drawing";
import { LatLngBoundsLiteral, LatLngTuple } from 'src/types/latlng';
import type { DSNYBasket } from 'src/assets/inventory_clean.csv.d.ts';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// async function setUpLine(map: L.Map) {
//   let pointbuffered100 = await polygonPoints('src/util/linestrings/pointbuffered100.txt')
//   L.polygon(pointbuffered100, {opacity: 0.5}).addTo(map);
//
//   let allroads100 = await arrayWkt('src/util/linestrings/allroads100.json')
//   allroads100.forEach(x => L.polyline(x, {color: 'red', opacity: 0.9}).addTo(map));
//
//   let footway100 = await arrayWkt('src/util/linestrings/footway100.json')
//   footway100.forEach(x => L.polyline(x, {color: 'blue', opacity: 0.9}).addTo(map));
//   return;
// }


export function setupLeaflet(container: HTMLDivElement, center: LatLngTuple, bounds: LatLngBoundsLiteral, inventory: DSNYBasket[]) {
  let rect = container.getBoundingClientRect();
  container.style.height = `${rect.width * 2 / 3}px`; // 3:2 aspect ratio
  // const nyc_bounds = L.latLngBounds([40.38264, -74.31015], [41.14143, -73.22319]);
  let map = L.map(container, {
    maxBounds: bounds,
    maxBoundsViscosity: 0.8
  }).setView(center, 12); // initializes the map, sets zoom & coordinates


  //   L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //  }).addTo(map); //This adds the tile layer to the map. The map dynamically loads tiles based on current view the experience smooth and seamless. Make sure to add attribution to your map.


  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(map);

  drawPoints(inventory, map).then();
  //drawNaivePoints(inventory, map).then();
  //drawSlowPoints(inventory, map).then();
}

