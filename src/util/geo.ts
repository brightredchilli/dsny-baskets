import { json, text } from "d3";
import { LatLngExpression } from 'leaflet';
import matchesUrl from '../assets/matches.geojson' 
import Wkt from './wicket';

import { geoJson } from 'leaflet';

async function makeHighways(map: L.Map) {
  try {
    let features: any = await json(matchesUrl);
    const style: L.PathOptions = {
      weight: 1
    }
    for (const f of features) {
      geoJson(f, { style }).addTo(map);
    }
  }
  catch(e: unknown) {
    alert('error fetching geojson lines');
  }
}

const polygonPoints = async function(url: string): Promise<LatLngExpression[] | LatLngExpression[][]> {
  let wkt = new Wkt();
  let t = await text(url);
  wkt.read(t);

  return wkt.toPoints()
}

const arrayWkt = async function(url: string): Promise<LatLngExpression[][]> {
  let wkt = new Wkt();
  let arr = await json<any[]>(url);
  if (arr == null) {
    throw 'not allowed';
  }

  let pointsArray = arr.map(t => {
    wkt.read(t);
    return wkt.toPoints();
  })

  return pointsArray;
}

export { makeHighways, polygonPoints, arrayWkt };
