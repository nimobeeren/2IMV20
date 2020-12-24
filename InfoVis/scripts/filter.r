library(auk)
library(lubridate)
library(sf)
library(gridExtra)
library(tidyverse)
# resolve namespace conflicts
select <- dplyr::select

# load full ebird observation and sampling data
auk::auk_set_ebd_path("../data/ebird/", overwrite = TRUE)
ebd <- auk_ebd("full/ebd_relNov-2020.txt", file_sampling = "sampling/ebd_sampling_relNov-2020.txt")

# specify filters without executing them yet
ebd_filters <- ebd %>%
    auk_species("Barn Swallow") %>% # only observations of Barn Swallows
    auk_date(c("1950-01-01", "2020-12-31")) %>% # only from 1950 and later
    auk_bbox(c(-30, -90, 60, 90)) # only Europe and Africa (longitude between 30W and 60E)

# define output files
output_dir <- "../data/ebird/output"
if (!dir.exists(output_dir)) {
    dir.create(output_dir)
}
f_ebd <- file.path(output_dir, "ebd_barswa_1950_2020.txt")
f_sampling <- file.path(output_dir, "ebd_checklists_1950_2020.txt")

# only run if the files don't already exist
if (!file.exists(f_ebd)) {
    # execute filters and output text files
    # THIS STEP CAN TAKE SEVERAL HOURS
    auk_filter(ebd_filters, file = f_ebd, file_sampling = f_sampling)
} else {
    warning("file already exists")
}
