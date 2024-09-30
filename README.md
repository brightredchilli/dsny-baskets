# README

This project visualizes the locations of DSNY waste baskets in NYC. The project uses a client side
leaflet library for map display.


# Setup

Requirements
- brew
- asdf

```
asdf install nodejs ...
corepack enable
corepack install --global yarn@stable
asdf reshim nodejs
```

Run the dev server at localhost:5173.
```
yarn dev 
```

Bundle for production distribution.
```
yarn build
```

# Obtaining and cleaning data

There are a couple of datasets used for this project, documented below

In the process of researching this, an initial attempt was made to simplify points by
clustering and other downsampling techniques which were eventually abandoned.
These used PostGIS and the setup is documented at:
[postgis.md](postgis.md).



# TODO

run package install and verify things are still working
change outdir from 'docs' to 'dist'

instructions for obtaining data.


