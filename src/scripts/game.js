var game = {

	tw: 20,
	th: 24,

	dialog: null,

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
		this.setScreen(Screen.title);
	},

	run: function (d) {
		if (!this.dialog) {
			this.screen.tick(this.input);
		} else {
			if (!this.dialog.tick(this.input)) {
				this.dialog = null;
			}
		}
		this.input.tick();

		this.screen.render(this.ctx);
		this.dialog && this.dialog.render(this.ctx);

		window.requestAnimationFrame(function () {
        	game.run(Date.now());
		});
	}

};
