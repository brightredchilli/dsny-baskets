import requests
from tqdm import tqdm


def write_to_file(resp: requests.Response, filepath: str):
    total_size = int(resp.headers.get("content-length", 0))
    block_size = 1024

    with tqdm(total=total_size, unit="B", unit_scale=True) as progress_bar:
        with open(filepath, "wb") as file:
            for data in resp.iter_content(block_size):
                progress_bar.update(len(data))
                file.write(data)

    if total_size != 0 and progress_bar.n != total_size:
        raise RuntimeError("Could not download file")


# This way is crappier, since the bounding box is pretty rough, includes unnecessary elements
# overpassql = """
# [out:xml][timeout:25];
#
# (
#   way["highway"="footway"](40.673982,-74.258939,40.890762,-73.763025);
#   way["footway"="sidewalk"](40.673982,-74.258939,40.890762,-73.763025);
# );
# (
#   ._;
#   >;
# );
# out skel;
# """

# In this query, we get the relation for nyc, map it to an area, then filter in it. Much nicer.
overpassql = """
rel(id:175905);
map_to_area -> .nyc;
(
  way["highway"="footway"](area.nyc);
  way["footway"="sidewalk"](area.nyc);
);
(._;>;);
out;
"""

print("fetching data, takes 10-15 seconds...")
url = "https://overpass-api.de/api/interpreter"
filename = "data/nyc_footpaths.osm"

resp = requests.post(url, data={"data": overpassql}, stream=True)
write_to_file(resp, filename)
