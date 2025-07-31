import inventoryURL from './assets/inventory_clean.csv?url'
import { csvParse } from './util/csv';
import { measurePerf } from './util/observability';

/// This webworker starts immediately upon load, downloads the csv and parses it into an array
/// Not using "onmessage" to start the worker, so that this worker can execute immediately upon
/// being loaded.

/// <reference lib="webworker" />
let obs = measurePerf('csv')
const res = await csvParse(inventoryURL);
self.postMessage(res);
obs()
