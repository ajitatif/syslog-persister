# Syslog Persister

*__Disclaimer: This is my first NodeJS project!__*

Syslog persister is a lightweight log persister listening on UDP. It is configured with a syslog.config.js file, whose sample can be found in the repo. The messages are stored into MongoDB

## Usage

`node main [--config=configfile]`

* Default configuration file is `syslog.config.js`

## Configuration

```json
  {
    "server": {
      "port": 5140
    },
    "mongo": {
      "url": "mongodb://1.1.1.100:27017,1.1.1.100:27117/workshop?replicaSet=wsrepl;haInterval=1000",
      "collection": {
        "name": "syslog",
        "index": "ix_message"
      }
    }
  }
```


## TO-DO

* Mongo's *ensureIndex* method had beed deprecated, should use *createIndexes* instead.
* Mongo cannot save keys which contain dots, should normalize the keys

## License

MIT