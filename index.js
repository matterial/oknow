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
	execute: function(fn, syntheticArgs) {
		var $this = this;
		syntheticArgs = syntheticArgs || [];
		process.nextTick(function() {
			try {
				if (fn) {
					syntheticArgs.unshift(function() {
						$this.next.apply($this, arguments);
					});
					// console.log(syntheticArgs);
					fn.apply(this, syntheticArgs);
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
	valueOf: function() {
		return 100;
	},
	after: function(cb) {
		this.fnStack.push({fn: cb});
		return this;
	},
	next: function() {
		var nextFn = this.fnStack.shift();
		if (nextFn) {
			var args = Array.prototype.slice.call(arguments);
			return this.execute(nextFn.fn, args);
		}
	}
}