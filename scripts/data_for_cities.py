#!/usr/bin/env python
# coding: utf-8

# In[88]:


# import requests

# url = "https://data.brasil.io/dataset/covid19/caso_full.csv.gz"
# with open("caso_full.csv.gz", "wb") as f:
#     r = requests.get(url)
#     f.write(r.content)


# In[90]:


# import gzip
# import shutil
# with gzip.open('caso_full.csv.gz', 'rb') as f_in:
#     with open('caso_full.csv', 'wb') as f_out:
#         shutil.copyfileobj(f_in, f_out)


# In[92]:


import pandas as pd

df = pd.read_csv("caso_full.csv")
df = df.rename(columns={"last_available_confirmed": "confirmed", "last_available_deaths": "deaths"})
df = df[~df.city_ibge_code.isnull()]
df = df.astype({"city_ibge_code": int})
print(df)


# In[10]:





# In[94]:


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

      del items["date"]

      # convert all ibge codes to a Series
      pd_codes = pd.Series(all_codes)

      # retrieve all cities which are not in items
      not_in_list = pd_codes[~pd_codes.isin(items['city_ibge_code'])]

      # create a new DataFrame with the missing cities. This is a lot faster than using pd.concat.
      simple_list = []
      for ibge in not_in_list:
         simple_list.append([ibge, np.nan, np.nan])

      new_data = pd.DataFrame(simple_list, columns=['city_ibge_code', 'confirmed', 'deaths'])

      # merge together both DataFrames
      items = items.append(new_data, ignore_index=True)

      # save back the values
      by_dates[i] = [date, items]
   return by_dates


# In[96]:


def retrieve_data_fixed(state):
  fixed_data = retrieve_data_for_all_cities(state)
  
  # add zero to first element. This will be propagated in the for loop.
  fixed_data[0][1][['confirmed', 'deaths']] = fixed_data[0][1][['confirmed', 'deaths']].fillna(0)

  for i in range(1, len(fixed_data)):
    date, items = fixed_data[i]
    prev_date, prev_items = fixed_data[i - 1]

    # fill missing cities with previous value
    items[items['confirmed'].isnull()] = prev_items

    # fill remaining with zero
    fixed_data[i] = [date, items]
  
  smaller_date = []
  for i in range(len(fixed_data) - 1, -1, -7):
    date, items = fixed_data[i]
    items = items.astype({"confirmed": int, "deaths": int})
    items = items.sort_values(by='city_ibge_code', ascending=True)
    smaller_date.append([date, items])

  return smaller_date         


# In[133]:


def to_json(pr, name):
    import collections
    import json

    pr_df = retrieve_data_fixed(pr)
    a = []

    for i in range(len(pr_df)):
        date, items = pr_df[i]
        items = items.rename(columns={"city_ibge_code": "z", "confirmed": "c", "deaths": "d"})
        # if (not pr):
            # limit the total number
            # items = items.nlargest(3000, 'c')
        items = json.loads(items.to_json(orient="records"))
        pr_df[i] = [date, items]

    a = collections.OrderedDict(pr_df)
    with open(name, 'w') as outfile:
        json.dump(a, outfile)


# In[134]:


def to_heatmap_json(pr, name):
    import collections
    import json

    pr = retrieve_data_fixed(pr)

    date, items = pr[0]
    items = items.rename(columns={"city_ibge_code": "z", "confirmed": "c", "deaths": "d"})
    items = items[["z", "c"]]
    items = items.to_csv(name, index = False, header=True)


# In[136]:


to_json(True, "../public/data/pr_ndays.json")
to_json(False, "../public/data/br_ndays.json")

to_heatmap_json(True, "../public/data/pr_heatmap.csv")
to_heatmap_json(False, "../public/data/br_heatmap.csv")


# In[ ]:




