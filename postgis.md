1. Load the points from inventory_clean.csv into postgres, transforming them from WGS 84(ESPG 4326), to a New York 
specific CRS.

```
\copy baskets(id,type,lat,lng) FROM './src/assets/inventory_clean.csv' DELIMITER ',' CSV HEADER

```

Let's also include nyc census tracts. These are downloaded from here: https://www.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page
These are shp files, so we convert them from shp to geojson using ogr2ogr:


```
# This must first be installed, I think it got installed via gdal related tools
  # nln, new-layer-name, name of the table to create \
  # nlt, new-layer-type, tells the tool to create multi-polygons instead of polygons for the geometry type. \
  # lco stands for layer create option. Names the geometry column(GEOMETRY_NAME), the primary key column(FID), and \
  # PRECISION=no converts numeric values to integers. Assuming census tract data are not floating points, \
  # we set this to NO. \
ogr2ogr \
  -nln nyc_census_tracts \
  -nlt PROMOTE_TO_MULTI \
  -lco GEOMETRY_NAME=geom \
  -lco FID=gid \
  -lco PRECISION=NO \
  Pg:"dbname=osm_db host=localhost user=ying port=5432" \
  /Users/ying/code/viz-notebooks/dsny-baskets/nyct2020_24a/nyct2020.shp

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
