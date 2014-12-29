Ok, now...
=====

A simple promise module for deferred callbacks in JavaScript.

## The idea

The idea behind this simple module was to allow chaining of functions much like how testing frameworks work - by explicitly mentioning when to move to next function using a keyword. Example:

### Assume
Assume we have 3 functions like below:
<pre>
	var readFromFile = function(ok) {
		//an async function that reads data from a file
		ok();
	}
	var updateUser = function(ok) {
		//some code here to update DB in async manner
		ok();
	}
	var deleteFile = function(ok) {
		//some code here to delete the file we used previously
		ok();
	}
</pre>

### Basic Chaining
<pre>
	var oknow = require('oknow');
	oknow(readFromFile)
	.after(updateUser)
	.after(deleteFile);
</pre>

### Use Directly
<pre>
	readFromFile
	.after(updateUser)
	.after(deleteFile);
	//notice that we don't need the 'oknow' reference
	//functions have an 'after' function by default
</pre>

### Simple Error Handling

<pre>
	readFromFile
	.after(function(ok) {
		//code to update user, error occurred!
		//Pass the error object to the 'ok' function
		ok(err);
	})
	.after(function(ok) {
		//code to delete file
		ok();
	})
	.catch(function(err) {
		console.log('Error: ' + err.message);
	});
	//notice that the delete file function is not called due to error
	//control moves to the catch block
</pre>