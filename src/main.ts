import './main.css'
import inventory from './assets/inventory_clean.csv'

import { LatLngBoundsLiteral, LatLngTuple } from 'src/types/latlng';
import { setupLeaflet } from 'src/components/leaflet';

document.querySelector<HTMLDivElement>('body')!.innerHTML = `
  <div class="bg-white dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-50">
    <div class='container max-w-screen-lg md:px-10 mx-auto'>
      
      <h1 class='text-4xl text-left pt-12 mb-5'>
        How easy is it for you to keep your city clean?
      </h1>

      <div class="pt-4 lg:pr-20">
        <div class="">
          <p>
            The following is a visualization of the locations of litter baskets maintained by the
            Department of Sanitation of New York. Find the nearest trash can near you!
          <p>
        </div>
        <div id="container" class="mt-4">
        </div>
      </div>
    </div>
  </div>
`

const nyc_center = [40.730610, -73.935242] as LatLngTuple;
const nyc_bounds = [[40.38264, -74.31015], [41.14143, -73.22319]] as LatLngBoundsLiteral;
let container = document.getElementById("container") as HTMLDivElement;
setupLeaflet(container, nyc_center, nyc_bounds, inventory);
