import './main.css'
import inventory from './assets/inventory_clean.csv'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { drawPoints } from './util/drawing';

document.querySelector<HTMLDivElement>('body')!.innerHTML = `
  <div class="bg-white dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-50">
    <div class='container max-w-screen-lg px-10 mx-auto'>
      
      <h1 class='text-4xl text-left pt-12 mb-5'>
        How is easy is it for you to keep your city clean?
      </h1>

      <div class="sm:grid sm:grid-cols-12 gap-x-4">
        <div class="col-span-6">
          <p>
            The following is a visualization of the locations of litter baskets maintained by the
            Department of Sanitation of New York. Find the nearest trash can near you!
          <p>
        </div>
        <div id="leafletcontainer" class="col-span-6">
        </div>
      </div>
    </div>
  </div>
`

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

function setupLeaflet(center: L.LatLngTuple) {
  let container  = document.getElementById("leafletcontainer") as HTMLDivElement;
  let rect = container.getBoundingClientRect();
  container.style.height = `${rect.width * 2/3}px`; // 3:2 aspect ratio

  const nyc_bounds = L.latLngBounds([40.38264, -74.31015], [41.14143, -73.22319]);
  let map = L.map(container, {
    maxBounds: nyc_bounds,
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
}

const nyc_center = [40.730610, -73.935242] as L.LatLngTuple;
setupLeaflet(nyc_center);
