#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import requests

url = "https://data.brasil.io/dataset/covid19/caso_full.csv.gz"
with open("caso_full.csv.gz", "wb") as f:
    r = requests.get(url)
    f.write(r.content)


# In[ ]:


import gzip
import shutil
with gzip.open('caso_full.csv.gz', 'rb') as f_in:
    with open('caso_full.csv', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

