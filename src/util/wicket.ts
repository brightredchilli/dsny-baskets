import { LatLngExpression } from 'leaflet';
// @ts-ignore: Wkt is not typed
import { Wkt } from 'wicket';

type WicketPoint = {
  x: number
  y: number
}

Wkt.prototype.toPoints = function(): LatLngExpression[] | LatLngExpression[][] {
  if (this.type == 'multilinestring') {
    return this.components.map((x: WicketPoint[]) => x.map(y => [y.y, y.x]))
  } else if (this.type == 'linestring') {
    return this.components.map((y: WicketPoint) => [y.y, y.x])
  } else if (this.type == 'polygon') {
    return this.components[0].map((y: WicketPoint) => [y.y, y.x])
  } else {
    throw `type should be (multilinestring|linestring|polygon), got ${this.type}`;
  }
}

export default Wkt;

