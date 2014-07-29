(function () {
	var BulletClass = function ()
	{
		var _self = this,
			_events = {};

		_self.on = function (event, fn)
		{
			if (arguments.length < 2
				|| typeof event !== "string"
				|| typeof fn !== "function") return;

			var fnString = fn.toString();

			if (typeof _events[event] !== "undefined")
			{
				// add the callback to the events dictionary if it doesn't exist.
				if (typeof _events[event].callbacks[fnString] === "undefined")
				{
					_events[event].callbacks[fnString] = fn;
				}
			}
			else
			{
				// create a new event object in the dictionary with the specified name and callback.
				_events[event] = {
					callbacks : {
						fnString : fn
					}
				}
			}
		};

		_self.off = function (event, fn)
		{
			if (typeof event !== "string"
				|| typeof _events[event] === "undefined") return;

			// remove just the function, if passed as a parameter and in the dictionary.
			if (typeof fn === "function")
			{
				var fnString = fn.toString(),
					fnToRemove = _events[event].callbacks[fnString];

				if (typeof fnToRemove === "function")
				{
					// delete the function from the dictionary.
					delete _events[event].callbacks[fnString];
				}
			}
			else
			{
				// delete all functions in the dictionary that are
				// registered to this event by deleting the named event object.
				delete _events[event];
			}
		}

		_self.trigger = function (event)
		{
			if (typeof event !== "string"
				|| typeof _events[event] === "undefined") return;

			for (var fnString in _events[event].callbacks)
			{
				var cb = _events[event].callbacks[fnString];

				if (typeof cb === "function") cb();
			}
		}

	};

	window.Bullet = new BulletClass();
})();