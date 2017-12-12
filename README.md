# speedtest-monitor

Monitors network download, upload and ping speed via SpeedTest. It will push
the collected stats to one or more publishers (e.g. InfuxDB).

## Publishers

### Simple

Publishes the collected stats to the log or STDOUT. Stats can be formatted as
JSON or key value pair (`key="value"`).

```yaml
publishers:
- type: simple
  options:
    format: string
```

### InfluxDB

Publishes the collected stats to a InfluxDB database.

```yaml
- type: influxdb
  options:
    db: speedtest
    host: 192.168.1.15
    port: 8086
```