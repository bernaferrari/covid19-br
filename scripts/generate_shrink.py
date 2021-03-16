import pandas as pd

df = pd.read_csv("caso_full.csv")
df = df.rename(
    columns={"last_available_confirmed": "confirmed", "last_available_deaths": "deaths"}
)
df = df[df.is_last.eq(True)]
df = df[df.place_type.eq("state")]
df = df[["state", "date", "confirmed", "deaths"]]
df.to_csv("../public/caso_shrink.csv", index=False)
