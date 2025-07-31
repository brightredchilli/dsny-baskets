import { LatLngBoundsLiteral, LatLngExpression } from 'src/types/latlng';
import type { DSNYBasket } from 'src/types/inventory';

import { StyleSpecification, Map, SourceSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Feature, FeatureCollection } from 'geojson';
import { DSNY_COLOR } from './styles';

import { convertBasketsToFeatureCollection } from 'src/util/model';


function addPoints(points: SourceSpecification, map: Map) {
  map.addSource('baskets', points)
  map.addLayer({
    'id': 'baskets',
    'type': 'circle',
    'source': 'baskets',
    'paint': {
      'circle-color': DSNY_COLOR,
      'circle-radius': 1.2,
      'circle-opacity': 0.5
    }
  });

  map.addLayer({
    'id': 'baskets-zoomed-1',
    'type': 'circle',
    'source': 'baskets',
    'minzoom': 13,
    'paint': {
      'circle-color': DSNY_COLOR,
      'circle-radius': 2,
      'circle-opacity': 0.5
    }
  });

  map.addLayer({
    'id': 'baskets-zoomed-2',
    'type': 'circle',
    'source': 'baskets',
    'minzoom': 14,
    'paint': {
      'circle-color': DSNY_COLOR,
      'circle-radius': 2.5,
      'circle-opacity': 0.8
    }
  });

  map.addLayer({
    'id': 'baskets-zoomed-3',
    'type': 'circle',
    'source': 'baskets',
    'minzoom': 15,
    'paint': {
      'circle-color': DSNY_COLOR,
      'circle-radius': 3,
      'circle-opacity': 0.8
    }
  });
}

function convertBasketsToSource(arr: DSNYBasket[]): SourceSpecification {
  return {
    type: 'geojson',
    data: convertBasketsToFeatureCollection(arr)
  };
}

function getSourceSpecification(fc: FeatureCollection): SourceSpecification {
  return {
    type: 'geojson',
    data: fc
  };
}

export function setupContainer(container: HTMLDivElement, center: LatLngExpression, bounds: LatLngBoundsLiteral, inventory: Promise<DSNYBasket[]> | FeatureCollection) {
  // let rect = container.getBoundingClientRect();
  // container.style.height = `${rect.width * 2 / 3}px`; // 3:2 aspect ratio

  const map = new Map({
    container: container, // container id
    // style: 'https://demotiles.maplibre.org/style.json', // style URL
    style: "https://api.maptiler.com/maps/777daf37-50e3-4c3c-a645-c13a66e712e3/style.json?key=b4p171PlFelOVzmDP7eS",
    // style: style,
    center: center, // starting position [lng, lat]
    zoom: 11, // starting zoom
    maxBounds: [bounds[0], bounds[1]]
  });


  if (inventory instanceof Promise) {
    const pointsPromise = inventory.then(i => convertBasketsToSource(i))
    map.on('load', () => {
      pointsPromise.then(p => addPoints(p, map))
    })
  } else {
    map.on('load', () => {
      addPoints(getSourceSpecification(inventory), map)
    })
  }

}
