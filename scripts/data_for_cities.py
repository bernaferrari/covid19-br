#!/usr/bin/env python
# coding: utf-8

# In[3]:


# import requests

# url = "https://data.brasil.io/dataset/covid19/caso_full.csv.gz"
# with open("caso_full.csv.gz", "wb") as f:
#     r = requests.get(url)
#     f.write(r.content)


# In[4]:


# import gzip
# import shutil
# with gzip.open('caso_full.csv.gz', 'rb') as f_in:
#     with open('caso_full.csv', 'wb') as f_out:
#         shutil.copyfileobj(f_in, f_out)


# In[5]:


import pandas as pd

df = pd.read_csv("caso_full.csv")
df = df.rename(columns={"last_available_confirmed": "confirmed", "last_available_deaths": "deaths"})
df = df[~df.city_ibge_code.isnull()]
df = df.astype({"city_ibge_code": int})
print(df)


# In[6]:


import numpy as np

def retrieve_data_for_all_cities(state):
   # filter out states and imported cases
   test = df[df.place_type.eq("city")]
   if (state == True):
      test = test[test.state.eq("PR")]
   
   all_codes = test[test.place_type.eq("city")]["city_ibge_code"].unique()

   test = test[["city_ibge_code", "date", "confirmed", "deaths"]]
   by_dates = [city for city in test.groupby('date')]

   for i in range(len(by_dates)):
      date, items = by_dates[i]

      # del items["date"]

      # convert all ibge codes to a Series
      pd_codes = pd.Series(all_codes)

      # retrieve all cities which are not in items
      not_in_list = pd_codes[~pd_codes.isin(items['city_ibge_code'])]

      # create a new DataFrame with the missing cities. This is a lot faster than using pd.concat.
      simple_list = []
      for ibge in not_in_list:
         simple_list.append([ibge, date, np.nan, np.nan])
      
      new_data = pd.DataFrame(simple_list, columns=['city_ibge_code', 'date', 'confirmed', 'deaths'])

      # merge together both DataFrames
      items = items.append(new_data, ignore_index=True)

      # save back the values
      by_dates[i] = [date, items]
   return by_dates


# In[7]:


def retrieve_data_fixed(state, steps=-7):
  fixed_data = retrieve_data_for_all_cities(state)
  
  # add zero to first element. This will be propagated in the for loop.
  fixed_data[0][1][['confirmed', 'deaths']] = fixed_data[0][1][['confirmed', 'deaths']].fillna(0)

  for i in range(1, len(fixed_data)):
    date, items = fixed_data[i]
    prev_date, prev_items = fixed_data[i - 1]

    # fill missing cities with previous value
    # items['confirmed'] = items['confirmed'].fillna(prev_items['confirmed'])
    items = items.fillna(prev_items)

    # re-override the date column, since prev_items messed with it
    items["date"] = date

    # fill remaining with zero
    fixed_data[i] = [date, items]


  smaller_date = []
  for i in range(len(fixed_data) - 1, -1, steps):
      date, items = fixed_data[i]
      items = items.astype({"confirmed": int, "deaths": int})
      items = items.sort_values(by='city_ibge_code', ascending=True)
      smaller_date.append([date, items])
  return smaller_date


# In[8]:


def to_csv(pr, name):
    pr_df = retrieve_data_fixed(pr)
    a = ""

    for i in range(len(pr_df)):
        date, items = pr_df[i]
        items = items.rename(columns={"city_ibge_code": "z", "confirmed": "c", "deaths": "d"})
        items = items[["date", "z", "c", "d"]]
        # if (not pr):
            # limit the total number
            # items = items.nlargest(3000, 'c')
        a += items.to_csv(header= i==0, index=False)
        pr_df[i] = [date, items]

    with open(name, 'w') as outfile:
        outfile.write(a)


# In[9]:


def to_heatmap_csv(pr, name):
    pr = retrieve_data_fixed(pr)

    date, items = pr[0]
    items = items.rename(columns={"city_ibge_code": "z", "confirmed": "c", "deaths": "d"})
    items = items[["z", "c"]]
    items = items.to_csv(name, index = False, header=True)


# In[10]:


to_csv(True, "../public/data/pr_ndays.csv")
to_csv(False, "../public/data/br_ndays.csv")

to_heatmap_csv(True, "../public/data/pr_heatmap.csv")
to_heatmap_csv(False, "../public/data/br_heatmap.csv")


# In[12]:


pr_df = retrieve_data_fixed(True, -1)
test = df[df.place_type.eq("city")]
test = test[test.state.eq("PR")]

top_pr_cities = test.sort_values('confirmed', ascending=False).drop_duplicates('city_ibge_code').head(8).sort_values('confirmed', ascending=False)['city_ibge_code']

by_dates = [city for city in test.groupby('date')]

a = ""
for i in range(len(by_dates)):
    date, items = pr_df[i]
    items = items.rename(columns={"city_ibge_code": "z", "confirmed": "c", "deaths": "d"})
    items = items[["date", "z", "c", "d"]]
    items = items[items["z"].isin(top_pr_cities)]

    a += items.to_csv(header= i==0, index=False)
    pr_df[i] = [date, items]

with open("../public/data/pr_topcities_alldays.csv", 'w') as outfile:
    outfile.write(a)


# In[ ]:




