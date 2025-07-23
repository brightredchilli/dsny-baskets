# README

This project visualizes the locations of DSNY waste baskets in NYC. The project uses a client side
leaflet library for map display.


# Setup

Requirements
- brew
- asdf

```
asdf install nodejs ...
asdf set --home nodejs <version>
corepack enable
corepack install --global yarn@stable
asdf reshim nodejs
yarn install
```

Run the dev server at localhost:5173.
```
yarn dev 
```

Bundle for production distribution.
```
yarn build

# This script requires AWS credentials to be set - they are provided by op cli on my machine
op run -- yarn deploy
```

# Obtaining and cleaning data

To be able to update the data for the project, follow instructions in [datasets.md](datasets.md)

In the process of researching this, an initial attempt was made to simplify points by
clustering and other downsampling techniques which were eventually abandoned.
These used PostGIS and the setup is documented at:
[postgis.md](postgis.md).


# TODO

instructions for obtaining data.


