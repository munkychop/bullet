(function () {
	var BulletClass = function () 
	{
		var _self = this,
			_events = {};

		/**
		 *  Assign a function to run when 'event' is triggered using Bullet.trigger.
		 *  Assigning more functions to this object 
		 */
		_self.on = function (event, fn, once) 
		{
			if (arguments.length < 2 ||
				typeof event !== "string" || 
				typeof fn !== "function") return;

			var fnString = fn.toString();

			// if the named event object already exists in the dictionary...
			if (typeof _events[event] !== "undefined") 
			{
				// add a callback object to the named event object if one doesn't already exist.
				if (typeof _events[event].callbacks[fnString] === "undefined") 
				{
					_events[event].callbacks[fnString] = {
						cb : fn,
						once : !!once
					};

				} else if (typeof once === "boolean") 
				{
					// the function already exists, so update it's 'once' value.
					_events[event].callbacks[fnString].once = once;
				}

			} 
			else 
			{
				// create a new event object in the dictionary with the specified name and callback.
				_events[event] = { 
					callbacks : {} 
				};
				_events[event].callbacks[fnString] = {cb : fn, once : !!once};
			}
		};

		_self.once = function (event, fn) 
		{
			_self.on(event, fn, true);
		};

		_self.off = function (event, fn) 
		{
			if (typeof event !== "string" || 
				typeof _events[event] === "undefined") return;

			// remove just the function, if passed as a parameter and in the dictionary.
			if (typeof fn === "function") 
			{
				var fnString = fn.toString(), 
					fnToRemove = _events[event].callbacks[fnString];

				if (typeof fnToRemove !== "undefined") 
				{
					// delete the callback object from the dictionary.
					delete _events[event].callbacks[fnString];
				}

			} 
			else 
			{
				// delete all functions in the dictionary that are
				// registered to this event by deleting the named event object.
				delete _events[event];
			}
		};

		_self.trigger = function (event, data) 
		{
			if (typeof event !== "string" || 
				typeof _events[event] === "undefined") return;

			for (var fnString in _events[event].callbacks) 
			{
				var callbackObject = _events[event].callbacks[fnString];

				if (typeof callbackObject.cb === "function") 
				{ 
					callbackObject.cb(data);
				}

				if (typeof callbackObject.once === "boolean" && callbackObject.once === true)
				{
					_self.off(event, callbackObject.cb);
				}
			}
		};

		/**
		 * Trigger multiple events simultaneously. Example:
		 *     _self.multitrigger({
		 *        "event1": {
		 *              "key1": "val1"
		 *              "someKey2": "someVal2"
		 *        },
		 *        "event2": ""
		 *     });
		 * ...triggers event2 with no data passed, & event1 with a data object
		 */
		_self.multitrigger = function ( eventDataPairs ) 
		{
			if (typeof eventDataPairs !== 'object') return;
			var events = Object.keys( eventDataPairs );

			events.forEach(function(event)
			{
				if (typeof eventDataPairs[event] !== 'undefined') 
				{
					_self.trigger(event, eventDataPairs[event]);
				}
				else
				{
					_self.trigger(event);
				}
			});
		};

		/**
		 * Set multiple events simultaneously. Example:
		 *     _self.on_setMultiple({
		 *        "name-of-event": {
		 *              fn: function() {
		 *                alert("name-of-event has run!");
		 *              },
		 *              once: false,
		 *        },
		 *        "another-event": {
		 *              fn: function() {
		 *                alert("another-event has run!");
		 *              },
		 *              once: true,
		 *        }
		 *    });
		 */
		_self.on_setMultiple = function ( eventCollection ) 
		{
			if (typeof eventCollection !== 'object') return;
			var events = Object.keys( eventCollection );

			events.forEach(function(event)
			{
				if (typeof eventCollection[event].once === 'undefined')
				{
					eventCollection[event].once = false;
				}
                
				if (typeof eventCollection[event].fn === "function" && 
					typeof event === "string") 
				{
					_self.on(event, eventCollection[event].fn, 
							 eventCollection[event].once);                    
				}

            });
        };

		_self.clearAll = function () 
		{
			_events = {};
		};
		
		/**
		 * Replace all fn run for a given event with the single given fn. 
		 */
		_self.replace = function (event, fn, once) 
		{
			if (typeof event !== "string" || 
				typeof _events[event] === "undefined") return;

			_self.off(event);
			_self.on(event, fn, once);
		};

	};

	// check for AMD/Module support, otherwise define Bullet as a global variable.
	if (typeof define !== "undefined" && define.amd) 
	{
		// AMD. Register as an anonymous module.
		define (function() 
		{
			"use strict";
			return new BulletClass();
		});

	} 

	else if (typeof module !== "undefined" && module.exports) 
	{
		module.exports = new BulletClass();
	}
	else 
	{
		window.Bullet = new BulletClass();
	}

})();
