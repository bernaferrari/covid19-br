#!/usr/bin/env python
# coding: utf-8

# In[3]:


import pandas as pd
df = pd.read_csv("caso_full.csv")
print(df.columns)


# In[6]:


states = df[df.place_type.eq("state")]
states = states[["date", "state", "last_available_confirmed", "last_available_deaths", "last_available_confirmed_per_100k_inhabitants"]]
states = states.rename(columns={"last_available_confirmed": "confirmed", "last_available_deaths": "deaths", "last_available_confirmed_per_100k_inhabitants": "confirmed_per_100k_inhabitants"})

states.to_csv("../public/data/states.csv", index=False, header=True, float_format="%.0f")
print(states.head())


# In[ ]:




