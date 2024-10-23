# :zzz: Sleep Health Data Visualisation

A simple 2D line chart visualisation of my sleep data as recorded by my Apple Watch using [Pillow](https://pillow.app/) for iOS.

# Sleep Quality (%)
![quality.png](docs/images/quality.png)

# Deep Sleep (% of session duration)
![deep.png](docs/images/deep.png)

# Light Sleep (% of session duration)
![light.png](docs/images/light.png)

# REM Sleep (% of session duration)
![rem.png](docs/images/rem.png)

# Awake Time (% of session duration)
![awake.png](docs/images/awake.png)

# Session Duration (% of 8 hours)
![duration.png](docs/images/duration.png)

# To Do

- Select multiple sleep metric at once
- A split view that renders stacked charts to compare two metric with a brush
  - Remove duplicate improvements made label?
  - Add brush in the middle
- Split SleepContext into two. Isolate configuration into its own context