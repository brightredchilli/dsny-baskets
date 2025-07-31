import { Feature, FeatureCollection } from "geojson";
import { DSNYBasket } from "src/types/inventory";

export function convertBasketToFeature(c: DSNYBasket): Feature {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [c.lng, c.lat] // GeoJSON uses [lng, lat]
    },
    properties: {}
  };
}

export function convertBasketsToFeatureCollection(arr: DSNYBasket[]): FeatureCollection {
  let a = arr.map(convertBasketToFeature)
  console.log(a.length)
  return {
    type: 'FeatureCollection',
    features: a
  };
}

