# README

This project visualizes the locations of DSNY waste baskets in NYC. The project uses a client side
leaflet library for map display.


# Setup

Run the dev server at localhost:5173.
```
yarn dev 
```

Bundle for production distribution.
```
yarn build
```


In the process of researching this, an initial attempt was made to simplify points by
showing the roads that they intersected. This used PostGIS and the setup is documented at
[postgis.md](postgis.md).

