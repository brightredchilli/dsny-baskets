import { drawPoints } from "../util/drawing";
import { Map, circle } from 'leaflet';
import { LatLng, LatLngBoundsLiteral, LatLngLiteral } from 'src/types/latlng';
import type { DSNYBasket } from 'src/assets/inventory_clean.csv.d.ts';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { DSNY_COLOR } from "./styles";

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

const drawNaivePoints = async function(arr: LatLngLiteral[], map: Map) {
  console.log(arr.length);
  arr.forEach(({ lat, lng }) => {
    circle([lat, lng], {
      color: DSNY_COLOR,
      weight: 0.1,
      // fillColor: '#f03',
      radius: 0.001
    }).addTo(map);
  });
}

const drawSlowPoints = async function(arr: LatLngLiteral[], _map: Map) {
  // let container = map.getPane('overlayPane')!;
  // const svg = document.createElement('svg') as unknown as SVGSVGElement;
  // container.appendChild(svg);
  // svg.setAttribute('width', '400');
  // svg.setAttribute('height', '400');
  // svg.setAttribute('viewBox', '0 0 400 400');
  // svg.classList.add('leaflet-zoom-animated');
  let svg = document.querySelector('.leaflet-overlay-pane svg')!
  for (let _ of arr) {
    const c = document.createElement('path');
    c.classList.add('leaflet-interactive');
    c.setAttribute('fill', 'red');
    c.setAttribute('d', 'M0 0');
    svg.appendChild(c);
  }
}

export function setupLeaflet(container: HTMLDivElement, center: LatLng, bounds: LatLngBoundsLiteral, inventory: DSNYBasket[]) {
  let rect = container.getBoundingClientRect();
  container.style.height = `${rect.width * 2 / 3}px`; // 3:2 aspect ratio
  // const nyc_bounds = L.latLngBounds([40.38264, -74.31015], [41.14143, -73.22319]);
  let map = L.map(container, {
    maxBounds: [[bounds[0].lat, bounds[0].lng], [bounds[1].lat, bounds[1].lng]],
    maxBoundsViscosity: 0.8
  }).setView(center, 12); // initializes the map, sets zoom & coordinates


  //   L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //  }).addTo(map); //This adds the tile layer to the map. The map dynamically loads tiles based on current view the experience smooth and seamless. Make sure to add attribution to your map.


  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(map);

  drawPoints(inventory, map, DSNY_COLOR).then();
  //drawNaivePoints(inventory, map).then();
  //drawSlowPoints(inventory, map).then();
}

