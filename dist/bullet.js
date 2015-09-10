(function () {

    'use strict';
    
    function Bullet ()
    {
        // ------------------------------------------------------------------------------------------
        // -- Custom Errors
        // ------------------------------------------------------------------------------------------
        function ParamCountError (methodName, expectedParamsString, paramCount) {
            
            this.message = 'Bullet:: [' + methodName + '] ' + expectedParamsString + ', but received: ' + paramCount;
            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        ParamCountError.prototype = new Error();
        ParamCountError.prototype.name = ParamCountError.name;
        ParamCountError.prototype.constructor = ParamCountError;


        function EventNameTypeError (methodName, eventName) {
            
            this.message = 'Bullet:: [' + methodName + '] Expected event name parameter to be a string, but received type: ' + typeof eventName;
            var error = new TypeError(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        EventNameTypeError.prototype = new TypeError();
        EventNameTypeError.prototype.name = EventNameTypeError.name;
        EventNameTypeError.prototype.constructor = EventNameTypeError;


        function CallbackTypeError (methodName, callback) {
            
            this.message = 'Bullet:: [' + methodName + '] Expected callback parameter to be a function, but received type: ' + typeof callback;
            var error = new TypeError(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        CallbackTypeError.prototype = new TypeError();
        CallbackTypeError.prototype.name = CallbackTypeError.name;
        CallbackTypeError.prototype.constructor = CallbackTypeError;


        function StrictModeSetterTypeError (methodName, callback) {
            
            this.message = 'Bullet:: [setStrictMode] Expected parameter to be a boolean, but received type: ' + typeof callback;
            var error = new TypeError(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        StrictModeSetterTypeError.prototype = new TypeError();
        StrictModeSetterTypeError.prototype.name = StrictModeSetterTypeError.name;
        StrictModeSetterTypeError.prototype.constructor = StrictModeSetterTypeError;


        function EventNameLengthError (methodName) {
            
            this.message = 'Bullet:: [' + methodName + '] Expected event name parameter to be longer than 0 characters';
            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        EventNameLengthError.prototype = new Error();
        EventNameLengthError.prototype.name = EventNameLengthError.name;
        EventNameLengthError.prototype.constructor = EventNameLengthError;


        function UndeclaredEventError (methodName, eventName) {
            
            this.message = 'Bullet:: [' + methodName + '] Event string: "' + eventName + '" does not exist within the events dictionary\nPlease use the Bullet.addEvent method to add this string.';

            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        UndeclaredEventError.prototype = new Error();
        UndeclaredEventError.prototype.name = UndeclaredEventError.name;
        UndeclaredEventError.prototype.constructor = UndeclaredEventError;


        function UnmappedEventError (methodName, eventName) {
            
            this.message = 'Bullet:: [' + methodName + '] Event string: "' + eventName + '" is not mapped to any callbacks\nPlease use the Bullet.on method to map this string to a callback.';

            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        UnmappedEventError.prototype = new Error();
        UnmappedEventError.prototype.name = UnmappedEventError.name;
        UnmappedEventError.prototype.constructor = UnmappedEventError;


        // ------------------------------------------------------------------------------------------
        // -- Private variables
        // ------------------------------------------------------------------------------------------
        var _self = this;
        var _mappings = {};
        var _strictMode = false;

        // Expose custom error type constructors (for testing), but use an underscore to imply privacy.
        _self._errors = {
            ParamCountError : ParamCountError,
            EventNameTypeError : EventNameTypeError,
            CallbackTypeError : CallbackTypeError,
            EventNameLengthError : EventNameLengthError,
            UndeclaredEventError : UndeclaredEventError,
            UnmappedEventError : UnmappedEventError,
            StrictModeSetterTypeError : StrictModeSetterTypeError
        };


        // ------------------------------------------------------------------------------------------
        // -- Public variables
        // ------------------------------------------------------------------------------------------
        _self.events = {};

        // ------------------------------------------------------------------------------------------
        // -- Private methods
        // ------------------------------------------------------------------------------------------
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

        // Expose _getMappings method (for testing), but use an underscore to imply privacy.
        _self._getMappings = function () {
            
            // Return a dictionary object that has no effect on app state to ensure '_mappings'
            // stays private, even if the value returned from this method is modified.
            var clonedMappings = {};

            for (var mapping in _mappings)
            {             
                clonedMappings[mapping] = {
                    callbacks : _cloneCallbacks(_mappings[mapping].callbacks),
                    totalCallbacks : _mappings[mapping].totalCallbacks
                };
            }

            return clonedMappings;
        };


        // ------------------------------------------------------------------------------------------
        // -- Public methods
        // ------------------------------------------------------------------------------------------
        _self.on = function (eventName, fn, once)
        {
            if (arguments.length < 2 || arguments.length > 3)
            {
                throw new ParamCountError('on', 'Expected between 2 and 3 parameters', arguments.length);
            }

            if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('on', eventName);
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('on');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('on', eventName);
            }

            if (typeof fn !== 'function')
            {
                throw new CallbackTypeError('on', fn);
            }

            var fnString = fn.toString();

            // If the named event object already exists in the dictionary...
            if (typeof _mappings[eventName] !== 'undefined')
            {
                // Add a callback object to the named event object if one doesn't already exist.
                if (typeof _mappings[eventName].callbacks[fnString] === 'undefined')
                {
                    _mappings[eventName].callbacks[fnString] = {
                        cb : fn,
                        once : !!once
                    };

                    _mappings[eventName].totalCallbacks++;
                }
                else if (typeof once === 'boolean')
                {
                    // The function already exists, so update it's 'once' value.
                    _mappings[eventName].callbacks[fnString].once = once;
                }
            }
            else
            {
                // Create a new event object in the dictionary with the specified name and callback.
                _mappings[eventName] = {
                    callbacks : {}
                };

                _mappings[eventName].callbacks[fnString] = {cb : fn, once : !!once};
                _mappings[eventName].totalCallbacks = 1;
            }
        };

        _self.once = function (eventName, fn)
        {
            if (arguments.length !== 2)
            {
                throw new ParamCountError('once', 'Expected 2 parameters', arguments.length);
            }
            else if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('on', eventName);
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('once');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('once', eventName);
            }

            if (typeof fn !== 'function')
            {
                throw new CallbackTypeError('once', fn);
            }

            _self.on(eventName, fn, true);
        };

        _self.off = function (eventName, fn)
        {
            if (arguments.length === 0)
            {
                // TODO : Remove all mappings??
                // For now we'll just silently return immediately.
                return;
            }
            else if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('off', eventName);
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('off');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('off', eventName);
            }

            if (typeof _mappings[eventName] === 'undefined')
            {
                // There is no mapping to remove, so return silently.
                return;
            }

            // Remove just the function, if passed as a parameter and in the dictionary.
            if (typeof fn === 'function')
            {
                var fnString = fn.toString(),
                    fnToRemove = _mappings[eventName].callbacks[fnString];

                if (typeof fnToRemove !== 'undefined')
                {
                    // delete the callback object from the dictionary.
                    delete _mappings[eventName].callbacks[fnString];
                    
                    _mappings[eventName].totalCallbacks--;

                    if (_mappings[eventName].totalCallbacks === 0)
                    {
                        // There are no more functions in the dictionary that are
                        // registered to this event, so delete the named event object.
                        delete _mappings[eventName];
                    }
                }
            }
            else if (typeof fn !== 'undefined')
            {
                throw new CallbackTypeError('off', fn);
            }
            else
            {
                // No callback was passed, so delete all functions in the dictionary that
                // are registered to this event by deleting the named event object.
                delete _mappings[eventName];
            }
        };

        _self.trigger = function (eventName, data)
        {
            if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('trigger', eventName);
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('trigger');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('trigger', eventName);
            }
            
            if (typeof _mappings[eventName] === 'undefined')
            {
                if (_strictMode) throw new UnmappedEventError('trigger', eventName);

                // Return silently if not in strict mode.
                return;
            }

            for (var fnString in _mappings[eventName].callbacks)
            {
                var callbackObject = _mappings[eventName].callbacks[fnString];

                if (typeof callbackObject.cb === 'function') callbackObject.cb(data);
                if (typeof callbackObject.once === 'boolean' && callbackObject.once === true) _self.off(eventName, callbackObject.cb);
            }
        };

        _self.addEvent = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('addEvent', eventName);
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('addEvent');
            }

            _self.events[eventName] = eventName;
        };

        _self.removeEvent = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new EventNameTypeError('removeEvent', eventName);
            }
             else if (eventName.length === 0)
            {
                throw new EventNameLengthError('removeEvent');
            }

            if (_self.events[eventName]) delete _self.events[eventName];
        };

        _self.getStrictMode = function () {

            // Return a boolean that doesn't directly point to the internal '_strictMode' property.
            return _strictMode === true ? true : false;
        };

        _self.setStrictMode = function (useStrictMode) {

            if (typeof useStrictMode !== 'boolean') throw new StrictModeSetterTypeError(useStrictMode);

            _strictMode = useStrictMode;
        };

        // TODO : Create an 'addMultipleEvents' method with a flat object passed as a param.
        // - include type checks for string while looping over the object (and use hasOwnProperty!).

        // TODO : Create a 'replaceAllEvents' method with an object passed as a param.
        // - include type checks for string while looping over the object (and use hasOwnProperty!).

        // TODO : Create a 'removeAllEvents' method. No params necessary.

        // TODO : Create an 'onMultiple' method with an array of strings passed as the first param.
        // - include type checks for string while looping over the array.
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