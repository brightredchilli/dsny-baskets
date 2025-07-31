
import { StyleSpecification } from "maplibre-gl"

// Inlined here because it doesn't change, and because I think this asset can be served up quicker.
// Can be updated with:
// curl https://api.maptiler.com/maps/777daf37-50e3-4c3c-a645-c13a66e712e3/style.json\?key\=b4p171PlFelOVzmDP7eS | jq > src/assets/maptilerstyle.json
import stylejson from 'src/assets/maptilerstyle.json'


// Tried to also inline tiles.json because that takes a long time to load, but it fails a runtime check within maplibregl.js
// So instead of inlining the json, I serve it up from cloudfront instead, where it is considerably quicker, and it is replaced below.
// this can be updated like so:
// URL="$(cat src/assets/maptilerstyle.json | jq --raw-output '.sources.maptiler_planet.url')"; curl $URL | jq > src/assets/maptilejson.json
import inlineTileUrl from 'src/assets/maptilejson.json?url'

const style = stylejson as StyleSpecification
const source = style.sources["maptiler_planet"]
if ("url" in source) {
  source.url = inlineTileUrl
}
export default style
