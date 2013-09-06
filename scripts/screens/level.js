window.Screen = window.Screen || {};
Screen.level = {

	init: function (map, player) {

		this.map = map;
		this.player = player;
		this.reset();

		return this;
	},

	reset: function () {

	},

	tick: function () {

		this.map.tick(this.player);
		this.player.tick(this.map);

	},

	render: function (gfx) {

		this.player.render();
		this.map.render();

	}
};

