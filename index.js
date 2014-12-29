function pCreate(fn) {
	var p = new Promise();
	if (fn) {
		p.execute(fn);
	}
	return p;
}
function Promise() {
	this.fnStack = [];
}
Function.prototype.after = function(fn) {
	var p = pCreate();
	p.execute(this).after(fn);
	return p;
}
Promise.prototype = {
	execute: function(fn, syntheticArgs) {
		var $this = this;
		syntheticArgs = syntheticArgs || [];
		process.nextTick(function() {
			try {
				if (fn) {
					syntheticArgs.unshift(function() {
						$this.next.apply($this, arguments);
					});
					fn.apply(this, syntheticArgs);
					//fn();
				} else {
					syntheticArgs = syntheticArgs || [];
					$this.next.apply(this, syntheticArgs);
				}
			} catch(e) {
				console.log(e);
			}
		});
		return this;
	},
	after: function(cb) {
		this.fnStack.push({fn: cb});
		return this;
	},
	next: function(err) {
		if (err && err.constructor.name === "Error" && this.onCatch) {
			this.onCatch(err);
			return;
		}
		var nextFn = this.fnStack.shift();
		if (nextFn) {
			var args = Array.prototype.slice.call(arguments);
			return this.execute(nextFn.fn, args);
		}
	},
	catch: function(fn) {
		this.onCatch = fn;
	}
}
module.exports = pCreate;