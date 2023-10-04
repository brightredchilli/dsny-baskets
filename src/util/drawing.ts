import { LatLngLiteral, Map, Bounds, bounds, LatLngBounds, latLngBounds } from 'leaflet';

const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d')!;

const latLngToContainerBounds = function(map: Map, b: LatLngBounds) {
  return bounds(
    map.latLngToContainerPoint(b.getNorthWest()),
    map.latLngToContainerPoint(b.getSouthEast())
  );
}

const getExtent = function(arr: LatLngLiteral[]) {
  let initialBounds = latLngBounds(arr[0], arr[1]!);
  return arr.reduce((bounds, basket) => bounds.extend(basket), initialBounds);
}

const drawPoints = async function(arr: LatLngLiteral[], map: Map, bounds: Bounds) {

  // we will create a a graphic of length whatever, no matter what the map bounds are
  // how this will work is
  // say we want px of 5000;
  const targetWidth = 10000;

  const latLngBounds = getExtent(arr);
  const containerBounds = latLngToContainerBounds(map, latLngBounds);
  const origin = containerBounds.getTopLeft();

  const { x, y } = containerBounds.getSize();
  const width = x;
  const height = y;

  const aspectRatio = height / width;
  const scaleFactor = targetWidth / width;

  canvas.width = targetWidth;
  canvas.height = Math.floor(targetWidth * aspectRatio);
  console.log(`canvas =${canvas.width},${canvas.height}`);
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  let p1 = map.containerPointToLatLng([0, 0]);
  let p2 = map.containerPointToLatLng([0, 1]);

  let pxInMeter = map.distance(p1, p2);
  console.log(`1px is ${pxInMeter}`)

  let radiusInM = 5;
  const radiusInPx = Math.min(Math.ceil(radiusInM/pxInMeter), 1);

  ctx.fillStyle = '#224d0c';
  for (const latlng of arr) {
    const pt = map.latLngToContainerPoint(latlng).subtract(origin).multiplyBy(scaleFactor);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radiusInPx, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  let p = new Promise<string>((resolve, reject) => {
    canvas.toBlob(b => {
      if (b == null) {
        reject('no go');
        return;
      }

      let url = URL.createObjectURL(b)
      console.log('url');
      resolve(url);
    });
  });
  return p;
}

export { drawPoints };
