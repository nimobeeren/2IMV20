library(auk)
library(lubridate)
library(tidyverse)

# define paths
f_ebd <- "../../app/public/data/ebird/ebd_barswa_1950_2020.txt"
f_export <- "../../app/public/data/ebird/ebd_export.csv"

# read the ebd file (can take a while, don't run on full 300GB dataset)
ebd <- read_ebd(f_ebd)

ebd_export <- ebd %>%
    transmute(
        # get number of days since 1970-01-01 (can be negative)
        date = as.integer(observation_date),
        lat = latitude,
        lon = longitude,
        # set unknown observation counts to 1
        count = as.integer(
            if_else(
                observation_count == "X" | is.na(observation_count),
                "1",
                observation_count
            )
        )
    ) %>%
    # filter out observations outside europe/africa
    filter(-30 < lon & lon < 60) %>%
    # filter out observations with unknown count
    filter(!is.na(count)) %>%
    # sort by ascending date
    arrange(date)

# print info before exporting
glimpse(ebd_export)

# write to file
write.table(ebd_export, f_export, sep=",", row.names = FALSE, col.names = FALSE)
