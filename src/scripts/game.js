var game = {

	tw: 20,
	th: 24,

	init: function () {
		this.ctx = this.addMainCanvas();

		this.res = {
			"tiles": GEN.tiles(this.tw, this.th),
			"font": GEN.font()
		}

		this.input = Input.init();
		audio.init();
		this.reset();
		this.run();
	},

	setScreen: function (screen) {
		this.screen = screen.init();
	},

	addMainCanvas: function () {
		var ctx = utils.createCanvas(720, 405, "board");
		document.body.appendChild(ctx.canvas);
		return ctx;
	},

	reset: function () {
		this.input.reset();
		this.setScreen(Screen.level);
	},

	run: function (d) {
		this.screen.tick(this.input);
		this.input.tick();
		this.screen.render(this.ctx);

		window.requestAnimationFrame(function () {
        	game.run(Date.now());
		});
	}

};
