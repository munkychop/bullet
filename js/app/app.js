var buttonFoo = document.getElementById("button-foo"),
	buttonBar = document.getElementById("button-bar"),
	buttonBaz = document.getElementById("button-baz"),
	textFoo = document.getElementById("text-foo"),
	textBar = document.getElementById("text-bar"),
	textBaz = document.getElementById("text-baz"),
	numFooEvents = 0,
	numBarEvents = 0,
	numBazEvents = 0;

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
	Bullet.trigger("foo");
}

function triggerBar ()
{
	Bullet.trigger("bar");
}

function triggerBaz ()
{
	Bullet.trigger("baz");
}

Bullet.on("foo", fooEventHandler);
Bullet.on("bar", barEventHandler);
Bullet.once("baz", bazEventHandler);

buttonFoo.onclick = triggerFoo;
buttonBar.onclick = triggerBar;
buttonBaz.onclick = triggerBaz;