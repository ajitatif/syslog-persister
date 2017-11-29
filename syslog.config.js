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