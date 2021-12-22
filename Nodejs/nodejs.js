var fs = require('fs');
var os = require('os');
	if(fs.existsSync('temp')){
		console.log('Directory Exists');
		if(fs.existsSync('temp/new.txt')){
			fs.unlinkSync('temp/new.txt')
		}
		fs.rmdirSync('temp');
	}
	//console.log(JSON.stringify(os));
	console.log(os.uptime() + '\n');
	console.log(os.freemem() + '\n');
	console.log(os.totalmem() + '\n');
	console.log(os.cpus() + '\n');
	console.log(os.release() + '\n');