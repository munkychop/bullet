(function () {

    'use strict';
    
    function Bullet ()
    {
        // ------------------------------------------------------------------------------------------
        // -- Private properties
        // ------------------------------------------------------------------------------------------
        var _self = this;
        var _mappings = {};
        var _strictEvents = {};

        // ------------------------------------------------------------------------------------------
        // -- Public properties
        // ------------------------------------------------------------------------------------------


        // ------------------------------------------------------------------------------------------
        // -- Private methods
        // ------------------------------------------------------------------------------------------
        _self._getMappings = function () {
            
            // Return a dictionary object that has no effect on app state to ensure '_mappings'
            // stays private, even if the value returned from this method is modified.

            var publicMappings = {};

            for (var mapping in _mappings)
            {             
                publicMappings[mapping] = {
                    callbacks : _cloneCallbacks(_mappings[mapping].callbacks),
                    totalCallbacks : _mappings[mapping].totalCallbacks
                };
            }

            return publicMappings;
        };

        function _cloneCallbacks (callbacks) {
            var clonedCallbacks = {};

            for (var callbackName in callbacks) {
                
                clonedCallbacks[callbackName] = {
                    cb : callbacks[callbackName].cb,
                    once : callbacks[callbackName].once
                };
            }

            return clonedCallbacks;
        }


        // ------------------------------------------------------------------------------------------
        // -- Public methods
        // ------------------------------------------------------------------------------------------
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
            if (typeof _mappings[event] !== 'undefined')
            {
                // Add a callback object to the named event object if one doesn't already exist.
                if (typeof _mappings[event].callbacks[fnString] === 'undefined')
                {
                    _mappings[event].callbacks[fnString] = {
                        cb : fn,
                        once : !!once
                    };

                    _mappings[event].totalCallbacks++;
                }
                else if (typeof once === 'boolean')
                {
                    // The function already exists, so update it's 'once' value.
                    _mappings[event].callbacks[fnString].once = once;
                }
            }
            else
            {
                // Create a new event object in the dictionary with the specified name and callback.
                _mappings[event] = {
                    callbacks : {}
                };

                _mappings[event].callbacks[fnString] = {cb : fn, once : !!once};
                _mappings[event].totalCallbacks = 1;
            }
        };

        _self.once = function (event, fn)
        {
            _self.on(event, fn, true);
        };

        _self.off = function (event, fn)
        {
            if (typeof event !== 'string' ||
                typeof _mappings[event] === 'undefined')
            {
                // TODO : Throw an error here if in strictEventMode, instead of just returning.
                return;
            }

            // Remove just the function, if passed as a parameter and in the dictionary.
            if (typeof fn === 'function')
            {
                var fnString = fn.toString(),
                    fnToRemove = _mappings[event].callbacks[fnString];

                if (typeof fnToRemove !== 'undefined')
                {
                    // delete the callback object from the dictionary.
                    delete _mappings[event].callbacks[fnString];
                    
                    _mappings[event].totalCallbacks--;

                    if (_mappings[event].totalCallbacks === 0)
                    {
                        // There are no more functions in the dictionary that are
                        // registered to this event, so delete the named event object.
                        delete _mappings[event];
                    }
                }
            }
            else
            {
                // Delete all functions in the dictionary that are
                // registered to this event by deleting the named event object.
                delete _mappings[event];
            }
        };

        _self.trigger = function (event, data)
        {
            if (typeof event !== 'string' ||
                typeof _mappings[event] === 'undefined') return;

            for (var fnString in _mappings[event].callbacks)
            {
                var callbackObject = _mappings[event].callbacks[fnString];

                if (typeof callbackObject.cb === 'function') callbackObject.cb(data);
                if (typeof callbackObject.once === 'boolean' && callbackObject.once === true) _self.off(event, callbackObject.cb);
            }
        };

        _self.getEvents = function () {

            // Ensure '_strictEvents' stays private by returning a clone of the object.
            var clonedEvents = JSON.parse(JSON.stringify(_strictEvents));

            return clonedEvents;
        };

        _self.addEvent = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new TypeError('Bullet:: [addEvent] expected event name parameter to be a string, but received type: ' + typeof eventName);
                // return early due to TypeError;
            }
            else if (eventName.length === 0)
            {
                throw new Error('Bullet:: [addEvent] expected event name parameter to be longer than 0 characters');
            }

            _strictEvents[eventName] = eventName;
        };

        _self.removeEvent = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new TypeError('Bullet:: [removeEvent] expected event name parameter to be a string, but received type: ' + typeof eventName);
                // return early due to TypeError;
            }
             else if (eventName.length === 0)
            {
                throw new Error('Bullet:: [removeEvent] expected event name parameter to be longer than 0 characters');
            }

            if (_strictEvents[eventName]) delete _strictEvents[eventName];
        };
    }


    // ------------------------------------------------------------------------------------------
    // -- Module definition
    // ------------------------------------------------------------------------------------------
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