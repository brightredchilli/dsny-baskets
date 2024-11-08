
# Postgres setup

We use postgres db as a backend for some data processing, so we need to set it up first:
```
brew install postgresql
brew install postgis
brew install osm2pgsql
brew install osmium
```

Thereafter, postgres can be started using:
```
brew services run postgresql@17 # or follow whatever version
```
Troubleshooting - if postgres doesn't boot, try either doing
```
brew services restart postgresql@17 # or follow whatever version

```

or

```
# removing the pid file associated, then runing the restart command again
rm /opt/homebrew/var/postgresql@17/postmaster.pi
```

These commands then will create the db we will work with:
```
createdb osm_db
psql -d osm_db -c "CREATE EXTENSION postgis;" # enables the postgis extension
```

To connect, just do:
```
psql -d osm_db
```



There are several datasets used in this project.


## DSNY wastebaskets

Download the asset from:
https://data.cityofnewyork.us/dataset/DSNY-Litter-Basket-Map-/d6m8-cwh9

Move it to the data/inventory.csv

Then run

```
yarn dsny
```
Then we need to load the points into the db:
```
drop table if exists baskets;
create table baskets
(id integer, type char(5), lat double precision, lng double precision, geom geometry(POINT, 3857));

create unique index baskets_id_uniq on baskets(id);
create index baskets_geom_uniq on baskets using GIST(geom);
\copy baskets(id,type,lat,lng) FROM './src/assets/inventory_clean.csv' DELIMITER ',' CSV HEADER

update baskets b
set geom = (
  select st_transform(st_setsrid(st_makepoint(b1.lng, b1.lat), 4326), 3857)
  from baskets b1
  where b1.id = b.id
);
```


## Get all the roads in nyc

To get all the roads in nyc:

```
python scripts/fetch_ways.py
```

Then run:
```
osmium cat data/nyc_footpaths.osm --output data/nyc_footpaths.osm.pbf

```

hen load the pbf file into the db

```
osm2pgsql -c -d osm_db -H localhost --output=flex -S scripts/osm2pgsql_style.lua data/nyc_footpaths.osm.pbf
```

## Census tracts

NYC census tract boundaries can be helpful for debugging and visualizing NYC on a map. These are obtained from 
https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page, extracted, then read into a proper 
page.


