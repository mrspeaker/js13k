var game = {

	tw: 20,
	th: 24,
	res: {},

	init: function () {
		this.ctx = this.createCanvas();
		this.res = {
			"tiles": GEN.tiles(this.tw, this.th)
		}
		this.input = Input.init();
		this.reset();
		this.run();
	},

	setScreen: function (screen) {
		this.screen = screen.init();
	},

	createCanvas: function () {
		var can = document.createElement("canvas");
		can.setAttribute("id", "board");
		can.setAttribute("width", 720);
		can.setAttribute("height", 405);
		document.body.appendChild(can);
		var ctx = can.getContext("2d");
		if (!ctx) {
			alert("Could not get 2D context.");
			throw new Error("lol, no canvas dude.");
		}
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;

		ctx.w = ctx.canvas.width;
		ctx.h = ctx.canvas.height;

		return ctx;
	},

	createChars: function () {

	},

	reset: function () {
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
