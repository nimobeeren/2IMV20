import numpy as np
import xarray as xr
import json

file = f'../../data/gistemp/gistemp250_GHCNv4.nc'
ds = xr.open_dataset(file)

parsed = {}

for year in range(2019, 2020):
  print(f'Processing {year}')
  parsed[year] = []

  for month in range(1, 13):
    mdata = []
    for lat in range(-89, 89, 2):
      ldata = []
      for lon in range(-179, 179, 2):
        da = ds.sel(
          time=f'{year}-{month:02}',
          lat=lat,
          lon=lon
        ).tempanomaly.values

        if len(da) != 1:
          raise Exception("data must only have one value")

        if np.isnan(da[0]):
          ldata += [""]
        else:
          ldata += [float(da[0])]
      mdata += [ldata]
    parsed[year] += [mdata]

file = open(f'../../app/public/data/gistemp.json', 'w')
file.write(json.dumps(parsed))
