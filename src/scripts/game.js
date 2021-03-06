(function () {

	"use strict";

	var game = {

		tw: 20,
		th: 24,

		dialog: null,
		screen: null,
		screenPrev: null,
		screenFade: 0,

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

		setScreen: function (screen, arg) {
			this.screenPrev = this.screen;
			this.screen = screen.init(arg);
			this.screenFade = 75;
		},

		addMainCanvas: function () {
			var ctx = utils.createCanvas(720, 405, "board");
			ctx.canvas.backgroundColor = COLOR.back_main;

			document.querySelector("#b").appendChild(ctx.canvas);
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
			if (this.screenFade-- > 0) {
				this.ctx.globalAlpha = this.screenFade / 75;
				this.screenPrev && this.screenPrev.render(this.ctx);
				this.ctx.globalAlpha = 1;
			}
			this.dialog && this.dialog.render(this.ctx);

			window.requestAnimationFrame(function () {
				game.run(Date.now());
			});
		}

	};

	window.game = game;

}());
