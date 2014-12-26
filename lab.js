//oknow(doSetup).then(doExecution).fail(doHandling);
function Promise() {

}
Promise.prototype = {
	fnStack: [],
	execute: function(fn) {
		var $this = this;
		process.nextTick(function() {
			try {
				fn(function() {
					$this.next(arguments);
				});
			} catch(e) {
				console.log(e);
			}
		});
		return this;
	},
	valueOf: function() {
		return 100;
	},
	then: function(cb) {
		this.fnStack.push({fn: cb, args: arguments});
		return this;
	},
	next: function() {
		console.log(this.fnStack.length);
		var nextFn = this.fnStack.shift();
		console.log(this.fnStack.length);
		return this.execute(nextFn.fn);
	}
}
var ran = [];
function nonPromise(callback) {
	setTimeout(function() {
		ran.push('nonPromise');
		callback();
	}, 2000);
}
function nonPromise2(callback) {
	setTimeout(function() {
		ran.push('nonPromise2');
		callback();
	}, 100);
}
function nonPromise3(callback) {
	setTimeout(function() {
		ran.push('nonPromise3');
		callback();
	}, 100);
}
var p = new Promise();
function doLog() {
	console.log("Callback executed");
	console.log(ran);
}

//executing promises via chaining
p.execute(nonPromise).then(nonPromise2).then(nonPromise3).then(doLog);
console.log(typeof p.execute === "function");
console.log(typeof p);