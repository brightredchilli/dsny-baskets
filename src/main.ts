import './main.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter'
import inventory from './DSNY_Litter_Basket_Inventory.csv'

import * as d3 from 'd3';
import { select } from 'd3';

document.querySelector<HTMLDivElement>('body')!.innerHTML = `

  <div id="thecontainer" class="md:container md:mx-auto px-50">
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

console.log(inventory[0]);
console.log(inventory[0].BASKETID)
let rect = document.getElementById("thecontainer")!.getBoundingClientRect()

let canvas = d3.select("#thecontainer").append<HTMLCanvasElement>("canvas");
canvas
  .attr("width", rect.width)
  .attr("height", rect.width * (2/3)); // 3:2 aspect ratio

