var input = {

	keys: {
		"up": { wasDown: false, isDown: false },
		"down": { wasDown: false, isDown: false },
		"left": { wasDown: false, isDown: false },
		"right": { wasDown: false, isDown: false },
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

	}

};
