const mongoose = require('mongoose');
const DBURL = process.env.MONGODB_URI;
module.exports = {
	connectDatabase:async () => {
		try {
			const options = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				//useCreateIndex: true,
				//useFindAndModify: false
			};
			const connection = await mongoose.connect(DBURL, options);
			mongoose.Promise = global.Promise;
			if(connection) console.log('Database Connected Successfully...');
		  } catch (err) {
			console.log('Error while connecting database\n');
			console.log(err);
			// Exit process with failure
			process.exit(1);
		  }
	},
	printRequestLogger:async (req,res,next) => {
		const _query = req.query;
		const _params = req.params;
		const _body = JSON.parse(JSON.stringify(req.body));
		const _files = req.files;

		console.log('\x1b[36m%s\x1b[0m','\n##############################################');
		console.log('METHOD       :', req.method);
		console.log('HEADER       :', req.headers['user-agent']);
		console.log('URL          :', req.originalUrl);
		console.log('DATE TIME    :', new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}));
		if(!isEmptyObject(_query)) {
			console.log('\nQUERY  : ');
			console.log(_query);
		}
		if(!isEmptyObject(_params)) {
			console.log('\nPARAMS : ');
			console.log(_params);
		}
		
		if(!isEmptyObject(_body)) {
			console.log('\nBODY   : ');
			console.log(_body);
		}
		
		if(_files && _files.length > 0) {
			console.log('\nFILES  : ');
			console.log(_files);
		}
		console.log('\x1b[36m%s\x1b[0m','\n##############################################');
		next();
	}
}

function isEmptyObject(value) {
	return Object.keys(value).length === 0 && value.constructor === Object;
}