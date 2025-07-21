export type LatLng = {
  lat: number;
  lng: number;
};


export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export type LatLngTuple = [number, number];

export type LatLngExpression = LatLng | LatLngLiteral | LatLngTuple;

export type LatLngBoundsLiteral = LatLngExpression[];
