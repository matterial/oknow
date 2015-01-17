/**
 * The wrapper function for spanning new instances
 * @param  {Function} fn Function to run immediately
 * @return {Promise}      Returns the self object for chaining
 */
function pCreate(fn) {
	var p = new Promise();
	/**
	 * If function is passed during initialization, execute it
	 */
	if (fn) {
		p.execute(fn);
	}
	/**
	 * Return newly created instance for chaining
	 */
	return p;
}
/**
 * Create the promise object and initialize non-static variables
 */
function Promise() {
	this.fnStack = [];
}
/**
 * Extend default JavaScript functions to execute self and then add a next callback
 * @param  {Function} fn The function to be called after calling self
 * @return {Promise}     Returns a new Promise object ready for chaining
 */
Function.prototype.after = function(fn) {
	var p = pCreate();
	p.execute(this).after(fn);
	return p;
}

/**
 * Create the skeleton of our Promise object
 * @type {Object}
 */
Promise.prototype = {
	/**
	 * Executes a given function with provided arguments, and then calls the next one in queue
	 * @param  {Function} fn            Function to execute
	 * @param  {Array}   syntheticArgs 	Arguments to be passed to the function called
	 * @return {Promise}                Returns self object for chaining
	 */
	execute: function(fn, syntheticArgs) {
		var $this = this;
		syntheticArgs = syntheticArgs || [];
		/**
		 * Ensure to have it in the next event loop for better async
		 */
		var processResponder = function() {
			try {
				if (fn) {
					/**
					 * Insert a done() or ok() argument to other needed arguments
					 */
					syntheticArgs.unshift(function() {
						/**
						 * Call the next in queue
						 */
						$this.next.apply($this, arguments);
					});
					/**
					 * Call the function finally
					 */
					fn.apply(this, syntheticArgs);
				} else {
					syntheticArgs = syntheticArgs || [];
					/**
					 * If no function passed, call the next in queue
					 */
					$this.next.apply(this, syntheticArgs);
				}
			} catch(e) {
				/**
				 * An error caught is thrown directly to the catch handler, if any
				 */
				if (this.onCatch) {
					this.onCatch(e);
				}
			}
		};
		if (typeof process === "undefined") {
			processResponder();
		} else {
			process.nextTick(processResponder);
		}
		/**
		 * Return self for chaining
		 */
		return this;
	},
	/**
	 * Function to add next function in queue (`then` equivalent of ES6)
	 * @param  {Function} cb Function to be queued
	 * @return {Promise}     Returns self for chaining
	 */
	after: function(cb) {
		this.fnStack.push({fn: cb});
		return this;
	},
	/**
	 * Calls the next function in queue, or calls the function passed in `catch` if error occurs
	 * @param  {Error}   err Error object optionally passed
	 * @return {Promise}     Return self for chaining
	 */
	next: function(err) {
		/**
		 * If err is an Error object, break the chain and call catch
		 */
		if (err && err.constructor.name === "Error" && this.onCatch) {
			this.onCatch(err);
			return;
		}

		var nextFn = this.fnStack.shift();
		if (nextFn) {
			/**
			 * Ensure arguments are passed as an Array
			 */
			var args = Array.prototype.slice.call(arguments);
			return this.execute(nextFn.fn, args);
		}
	},
	/**
	 * The function to add a catch callback handler
	 * @param  {Function} fn Function to be called in case any error is passed to done() or ok()
	 * @return {Void}
	 */
	catch: function(fn) {
		this.onCatch = fn;
	}
}
/**
 * Provide the instantiator interface
 * @type {Function}
 */
if (typeof window !== "undefined") {
	window.oknow = pCreate;
} else {
	module.exports = pCreate;
}