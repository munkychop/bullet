# Bullet

Bullet is a lightweight and simple to use pub-sub library, with AMD/CJS support and an intuitive API.
It was built to facilitate a simple and consistent system of communication across web applications and includes only the bare essentials typically needed to achieve this, along with great error-handling and thorough unit tests.

### Usage

#### npm
Install via npm using the following command in your command prompt:

```shell
npm i -S bullet-pubsub
```

Include Bullet within your application:

```javascript
var Bullet = require('bullet-pubsub');
```


#### Bower
Install via Bower using the following command in your command prompt:

```shell
bower install bullet
```

Include Bullet in your application:

```html
<script type="application/javascript" src="path/to/bullet.min.js"></script>
```


#### Installation without a package manager
If you are not using npm or Bower, then grab either the [minified](https://raw.githubusercontent.com/munkychop/bullet/master/dist/bullet.min.js), or [non-minified](https://raw.githubusercontent.com/munkychop/bullet/master/dist/bullet.js) source from Github and include Bullet in your application:

```html
<script type="application/javascript" src="path/to/bullet.min.js"></script>
```


### Methods

#### **.on()**

```javascript
Bullet.on('someMessageName', callback[, once, id]);
```

Register a callback function to get called whenever the specified message is triggered.
If the optional once flag is set to true then the function is the same as calling `Bullet.once(...)`.
The optional id parameter can be used when the same callback function is used by multiple modules

**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}


// Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:    

Bullet.on('hello', helloCallback);


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call the 'helloCallback' function:

Bullet.trigger('hello');

// Register the 'helloCallback' function again, but with an id

Bullet.on("hello", helloCallback, false, "myId");

// ...

// Triggering the 'hello' message will now call helloCallback twice, for without the id and with the id (which separates it from the first)

Bullet.trigger('hello'); 

```


----------


#### **.off()**

```javascript
Bullet.off('someMessageName'[, callback, id]);
```

Remove either all callback functions or a specific callback function (with optional id) registered against the specified message.

```javascript
Bullet.off();
```

Remove all registered mappings by calling `off` with no parameters.


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}

function anotherCallback () {
    console.log('hello again :)');
}


Bullet.on('hello', helloCallback);
Bullet.on('hello', anotherCallback);


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call both the 'helloCallback' and 'anotherCallback' functions:

Bullet.trigger('hello');


// Remove all callback functions associated with the 'hello' message:

Bullet.off('hello');


// Attempt to trigger the 'hello' message again – Bullet won't call any functions:

Bullet.trigger('hello');

```


**Example usage removing a specific callback:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}

function anotherCallback () {
    console.log('hello again :)');
}


Bullet.on('hello', helloCallback);
Bullet.on('hello', anotherCallback);
Bullet.on('hello', anotherCallback, false, "myId");


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call both the 'helloCallback' and 'anotherCallback' (calling it twice because of the id) functions:

Bullet.trigger('hello');


// Remove only the 'anotherCallback' function associated with the 'hello' message, which doesn't use an id:

Bullet.off('hello', anotherCallback);


// Trigger the 'hello' message again – Bullet will call both the 'helloCallback' and 'anotherCallback' (this time only once because of the id case) function:

Bullet.trigger('hello');

// Remove only the 'anotherCallback' function associated with the 'hello' message, which is associated with the 'myId' id:

Bullet.off('hello', anotherCallback, "myId");


// Trigger the 'hello' message again – Bullet will call only the 'helloCallback' function:

Bullet.trigger('hello');

```


**Example usage removing all mappings:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}

function goodbyeCallback () {
    console.log('goodbye :)');
}


Bullet.on('hello', helloCallback);
Bullet.on('goodbye', goodbyeCallback);


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call the 'helloCallback' function:

Bullet.trigger('hello');


// Trigger the 'goodbye' message – Bullet will call the 'goodbyeCallback' function:

Bullet.trigger('goodbye');


// Remove all mappings by calling the Bullet.off method with no parameters:

Bullet.off();


// Attempt to trigger the 'hello' message again – Bullet will not call the 'helloCallback' function:

Bullet.trigger('hello');


// Attempt to trigger the 'goodbye' message again – Bullet will not call the 'goodbyeCallback' function:

Bullet.trigger('goodbye');

```


----------


#### **.once()**

```javascript
Bullet.once('someMessageName', callback[, id]);
```

This function behaves in the same way as the the `on` function, except that – once registered – the callback function will only be called a single time when the specified message is triggered.


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}


// Register the 'helloCallback' function to be called the first time that the 'hello' message is triggered:

Bullet.once('hello', helloCallback);


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call the 'helloCallback' function:

Bullet.trigger('hello');


// Attempt to trigger the 'hello' message again – Bullet won't call any functions this time:

Bullet.trigger('hello');

```


----------


#### **.trigger()**

```javascript
Bullet.trigger('someMessageName'[, data]);
```

This function will call all callback functions registered against the specified message, optionally passing in custom data as a payload.


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}


// Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:

Bullet.on('hello', helloCallback);


// Somewhere later in the application...


// Trigger the 'hello' message – Bullet will call the 'helloCallback' function:

Bullet.trigger('hello');

```


**Example usage with custom data:**

```javascript

function helloCallback (data) {
    console.log(data);
}


// Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:

Bullet.on('hello', helloCallback);


// Somewhere later in the application...


// Create some custom data:

var customData = {
    someProp : 'bro',
    someOtherProp : 'awesome!'
};


// Trigger the 'hello' message – Bullet will call the 'helloCallback' function and
// pass in the custom data that you created, which will be sent to the function as a parameter:

Bullet.trigger('hello', customData);

```


----------


#### **.replaceCallback()**

```javascript
Bullet.replaceCallback('someMessageName', oldCallback, newCallback[, once, oldCallbackId, newCallbackId]);
```

Replace a single mapped callback for the specified event name with a new callback, optionally setting the 'once' parameter.
You can also optionally use the function id's that are used when adding event listeners, both for finding the old callback function with the id and with setting the new callback function id. 


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello!');
}


function someOtherCallback () {
    console.log('konnichiwa!');
}


// Explicitly add the event name.

Bullet.addEventName('hello')


// Create an event mapping.

Bullet.on('hello', helloCallback);


// Remove the 'helloCallback' function mapping from the 'hello' event and replace it with a mapping for the 'someOtherCallback' function, while setting the 'once' value for the new callback (optional).

Bullet.replaceCallback(Bullet.events.hello, helloCallback, someOtherCallback, true);

```


----------


#### **.replaceAllCallbacks()**

```javascript
Bullet.replaceAllCallbacks('someMessageName', newCallback[, once, id]);
```

Replace all of the specified event name’s mapped callbacks with the specified callback, optionally setting the 'once' parameter and the 'id' parameter for the new callback funciton id.


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello!');
}


function someOtherCallback () {
    console.log('konnichiwa!');
}


// Explicitly add an event name.

Bullet.addEventName('hello')


// Create an event mapping.

Bullet.on('hello', helloCallback);


// Replace all function mappings from the 'hello' event with a mapping for the 'someOtherCallback' function, while setting the 'once' value for the new callback (optional).

Bullet.replaceAllCallbacks(Bullet.events.hello, someOtherCallback, true);

```


----------


#### **.getStrictMode()**

```javascript
Bullet.getStrictMode();
```

Returns a boolean – true if strict mode is enabled and false if not.


**Example usage:**

```javascript

// Check whether or not strict mode is enabled:

var strictMode = Bullet.getStrictMode(); // false (the default)


// Turn on strict mode:

Bullet.setStrictMode(true);


// Check again whether or not strict mode is enabled:

strictMode = Bullet.getStrictMode(); // true

```


----------


#### **.setStrictMode()**

```javascript
Bullet.setStrictMode(boolean);
```

Calling the `on`, `once`, `trigger`, `replaceCallback`, or `replaceAllCallbacks` methods – when strict mode is enabled – will cause Bullet to check if the specified message was explicitly added to the `events` object and, if not, Bullet will throw an Error. See the `addEventName` method for details on defining event names.


**Example errors when calling the `on`, `once`, or `trigger` methods:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}

function someOtherCallback () {
    console.log('konnichiwa!');
}


// Turn on strict mode:

Bullet.setStrictMode(true);


// Attempt to register the 'helloCallback' function to be called whenever the 'hello' message is triggered – Bullet will throw an error:

Bullet.on('hello', helloCallback); // throws error due to unrecognised message


// Attempt to register the 'helloCallback' function to be called just once, when the 'hello' message is triggered – Bullet will throw an error:

Bullet.once('hello', helloCallback); // throws error due to unrecognised message


// Attempt to trigger a 'hello' message which hasn't been explicitly added as an event – Bullet will throw an error:

Bullet.trigger('hello'); // throws error due to unrecognised message

```


**Example errors when calling the `replaceCallback`, or `replaceAllCallbacks` methods:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}

function someOtherCallback () {
    console.log('konnichiwa!');
}


// Map the 'helloCallback' to the 'hello' message:

Bullet.on('hello', helloCallback);


// Turn on strict mode:

Bullet.setStrictMode(true);


// Attempt to replace a function mapping for a message which hasn't been explicitly added as an event – Bullet will throw an error:

Bullet.replaceCallback('hello', helloCallback, someOtherCallback); // throws error due to unrecognised message


// Attempt to replace all function mappings for a message which hasn't been explicitly added as an event – Bullet will throw an error:

Bullet.replaceAllCallbacks('hello', someOtherCallback); // throws error due to unrecognised message

```


----------


#### **.addEventName()**

```javascript
Bullet.addEventName('someMessage');
```

Explicitly add a message to Bullet’s 'events' object. **_Explicitly defined message names are required when strict mode is enabled._**


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}


// Register the 'helloCallback' function to be called whenever a 'hello' message is triggered:

Bullet.on('hello', helloCallback);


// Attempt to trigger the 'hello' message – Bullet will call the 'helloCallback' function as expected:

Bullet.trigger('hello');


// Turn on strict mode:

Bullet.setStrictMode(true);


// Attempt to trigger the 'hello' message again – Bullet will throw an error due to strict mode, as the message hasn't been explicitly added:

Bullet.trigger('hello');


// Explicitly add the 'hello' message:

Bullet.addEventName('hello');


// Attempt to trigger the 'hello' message again – Bullet will call the 'helloCallback' function as expected, now that the 'hello' message has been explicitly added:

Bullet.trigger('hello');

```


----------


#### **.removeEventName()**

```javascript
Bullet.removeEventName('someMessage');
```

Explicitly remove a message from Bullet’s 'events' object.


**Example usage:**

```javascript

function helloCallback () {
    console.log('hello there :)');
}


// Turn on strict mode:

Bullet.setStrictMode(true);


// Explicitly add a 'hello' message:

Bullet.addEventName('hello');


// Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:

Bullet.on('hello', helloCallback);


// Attempt to trigger the 'hello' message – Bullet will call the 'helloCallback' function as expected:

Bullet.trigger('hello');


// Explicitly remove the 'hello' message:

Bullet.removeEventName('hello');


// Attempt to trigger the 'hello' message again – Bullet will throw an error due to strict mode, as the message no longer exists as a part of Bullet’s 'events' object:

Bullet.trigger('hello');

```


----------


#### **.getTriggerAsync()**

```javascript
Bullet.getTriggerAsync();
```

Returns a boolean – true if async message triggers are enabled and false if not.


**Example usage:**

```javascript

// Check whether or not async message triggers are enabled:

var triggerAsync = Bullet.getTriggerAsync(); // true (the default)


// Turn off async message triggers:

Bullet.setTriggerAsync(false);


// Check again whether or not async message triggers are enabled:

triggerAsync = Bullet.getTriggerAsync(); // false

```


----------


#### **.setTriggerAsync()**

```javascript
Bullet.setTriggerAsync(boolean);
```

When called and passed a value of `true`, Bullet will trigger messages asynchronously (outside of the current execution call stack) and when called and passed a value of `false`, Bullet will trigger messages synchronously.


**Example usage:**

```javascript

// Check whether or not async message triggers are enabled:

var triggerAsync = Bullet.getTriggerAsync(); // true (the default)


// Turn off async message triggers:

Bullet.setTriggerAsync(false);


// Check again whether or not async message triggers are enabled:

triggerAsync = Bullet.getTriggerAsync(); // false

```


----------


### Properties

#### **.events**

```javascript
Bullet.events
```

Used for getting a reference to message strings that have been explicitly defined within the 'events' object, usually via the `addEventName` method.
*This property becomes most important when strict mode is enabled.*


**Example usage:**

```javascript

function helloCallback () {
    console.log('hi');
}


// Explicitly define a message string using the 'addEventName' method.

Bullet.addEventName('hello');


// Within the 'on' method, reference the message that was explicitly added to the 'events' object.
// This is helpful because an error will be thrown if the message is undefined:

Bullet.on(Bullet.events.hello, helloCallback);

// Bracket notation can be used to access the property instead, if necessary:
// Bullet.events['hello']


// Somewhere later in the application...


// Trigger the message that was explicitly added to the 'events' object – Bullet will call the 'helloCallback' function.
// Again, this is helpful because an error will be thrown if the message is undefined:

Bullet.trigger(Bullet.events.hello);


// It is also still possible to trigger messages by using a string literal – Bullet will still call the 'helloCallback' function:

Bullet.trigger('hello');


// Note that – when using a string literal – an error will NOT be thrown here if the message doesn't exist within the 'events' object, unless we enable strict mode:

Bullet.trigger('someOtherMessage'); // no error thrown for unrecognised message


// Enable strict mode.

Bullet.setStrictMode(true);


// Now that strict mode is enabled, attempt to trigger the unrecognised message again – Bullet will throw an error due to the unrecognised message:

Bullet.trigger('someOtherMessage'); // error thrown

```
