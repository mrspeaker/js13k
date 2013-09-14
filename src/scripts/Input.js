(function () {

	"use strict";

	var Input = {

		keys: {
			37: { wasDown: false, isDown: false },
			38: { wasDown: false, isDown: false },
			39: { wasDown: false, isDown: false },
			40: { wasDown: false, isDown: false },
			32: { wasDown: false, isDown: false },
			13: { wasDown: false, isDown: false }
		},

		actions: {
			"up": 38,
			"right": 39,
			"down": 40,
			"left": 37,
			"fire": 32,
			"escape": 13
		},

		init: function () {
			var self = this;

			function keyed(code, isDown) {
				if (self.keys[code]) {
					self.keys[code].wasDown = self.keys[code].isDown;
					self.keys[code].isDown = isDown;
				}
			}

			document.addEventListener('keydown', function(e){
				keyed(e.keyCode, true);
			}, false );

			document.addEventListener('keyup', function(e){
				keyed(e.keyCode, false);
			}, false );

			return this;

		},

		reset: function () {
			for (var k in this.keys) {
				this.keys[k].isDown = false;
				this.keys[k].wasDown = false;
			}

		},

		tick: function () {
			var key;

			for(key in this.keys) {
				this.keys[key].wasDown = this.keys[key].isDown;
			}

		},

		isDown: function (action) {
			return this.keys[this.actions[action]].isDown;
		},

		wasDown: function (action) {
			return this.keys[this.actions[action]].wasDown;
		},

		pressed: function (action) {
			return this.isDown(action) && !(this.wasDown(action));
		}

	};

	window.Input = Input;

}());
