-- This config example file is released into the Public Domain.

-- This is a very simple Lua config for the Flex output not intended for
-- real-world use. Use it do understand the basic principles of the
-- configuration. After reading and understanding this, have a look at
-- "geometries.lua".

-- For debugging
-- inspect = require('inspect')

-- The global variable "osm2pgsql" is used to talk to the main osm2pgsql code.
-- You can, for instance, get the version of osm2pgsql:
print('osm2pgsql version: ' .. osm2pgsql.version)

-- A place to store the SQL tables we will define shortly.
local tables = {}

tables.nodes = osm2pgsql.define_node_table('nodes', {
    -- { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'point', not_null = true }, -- will be something like `GEOMETRY(Point, 4326)` in SQL
})

tables.ways = osm2pgsql.define_way_table('ways', {
    { column = 'geom', type = 'linestring', not_null = true },
})

-- Debug output: Show definition of tables
for name, dtable in pairs(tables) do
    print("\ntable '" .. name .. "':")
    print("  name='" .. dtable:name() .. "'")
--    print("  columns=" .. inspect(dtable:columns()))
end

-- Called for every node in the input. The `object` argument contains all the
-- attributes of the node like `id`, `version`, etc. as well as all tags as a
-- Lua table (`object.tags`).
function osm2pgsql.process_node(object)
    --  Uncomment next line to look at the object data:
    -- print(object.id)
    tables.nodes:insert({
        geom = object:as_point()
    })
end

-- Called for every way in the input. The `object` argument contains the same
-- information as with nodes and additionally a boolean `is_closed` flag and
-- the list of node IDs referenced by the way (`object.nodes`).
function osm2pgsql.process_way(object)
    tables.ways:insert({
        geom = object:as_linestring()
    })
end
