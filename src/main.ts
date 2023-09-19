import './main.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter'
import inventory from './DSNY_Litter_Basket_Inventory.csv'

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

console.log(inventory[0]);

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
