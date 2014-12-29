Ok, now...
=====

A simple promise module for deferred callbacks in JavaScript.

## The idea

The idea behind this simple module was to allow chaining of functions much like how testing frameworks work - by explicitly mentioning when to move to next function using a keyword. 

### Install

<pre>
	npm install oknow
</pre>

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

These are all individual functions that run async code inside them. The idea is to explicitly say `ok` when the function finishes, so the next function in the queue will execute if there was no error. Check the below section.

### Basic Chaining
<pre>
	var oknow = require('oknow');
	oknow(readFromFile)
	.after(updateUser)
	.after(deleteFile);
</pre>

The `readFromFile` function would read a file's contents asynchronously, and when it finishes reading, it has to say `ok`. This is when the next function in the queue is called (`updateUser` and then `deleteFile`, one after the other).

### Use Directly
<pre>
	readFromFile
	.after(updateUser)
	.after(deleteFile);
	//notice that we don't need the 'oknow' reference
	//functions have an 'after' function by default
</pre>

When you require the module with `require('oknow');`, it overrides the `Function` prototype with an additional member called `after` that accepts another function. So you can directly call `after` on any function to execute it and chain it with the next.

### Simple Error Handling

<pre>
	readFromFile
	.after(function(ok) {
		//code to update user, error occurred!
		//Pass the error object to the 'ok' function
		if (err) {
			ok(err);
		} else {
			ok();
		}
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

When calling `ok` from within any async function, pass an error object to it as parameter - this will break the execution chain and jump directly to the available `catch` block.

### Passing Data

The module supports passing data from one call to another, for dependable functions that need the result from previously called function. This is achieved by passing the parameters directly to the `ok` call, and reading them in the next function as arguments. (Remember, the first argument is always `ok`!).

**Example**
<pre>
	readFromFile
    .after(function(ok) {
        var theFileContents = 'User = John, Age = 25'; //read file contents into a variable
        ok(theFileContents);
    })
    .after(function(ok, theFileContents) {
    	//update data based on file content
    	console.log(theFileContents); //User = John, Age = 25
    	ok();
    })
    .after(function() {
		console.log("Done");
    });
</pre>


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.