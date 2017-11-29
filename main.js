const dgram = require('dgram');
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var options = {};

var configFile = 'syslog.config.js';
var configFileArg = process.argv.filter(arg => arg.startsWith('--config='));
if (configFileArg.length > 0) {
	configFile = configFileArg[configFileArg.length - 1].split('=')[1];
}

console.log(`Reading file ${configFile}`);
fs.readFile(configFile, (error, content) => {
	if (!error) {
		try {
			options = JSON.parse(content);
			console.log(`Connecting to MongoDB instance at ${options.mongo.url}...`);

			mongoClient.connect(options.mongo.url, (error, database) => {

				if (!error) {

					var server = dgram.createSocket('udp4');

					server.on('error', err => {
						
						console.log(`Error occurred: ${err}`);
					});

					server.on('message', (msg, remote) => {
						
						console.log(`${remote.address} : ${msg}`);

						let messageObject = msg.toString();

						try {
							messageObject = JSON.parse(messageObject);
						} catch (exception) {
							// JSON Parse Exception, ignored
						}
			
						database.collection(options.mongo.collection.name, (error, collection) => {
							collection.insertOne({
								timestamp: new Date(),
								sender: remote.address,
								log: messageObject
							}).then(result => {
								console.log(`Message persisted: ${result}`);

								collection.ensureIndex({ message: 'text'}).then(indexName => {
									// do nothing
								}).catch(error => {
									console.log(`Cannot check whether index exists on database: ${error}`);
								});
							}).catch(error => {
								console.log(`Error persisting message: ${error}`);
							});
						});
					});

					server.on('close', () => {

						console.log('Cleaning up...');
						database.close();
						console.log('Server closed');
					});

					console.log('Starting SYSLOG server...')
					server.bind({ port: options.server.port }, () => {
					
						console.log(`Listening on port ${server.address().port}`);
					});
				} else {
					console.error(`Failed to connect: ${error}`);
				}
			});
		} catch (exception) {
			console.error(`Cannot parse file ${configFile} : ${exception}`);
			process.exit(1);
		}
	} else {
		console.error(`Cannot read from file ${configFile} : ${error}`);
		process.exit(1);
	}
});