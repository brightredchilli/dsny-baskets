import { Map, bounds, LatLngBounds, latLngBounds, imageOverlay } from 'leaflet';
import { Color } from 'maplibre-gl';
import { LatLngLiteral } from 'src/types/latlng';

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

const drawPoints = async function(arr: LatLngLiteral[], map: Map, color: string) {

  // we will create a a graphic of length whatever, no matter what the map bounds are
  // how this will work is
  let targetWidth = 10000;
  let radiusInM = 50;

  // mobile safari and chrome crap out if image size is too big
  if (isMobileClient()) {
    targetWidth = 4000;
    radiusInM = 10;
  }


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
  console.log(`canvas size = ${canvas.width * canvas.height}`)
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  const p1 = map.containerPointToLatLng([0, 0]);
  const p2 = map.containerPointToLatLng([0, 1]);

  const pxInMeter = map.distance(p1, p2);

  const radiusInPx = Math.max(Math.ceil(radiusInM / pxInMeter), 1);

  console.log(`px in meter = ${pxInMeter}`)
  console.log(`radius in px = ${radiusInPx}`)

  ctx.fillStyle = color; '#306e10';//'#224d0c';
  for (const latlng of arr) {
    const pt = map.latLngToContainerPoint(latlng).subtract(origin).multiplyBy(scaleFactor);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radiusInPx, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  console.log(`done`)

  let p = new Promise<string>((resolve, reject) => {
    // dataurl is supported on mobile safari, but toBlob is not
    let url = canvas.toDataURL();
    if (url != null) {
      imageOverlay(url, latLngBounds).addTo(map);
      resolve(url);
    } else {
      reject('no image generated');
    }

    // canvas.toBlob(b => {
    //   if (b == null) {
    //     reject('no go');
    //     return;
    //   }
    //
    //   let url = URL.createObjectURL(b)
    //   imageOverlay(url, latLngBounds).addTo(map);
    //   resolve(url);
    // });
  });
  return p;
}


const isMobileClient = () => {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  return iOS && webkit
}


export { drawPoints };
