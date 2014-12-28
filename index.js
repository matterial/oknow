//oknow(doSetup).then(doExecution).fail(doHandling);
function pCreate() {
	return new Promise();
}
function Promise() {

}
Function.prototype.after = function(fn) {
	var p = pCreate();
	p.execute(this).after(fn);
	return p;
}
Promise.prototype = {
	fnStack: [],
	execute: function(fn) {
		var $this = this;
		process.nextTick(function() {
			try {
				if (fn) {
					fn(function() {
						$this.next(arguments);
					});
				} else {
					$this.next(arguments);
				}
			} catch(e) {
				console.log(e);
			}
		});
		return this;
	},
	valueOf: function() {
		return 100;
	},
	after: function(cb) {
		this.fnStack.push({fn: cb, args: arguments});
		return this;
	},
	next: function() {
		var nextFn = this.fnStack.shift();
		if (nextFn)
			return this.execute(nextFn.fn);
	}
}
var ran = [];
function nonPromise(callback) {
	console.log("first");
	setTimeout(function() {
		ran.push('nonPromise');
		callback();
	}, 200);
}
function nonPromise2(callback) {
	console.log("second");
	setTimeout(function() {
		ran.push('nonPromise2');
		callback();
	}, 100);
}
function nonPromise3(callback) {
	console.log("third");
	setTimeout(function() {
		ran.push('nonPromise3');
		callback();
	}, 100);
}
var p = pCreate();

function doLog() {
	console.log("finished");
	// console.log(ran);
}

//executing promises via chaining
// p.execute(nonPromise).after(nonPromise2).after(nonPromise3).after(doLog);



nonPromise.after(nonPromise2).after(nonPromise3).after(doLog);


function test() {
	console.log("A");
}
// test.after(doLog).after(nonPromise3);

