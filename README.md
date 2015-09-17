# Bullet

Bullet is a lightweight and simple to use pub-sub library, with AMD/CJS support and an intuitive API.
It was built to facilitate a simple and consistent system of communication across web applications and includes only the bare essentials typically needed to achieve this, along with great error-handling and thorough unit tests.

### Usage

#### npm
Install via npm using the following command in your command prompt:

    npm i -S bullet-pubsub


Include Bullet within your application:

    var Bullet = require('bullet-pubsub');


#### Bower
Install via Bower using the following command in your command prompt:

    bower install bullet


Include Bullet in your application:

    <script type="application/javascript" src="path/to/bullet.min.js"></script>


#### Installation without a package manager
If you are not using npm or Bower, then grab either the [minified](https://raw.githubusercontent.com/munkychop/bullet/master/dist/bullet.min.js), or [non-minified](https://raw.githubusercontent.com/munkychop/bullet/master/dist/bullet.js) source from Github and include Bullet in your application:

    <script type="application/javascript" src="path/to/bullet.min.js"></script>

    
### Methods

#### **.on()**

    Bullet.on('someMessageName', callback);


Register a callback function to get called whenever the specified message is triggered.

**Example usage:**
    
    function helloCallback () {
        console.log('hello there :)');
    }


    // Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:    

    Bullet.on('hello', helloCallback);


    // Somewhere later in the application...


    // Trigger the 'hello' message – Bullet will call the 'helloCallback' function:

    Bullet.trigger('hello');
    

----------


#### **.off()**

    Bullet.off('someMessageName'[, callback]);


Remove either all callback functions or a specific callback function registered against the specified message.

**Example usage:**
    
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


**Example usage removing a specific callback:**
    
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
    
    
    // Remove only the 'anotherCallback' function associated with the 'hello' message:

    Bullet.off('hello', anotherCallback);
    

    // Trigger the 'hello' message again – Bullet will only call the 'helloCallback' function:

    Bullet.trigger('hello');


----------

    
#### **.once()**

    Bullet.once('someMessageName', callback);


This function behaves in the same way as the the **'on'** function, except that – once registered – the callback function will only be called a single time when the specified message is triggered.

**Example usage:**
    
    function helloCallback () {
        console.log('hello there :)');
    }
    
    
    // Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:
    
    Bullet.once('hello', helloCallback);
    

    // Somewhere later in the application...
    
    
    // Trigger the 'hello' message – Bullet will call the 'helloCallback' function:
    
    Bullet.trigger('hello');
    
    
    // Attempt to trigger the 'hello' message again – Bullet won't call any functions this time:
    
    Bullet.trigger('hello');
    

----------


#### **.trigger()**

    Bullet.trigger('someMessageName'[, data]);


This function will call all callback functions registered against the specified message, optionally passing in custom data as a payload.

**Example usage:**
    
    function helloCallback () {
        console.log('hello there :)');
    }
    
    
    // Register the 'helloCallback' function to be called whenever the 'hello' message is triggered:
    
    Bullet.on('hello', helloCallback);
    

    // Somewhere later in the application...
    
    
    // Trigger the 'hello' message – Bullet will call the 'helloCallback' function:
    
    Bullet.trigger('hello');
    

**Example usage with custom data:**
    
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


----------


#### **.getStrictMode()**

    Bullet.getStrictMode();

Returns a boolean – true if strict mode is enabled and false if not.

**Example usage:**

    // Check whether or not strict mode is enabled:

    var strictMode = Bullet.getStrictMode(); // false (the default)


    // Turn on strict mode:

    Bullet.setStrictMode(true);


    // Check again whether or not strict mode is enabled:

    strictMode = Bullet.getStrictMode(); // true


----------


#### **.setStrictMode()**

    Bullet.setStrictMode(boolean);

Calling the `on`, `once` or `trigger` methods – when strict mode is enabled – will cause Bullet to check if the specified message was explicitly added to the `events` object and, if not, Bullet will throw an Error.

**Example errors when calling the `on`, `once`, or `trigger` methods:**

    function helloCallback () {
        console.log('hello there :)');
    }
    

    // Turn on strict mode:

    Bullet.setStrictMode(true);


    // Attempt to register the 'helloCallback' function to be called whenever the 'hello' message is triggered – Bullet will throw an error:
    
    Bullet.on('hello', helloCallback); // throws error due to unrecognised message


    // Attempt to register the 'helloCallback' function to be called just once, when the 'hello' message is triggered – Bullet will throw an error:
    
    Bullet.once('hello', helloCallback); // throws error due to unrecognised message


    // Attempt to trigger a 'hello' message which hasn't been explicitly added as an event – Bullet will throw an error:
    
    Bullet.trigger('hello'); // throws error due to unrecognised message


----------


#### **.addEventName()**

    Bullet.addEventName('someMessage');

Explicitly add a message to Bullet’s 'events' object. **_Explicitly defined message names are required when strict mode is enabled._**

**Example usage:**

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


----------


#### **.removeEventName()**

    Bullet.removeEventName('someMessage');

Explicitly remove a message from Bullet’s 'events' object.

**Example usage:**

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


----------


### Properties

#### **.events**

    Bullet.events

Used for getting a reference to message strings that have been explicitly defined within the 'events' object, usually via the `addEventName` method.
*This property becomes most important when strict mode is enabled.*

**Example usage:**

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
