import numpy as np
import xarray as xr

year = 1958
latStep = 10
lonStep = 10

file = f'../../data/raw/terraclimate/TerraClimate_tmax_{year}.nc'
ds = xr.open_dataset(file)

print('year,month,lat,lon,tmax')

for i in range(1, 13):
  month = f'{i:02}'
  da = ds.tmax.sel(time=f'{year}-{month}-01')

  for lat in range(90, -90, -latStep):
    for lon in range(-180, 180, lonStep):
      v = da.sel(
        lat=slice(lat, lat-latStep),
        lon=slice(lon, lon+lonStep)
      ).values.flatten()

      clean = [x for x in v if ~np.isnan(x)]
      if len(clean) > 0: # there is data!
        avg = sum(clean) / len(clean)
        print(f'{year},{i},{lat},{lon},{avg}')
