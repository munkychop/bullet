(function () {

    'use strict';
    
    function Bullet ()
    {
        var _self = this;
        var _dictionary = {
            mappings : {}
        };

        _self.on = function (event, fn, once)
        {
            if (arguments.length < 2 ||
                typeof event !== 'string' ||
                typeof fn !== 'function')
            {
                return; // TODO : Throw an error here if in strictEventMode, instead of just returning.
            }

            var fnString = fn.toString();

            // If the named event object already exists in the dictionary...
            if (typeof _dictionary.mappings[event] !== 'undefined')
            {
                // Add a callback object to the named event object if one doesn't already exist.
                if (typeof _dictionary.mappings[event].callbacks[fnString] === 'undefined')
                {
                    _dictionary.mappings[event].callbacks[fnString] = {
                        cb : fn,
                        once : !!once
                    };

                    _dictionary.mappings[event].totalCallbacks++;
                }
                else if (typeof once === 'boolean')
                {
                    // The function already exists, so update it's 'once' value.
                    _dictionary.mappings[event].callbacks[fnString].once = once;
                }
            }
            else
            {
                // Create a new event object in the dictionary with the specified name and callback.
                _dictionary.mappings[event] = {
                    callbacks : {}
                };

                _dictionary.mappings[event].callbacks[fnString] = {cb : fn, once : !!once};
                _dictionary.mappings[event].totalCallbacks = 1;
            }
        };

        _self.once = function (event, fn)
        {
            _self.on(event, fn, true);
        };

        _self.off = function (event, fn)
        {
            if (typeof event !== 'string' ||
                typeof _dictionary.mappings[event] === 'undefined')
            {
                // TODO : Throw an error here if in strictEventMode, instead of just returning.
                return;
            }

            // Remove just the function, if passed as a parameter and in the dictionary.
            if (typeof fn === 'function')
            {
                var fnString = fn.toString(),
                    fnToRemove = _dictionary.mappings[event].callbacks[fnString];

                if (typeof fnToRemove !== 'undefined')
                {
                    // delete the callback object from the dictionary.
                    delete _dictionary.mappings[event].callbacks[fnString];
                    
                    _dictionary.mappings[event].totalCallbacks--;

                    if (_dictionary.mappings[event].totalCallbacks === 0)
                    {
                        // There are no more functions in the dictionary that are
                        // registered to this event, so delete the named event object.
                        delete _dictionary.mappings[event];
                    }
                }
            }
            else
            {
                // Delete all functions in the dictionary that are
                // registered to this event by deleting the named event object.
                delete _dictionary.mappings[event];
            }
        };

        _self.trigger = function (event, data)
        {
            if (typeof event !== 'string' ||
                typeof _dictionary.mappings[event] === 'undefined') return;

            for (var fnString in _dictionary.mappings[event].callbacks)
            {
                var callbackObject = _dictionary.mappings[event].callbacks[fnString];

                if (typeof callbackObject.cb === 'function') callbackObject.cb(data);
                if (typeof callbackObject.once === 'boolean' && callbackObject.once === true) _self.off(event, callbackObject.cb);
            }
        };

        _self.getEventsMap = function () {
            
            // Return a dictionary object that has no effect on app state to ensure '_dictionary.mappings'
            // stays private, even if the value returned from this method is modified.

            var publicMappings = {};

            for (var mapping in _dictionary.mappings)
            {
                publicMappings[mapping] = _dictionary.mappings[mapping];
            }

            return publicMappings;
        };
    }

    // Check for AMD/Module support, otherwise define Bullet as a global variable.
    if (typeof define !== 'undefined' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define (function()
        {
            return new Bullet();
        });

    }
    else if (typeof module !== 'undefined' && module.exports)
    {
        module.exports = new Bullet();
    }
    else
    {
        window.Bullet = new Bullet();
    }
    
})();