import { LatLngBoundsLiteral, LatLngExpression } from 'src/types/latlng';
import type { DSNYBasket } from 'src/assets/inventory_clean.csv.d.ts';

import { StyleSpecification, Map, SourceSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Feature, FeatureCollection } from 'geojson';
import { DSNY_COLOR } from './styles';

const style: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'

      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm'
    }
  ]
}

function convertBasketToFeature(c: DSNYBasket): Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [c.lng, c.lat] // GeoJSON uses [lng, lat]
    },
    properties: {}
  };
}

function convertBasketsToFeatureCollection(arr: DSNYBasket[]): FeatureCollection {
  let a = arr.map(convertBasketToFeature)
  console.log(a.length)
  return {
    type: 'FeatureCollection',
    features: a
  };
}

function convertBasketsToSource(arr: DSNYBasket[]): SourceSpecification {
  return {
    type: 'geojson',
    data: convertBasketsToFeatureCollection(arr)
  };
}

export function setupContainer(container: HTMLDivElement, center: LatLngExpression, bounds: LatLngBoundsLiteral, inventory: DSNYBasket[]) {
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

  const points = convertBasketsToSource(inventory)
  map.on('load', () => {
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
  })
}
