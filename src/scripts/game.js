var game = {

	tw: 20,
	th: 24,
	res: {},

	init: function () {
		this.ctx = this.addMainCanvas();
		this.font = this.createChars();
		this.res = {
			"tiles": GEN.tiles(this.tw, this.th)
		}
		audio.init();
		this.input = Input.init();
		this.reset();
		this.run();
	},

	setScreen: function (screen) {
		this.screen = screen.init();
	},

	createCanvas: function (w, h, id) {
		var can = document.createElement("canvas"),
			ctx = can.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.w = w;
		ctx.h = h;
		can.setAttribute("height", h);
		can.setAttribute("width", w);
		id && can.setAttribute("id", id);

		return ctx;
	},

	addMainCanvas: function () {
		var ctx = this.createCanvas(720, 405, "board");
		document.body.appendChild(ctx.canvas);
		return ctx;
	},

	createChars: function () {

		var ctx = this.createCanvas(12 * 30, 12),
			dbl = this.createCanvas(24 * 30, 24),
			chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!?.:;'",
			charArray = chars.split("");

		ctx.fillStyle = "#fff";
		ctx.font = "12px courier new";

		charArray.forEach(function (c, i) {
			ctx.fillText(c, i * 8, 8);
		});
		document.body.appendChild(ctx.canvas);

		var pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
			pixelsDbl = dbl.getImageData(0, 0, dbl.canvas.width, dbl.canvas.height),
			scale = 2;

		 for(var row = 0; row < pixels.height; row++) {
		    for(var col = 0; col < pixels.width; col++) {
		      var sourcePixel = [
		        pixels.data[(row * pixels.width + col) * 4 + 0],
		        pixels.data[(row * pixels.width + col) * 4 + 1],
		        pixels.data[(row * pixels.width + col) * 4 + 2],
		        pixels.data[(row * pixels.width + col) * 4 + 3]
		      ];

		      if (sourcePixel[3] < 36) {
		      	if (sourcePixel[3] > 0) {
		      		sourcePixel[0] = 255;
		      		sourcePixel[1] = 255;
		      		sourcePixel[2] = 0;
		      		sourcePixel[3] = 155
		      	} else {
		      		sourcePixel[3] = 0;
		      	}
		      }
		      else sourcePixel[3] = 255;

		      for(var y = 0; y < scale; y++) {
		        var destRow = row * scale + y;
		        for(var x = 0; x < scale; x++) {
		          var destCol = col * scale + x;
		          for(var i = 0; i < 4; i++) {
		            pixelsDbl.data[(destRow * pixelsDbl.width + destCol) * 4 + i] =
		              sourcePixel[i];
		          }
		        }
		      }
		    }
		  }

		dbl.putImageData(pixelsDbl, 0, 0);
		document.body.appendChild(dbl.canvas);

		var sheet = makeSheet(dbl.canvas, 16, 24);

		return function (ctx, msg, x, y) {
			msg.split("").forEach(function (c, i) {
				if (c !== " ") {
					sheet.render(ctx, charArray.indexOf(c), 0, x + i * 16, y);
				}
				return true;
			});
		}


	},

	reset: function () {
		this.setScreen(Screen.level);
	},

	run: function (d) {
		this.screen.tick(this.input);
		this.input.tick();
		this.screen.render(this.ctx);

		this.font(this.ctx, "HEY CHAPS! YOU ROK", 14, 20);

		window.requestAnimationFrame(function () {
        	game.run(Date.now());
		});
	}

};
