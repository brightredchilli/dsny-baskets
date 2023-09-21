import './main.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter'
import inventory from './DSNY_Litter_Basket_Inventory.csv'

import * as d3 from 'd3';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet.heat';

document.querySelector<HTMLDivElement>('body')!.innerHTML = `

  <div id="leafletcontainer" class="md:container mx-auto">

  </div>
  <div id="thecontainer" class="md:container mx-auto">
    <p>hello</p>
  </div>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>

`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

function setupLeaflet() {
  let container  = document.getElementById("leafletcontainer") as HTMLDivElement;
  let rect = container.getBoundingClientRect();
  container.style.height = `${rect.width * 2/3}px`; // 3:2 aspect ratio


  const nyc_center = [40.730610, -73.935242] as L.LatLngTuple
  const nyc_bounds = L.latLngBounds([40.38264, -74.31015],[41.14143, -73.22319]);
  let map = L.map(container, { maxBounds: nyc_bounds, maxBoundsViscosity: 0.8 })
    .setView(nyc_center, 11.5); // initializes the map, sets zoom & coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map); //This adds the tile layer to the map. The map dynamically loads tiles based on current view the experience smooth and seamless. Make sure to add attribution to your map.

  // L.svg().addTo(map)// we have to make the svg layer clickable
  // let svg = map.getPanes().overlayPane.querySelector('svg') ;
  //

  // inventory.slice(0,1000).forEach(x => {
  //   let m = x.point.match(/POINT \((.*) (.*)\)$/) ?? []
  //   let lng = Number(m[1])
  //   let lat = Number(m[2])
  //
  //   let c = L.circle([lat, lng], 1);
  //   c.addTo(map);
  //   let e = c.getElement() as HTMLElement
  //   e.classList.add("fadein");
  //   e.style.animationDuration = `${Math.random() * 2}s`
  // });
  //
  let points = inventory.map(x => {
    let m = x.point.match(/POINT \((.*) (.*)\)$/) ?? [];
    let lng = Number(m[1]);
    let lat = Number(m[2]);


    return [lat, lng, 5] as L.HeatLatLngTuple;
  })

  L.heatLayer(points, {radius: 5}).addTo(map);


  // TODO:
  // - test animation while inserting nodes in leaflet [x]
  // - restrict panning using maxBounds [x]
  // - improve pan performance at higher zoom level by transforming data into heatmap(can we precalculate this?)
  // - load data into r tree to -
  // - improve pan performance at lower levels
  // - update tile map to use simpler, more unobstrusive tiles
}

console.log(inventory[0]);
console.log(inventory[0].BASKETID)
let rect = document.getElementById("thecontainer")!.getBoundingClientRect()
let canvas = d3.select("#thecontainer").append<HTMLCanvasElement>("canvas");

canvas
  .attr("width", rect.width)
  .attr("height", rect.width * (2/3)); // 3:2 aspect ratio


setupLeaflet();

