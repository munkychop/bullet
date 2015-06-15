(function () {
	var BulletClass = function () {
		var _self = this,
			_events = {};

		/**
		 *  Assign a function to run when 'event' is triggered using Bullet.trigger.
		 *  Assigning more functions to this object 
		 */
		_self.on = function (event, fn, once) {
			if (arguments.length < 2 ||
				typeof event !== "string" || typeof fn !== "function") return;

			var fnString = fn.toString();

			// if the named event object already exists in the dictionary...
			if (typeof _events[event] !== "undefined") {
				// add a callback object to the named event object if one doesn't already exist.
				if (typeof _events[event].callbacks[fnString] === "undefined") {
					_events[event].callbacks[fnString] = {
						cb : fn,
						once : !!once
					};

				} else if (typeof once === "boolean") {
					// the function already exists, so update it's 'once' value.
					_events[event].callbacks[fnString].once = once;
				}

			} else {
				// create a new event object in the dictionary with the specified name and callback.
				_events[event] = { callbacks : {} };
				_events[event].callbacks[fnString] = {cb : fn, once : !!once};
			}
		};

		_self.once = function (event, fn) {
			_self.on(event, fn, true);
		};

		_self.off = function (event, fn) {
			if (typeof event !== "string" || typeof _events[event] === "undefined") return;

			// remove just the function, if passed as a parameter and in the dictionary.
			if (typeof fn === "function") {
				var fnString = fn.toString(), fnToRemove = _events[event].callbacks[fnString];

				if (typeof fnToRemove !== "undefined") {
					// delete the callback object from the dictionary.
					delete _events[event].callbacks[fnString];
				}

			} else {
				// delete all functions in the dictionary that are
				// registered to this event by deleting the named event object.
				delete _events[event];
			}
		};

		_self.trigger = function (event, data) {
			if (typeof event !== "string" || typeof _events[event] === "undefined") return;

			for (var fnString in _events[event].callbacks) {
				var callbackObject = _events[event].callbacks[fnString];

				if (typeof callbackObject.cb === "function") callbackObject.cb(data);
				if (typeof callbackObject.once === "boolean" && callbackObject.once === true) 
					_self.off(event, callbackObject.cb);
			}
		};
		
		_self.clearAll = function () {
			_events = {};
		};
		
		/**
		 * Replace all fn run for a given event with the single given fn. 
		 */
		_self.replace = function (event, fn, once) {
			if (typeof event !== "string" || typeof _events[event] === "undefined") return;
			_self.off(event);
			_self.on(event, fn, once);
		};

	};

	// check for AMD/Module support, otherwise define Bullet as a global variable.
	if (typeof define !== "undefined" && define.amd) {
		// AMD. Register as an anonymous module.
		define (function() {
			"use strict";
			return new BulletClass();
		});

	} else if (typeof module !== "undefined" && module.exports) module.exports = new BulletClass();
	else window.Bullet = new BulletClass();

})();
