
# Collecting datasets

There are several datasets used in this project.


## DSNY wastebaskets

Download the asset from:
https://data.cityofnewyork.us/dataset/DSNY-Litter-Basket-Map-/d6m8-cwh9

Move it to the data/inventory.csv

Then run

```
yarn dsny
```


## Get all the roads in nyc

First, run this command in Overpass Turbo:

```
[out:json][timeout:25];

(
  way["highway"="footway"]({{bbox}});
  way["footway"="sidewalk"]({{bbox}});
);

(
  ._;
  >;
);
out skel;
```

Make sure the map is centered in nyc and covers the 5 boros.


Export and download and move to data/nyc_footpaths.geojson

Then run:
```
osmium cat data/nyc_footpaths.osm --output data/nyc_footpaths.osm.pbf

```

1. Then load the pbf file into

```
osm2pgsql -c -d osm_db -H localhost -S scripts/osm2pgsql_style.lua data/nyc_footpaths.osm.pbf
```




## Script to spin up a postgres server for data analysis?
