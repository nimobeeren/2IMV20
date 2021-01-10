import numpy as np
import xarray as xr
import json

year = 1958
gridStep = 1

file = f'../../data/raw/terraclimate/TerraClimate_tmax_{year}.nc'
ds = xr.open_dataset(file)

data = []

for i in range(1, 13):
  month = f'{i:02}'
  da = ds.tmax.sel(time=f'{year}-{month}-01')
  currLatData = []
  lat = 90
  while lat > -90:
    currLonData = []
    lon = -30
    while lon < 60:
      v = da.sel(
        lat=slice(lat, lat-gridStep),
        lon=slice(lon, lon+gridStep)
      ).values.flatten()

      clean = [x for x in v if ~np.isnan(x)]
      if len(clean) > 0: # there is data!
        avg = sum(clean) / len(clean)
        currLonData += [avg]
      else:
        currLonData += [None]
      lon += gridStep
    clean = [x for x in currLonData if x is not None]
    if len(clean) == 0:
      currLatData += [None]
    else:
      currLatData += [currLonData]
    lat -= gridStep
  
  data = data + [currLatData]

print(json.dumps(data))