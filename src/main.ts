import './main.css'

import { LatLngBoundsLiteral, LatLng } from 'src/types/latlng';
import { setupLeaflet } from 'src/components/leaflet';
import { setupContainer } from './components/maplibregl';
import inventoryfeaturecollection from 'src/assets/inventory_geojson.json'
import { DSNYBasket } from './types/inventory';
import { measurePerf } from './util/observability';
import { FeatureCollection } from 'geojson';

// const worker = new Worker(new URL('./inventory_worker.ts', import.meta.url), { type: 'module' });
// const obs = measurePerf('worker load')
//
// const inventoryPromise: Promise<DSNYBasket[]> = new Promise((resolve, reject) => {
//   worker.onmessage = (e: MessageEvent<DSNYBasket[]>) => {
//     obs()
//     resolve(e.data)
//   }
//   worker.onmessageerror = e => {
//     reject(e)
//   }
// })

document.querySelector<HTMLDivElement>('body')!.innerHTML
  = `
  <div class="bg-white dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-50">
    <div class='w-full mx-auto'>
      <div id="container" class="absolute h-screen w-screen">
      </div>

      <div class="bg-white/75 absolute top-0 bottom-0 w-1/5 p-4 m-4">
        <h1 class='text-2xl pt-2 mb-5'>
          DSNY Wastebasket Location Explorer
        </h1>
        <div class="">
          <p>
            The Department of Sanitation of New York maintains a database of all available trash cans, which is available <a class="text-sky-600" href="https://data.cityofnewyork.us/Environment/DSNY-Litter-Basket-Inventory/8znf-7b2c/about_data">here</a>).
          <p>
        </div>
      </div>

    </div>
  </div>
`

// const nyc_center: LatLng = { lat: 40.730610, lng: -73.935242 }
// const nyc_bounds: LatLngBoundsLiteral = [{ lat: 40.38264, lng: -74.31015 }, { lat: 41.14143, lng: -73.22319 }]

// better bounds for the 'sidebar' design
const nyc_center: LatLng = { lat: 40.730610, lng: -73.949242 }
const nyc_bounds: LatLngBoundsLiteral = [{ lat: 40.38264, lng: -74.33015 }, { lat: 41.14143, lng: -73.22319 }]

// parse the csv in a worker thread, and return the results in a promise
let container = document.getElementById("container") as HTMLDivElement;
// setupLeaflet(container, nyc_center, nyc_bounds, inventory);
setupContainer(container, nyc_center, nyc_bounds, inventoryfeaturecollection as FeatureCollection);
