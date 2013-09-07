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
		this.setScreen(Screen.title);
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

var GEN = {
	tiles: function (w, h) {

		var tile,
			maxTiles = 8,
			x, y, i, pixels,
			c,
			can;

		can = document.createElement("canvas");
		can.setAttribute("width", maxTiles * w);
		can.setAttribute("height", 1 * h);
		c = can.getContext("2d");

		pixels = c.createImageData(can.width, can.height);

		for (i = 0; i < can.width * can.height; i++) {
        	pixels.data[i * 4 + 3] = 255;
    	}

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					var off = x * 4 + (y * can.width * 4) + (tile * w * 4);
					pixels.data[off] = (Math.random() * 20 * tile | 0) + (20 * tile);
					pixels.data[off + 1] = (Math.random() * 20 * tile | 0) + (20 * tile);
					pixels.data[off + 2] = (Math.random() * 20 * tile | 0) + (20 * tile);

				}

			}

		}

		c.putImageData(pixels, 0, 0);

		return can;

	}
}