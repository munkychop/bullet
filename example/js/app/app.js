// TODO : Visually display the current state of Bullet.events
// TODO : Provide buttons to add/remove events
// TODO : Provide buttons to map/unmap events to callbacks??

(function () {

	'use strict';

	var Bullet = window.Bullet;

	// Bullet.setStrictMode(true);

	Bullet.addEventName('foo');
	Bullet.addEventName('bar');
	Bullet.addEventName('baz');

	var buttonFoo = document.getElementById('button-foo');
	var buttonBar = document.getElementById('button-bar');
	var buttonBaz = document.getElementById('button-baz');
	var textFoo = document.getElementById('text-foo');
	var textBar = document.getElementById('text-bar');
	var textBaz = document.getElementById('text-baz');

	var numFooEvents = 0;
	var numBarEvents = 0;
	var numBazEvents = 0;

	function fooEventHandler ()
	{
		numFooEvents++;
		textFoo.innerHTML = numFooEvents;
	}

	function barEventHandler ()
	{
		numBarEvents++;
		textBar.innerHTML = numBarEvents;
	}

	function bazEventHandler ()
	{
		numBazEvents++;
		textBaz.innerHTML = numBazEvents;
	}

	function triggerFoo ()
	{
		Bullet.trigger(Bullet.events.foo);
	}

	function triggerBar ()
	{
		Bullet.trigger(Bullet.events.bar);
	}

	function triggerBaz ()
	{
		Bullet.trigger(Bullet.events.baz);
	}

	Bullet.on(Bullet.events.foo, fooEventHandler);
	Bullet.on(Bullet.events.bar, barEventHandler);
	Bullet.once(Bullet.events.baz, bazEventHandler);

	buttonFoo.onclick = triggerFoo;
	buttonBar.onclick = triggerBar;
	buttonBaz.onclick = triggerBaz;
})();