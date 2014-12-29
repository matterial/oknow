var oknow = require('../index');
var assert = require('assert');
var should = require('should');
describe('Prototype', function() {
	it('Should modify function prototype', function() {
		function asyncTest() {
			//nothing here
		}
		asyncTest.after.should.be.ok;
	});
	it('Should have a function called "after" for each function', function() {
		function asyncTest() {
			//nothing here
		}
		asyncTest.after.should.be.type('function');
	});
});
describe('Chaining', function() {
	it('Should call 2 chained async functions', function(done) {
		this.slow(1000);
		/**
		 * Function finishes after some time
		 */
		function asyncTest(ok) {
			setTimeout(ok, 20);
		}
		function asyncTest2(ok) {
			setTimeout(ok, 20);
		}
		asyncTest
		.after(asyncTest2)
		.after(function() {
			done();
		});
	});
	it('Should catch errors appropriately', function(done) {
		this.slow(1000);
		/**
		 * Function finishes after some time
		 */
		function asyncTest(ok) {
			setTimeout(ok, 20);
		}
		function asyncTest2(ok) {
			setTimeout(ok, 20);
		}
		function asyncTest3(ok) {
			setTimeout(function() {
				ok(new Error('Intentional Error'));
			}, 20);
		}
		asyncTest
		.after(asyncTest2)
		.after(asyncTest3)
		.after(function() {
			//test fails if lands here
		})
		.catch(function(err) {
			done();
		});
	});
});
describe('Standalone', function() {
	it('Should work as standalone object instead of function prototype', function(done) {
		this.slow(1000);
		function asyncTest(ok) {
			setTimeout(ok, 20);
		}
		function asyncTest2(ok) {
			setTimeout(ok, 20);
		}
		oknow(asyncTest)
		.after(asyncTest2)
		.after(function(ok) {
			done();
		});
	});
});