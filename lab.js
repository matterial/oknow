require('./index');

var fs = require('fs');

function getPackage(done) {
	fs.readFile('./sample.txt', function read(err, data) {
	    if (err) {
	        throw err;
	    }
	    done(data.toString());
	});
}
function getIgnore(done, result) {
	fs.readFile('./sample2.txt', function read(err, data) {
	    if (err) {
	        throw err;
	    }
	    done(data.toString());
	});
}
function allDone(done, result) {
	console.log(result);
}

getPackage.after(getIgnore).after(allDone);