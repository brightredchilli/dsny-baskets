# Instructions to set up PostGIS + Postgres

1. Install postgres/postgis
```
brew install postgresql
brew install postgis
brew install osm2pgsql
```

Thereafter, postgres can be started using:
```
brew run postgresql@14 # or follow whatever version
```

1. Bootstrap a new postgres db:

```
createdb osm_db
psql -d osm_db -c "CREATE EXTENSION postgis;" # enables the postgis extension
```
1. Load nyc_roads_only.osm.pbf into the postgres db.

```
osm2pgsql -c -d osm_db -H localhost -S /opt/homebrew/opt/osm2pgsql/share/osm2pgsql/default.style "$(pwd)/src/assets/nyc_roads_only.osm.pbf"
```

1. Create a new table to accomodate the basket location data
```
drop table if exists baskets;
create table baskets
(id integer, type char(5), lat double precision, lng double precision, geom geometry(POINT, 3857));

create unique index baskets_id_uniq on baskets(id);
create index baskets_geom_uniq on baskets using GIST(geom);

```

1. Load the points from inventory_clean.csv into postgres, transforming them from WGS 84(ESPG 4326), to a New York specific CRS.

```
\copy baskets(id,type,lat,lng) FROM './src/assets/inventory_clean.csv' DELIMITER ',' CSV HEADER

```

1. Do some data transformation on that data

```
update baskets b
set geom = (
  select st_transform(st_setsrid(st_makepoint(b1.lng, b1.lat), 4326), 3857)
  from baskets b1
  where b1.id = b.id
);

```

1. Use ST_Buffer, ST_Intersection, find the line segments that intersect the circles.


First lets do a sanity check
```
select st_dumppoints(st_buffer(geom, 80)) from baskets limit 1;

select 
	id, 
    array_to_json(array_agg(ARRAY[st_y(pt.geom), st_x(pt.geom)]))
from baskets b, st_dumppoints(st_transform(st_buffer(b.geom, 80), 4326)) pt
group by b.id
limit 1;
```


Now, find the line intersections
```
select 
    --st_astext(st_transform(b.geom, 4326))
    array_agg(st_astext(st_transform(st_intersection(l.way, pt), 4326)))
from 
    baskets b, 
    st_buffer(b.geom, 100) pt
inner join
    planet_osm_line l on st_intersects(l.way, pt)

where
1=1
and b.id = 10330153
and l.highway in ('residential', 'tertiary', 'secondary');
```

Export for visual analysis
```
\copy (
  select 
    json_agg(st_asgeojson(l.*)::json)
  from (
     select st_transform(st_intersection(l.way, pt), 4326), highway 
     from baskets b, st_buffer(b.geom, 100) pt
     inner join planet_osm_line l on st_intersects(l.way, pt)
     where l.highway in ('residential', 'tertiary', 'secondary') 
     limit 10
    ) as l
  where
  1=1
) to './src/assets/matches.geojson'
```
