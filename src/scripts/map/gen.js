var GEN = {
	tiles: function (w, h) {

		var maxTiles = 20,
			tile,
			c,
			pixels,
			x,
			y,
			i,
			off,
			color,
			col,
			dist,
			br,
			siny;

		c = utils.createCanvas(maxTiles * w, h);
		pixels = c.createImageData(c.w, c.h);

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					off = x * 4 + (y * c.w * 4) + (tile * w * 4);
					br = 255 - ((Math.random() * 96) | 0);

					switch (tile) {
						case 5:
						case 11:
						case 12:
							color = COLOR.tile.dirt;
							if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 8)) {
								color = COLOR.tile.grass;
							} else if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 9)) {
								br = br * 2 / 3;
							}
							if (tile === 11 && x < 2 && y < 2) {
								dist = Math.sqrt((2 - x) * (2 - x) + (2 - y) * (2 - y));
								if (dist >= 1.8) {
									color = -1;
								}
								break;
							}
							if (tile === 12 && x > 17 && y < 2) {
								dist = Math.sqrt((17 - x) * (17 - x) + (2 - y) * (2 - y));
								if (dist >= 1.9) {
									color = -1;
								}
								break;
							}
							break;
						case 7:
							color = COLOR.tile.dirt;
							break;
						case 6:
							color = COLOR.tile.stone;
							break;
						case 1:
							color = Math.random() < 0.15 ? COLOR.tile.vine_leaves : -1;
							if ((x + (y >> 2) * 16) % 8 == 1 || y % 8 == 0) {
								color = COLOR.tile.vine_ladder;
							}
							break;
						case 2:
						case 3:
						case 4:
							color = COLOR.tile.water;
							siny = y % 12 - ((tile-2)*4);
							if (siny < 0) siny += 12;
							if (Math.abs(Math.sin(x / 2) * 5| 0) === siny) {
								color = COLOR.tile.water_splash;
							}
							break;
						case 8:
						case 9:
						case 10:
							color = COLOR.tile.lava;
							siny = y % 4 - (tile - 8);
							if (siny < 0) siny += 4;
							if (Math.abs(Math.sin(x / 2) * 2| 0) === siny) {
								color = COLOR.tile.lava_lines;
							}
							br = Math.min(255, br * 1.4);
							break;
					}

					col = (((color >> 16) & 0xff) * br / 255) << 16
						| (((color >> 8) & 0xff) * br / 255) << 8
						| (((color) & 0xff) * br / 255);

					pixels.data[off + 0] = color == -1 ? 0 : (col >> 16) & 0xff;
					pixels.data[off + 1] = color == -1 ? 0 : (col >> 8) & 0xff;
					pixels.data[off + 2] = color == -1 ? 0 : col & 0xff;
					pixels.data[off + 3] = color == -1 ? 0 : 255;

				}

			}

		}

		c.putImageData(pixels, 0, 0);

		return c.canvas;

	},

	font: function () {

		var ctx = utils.createCanvas(24 * 30, 24),
			dbl = utils.createCanvas(24 * 30, 24),
			chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!?.:;,/'",
			charArray = chars.split(""),
			sheet,
			quart = function (i, pix, ro, co) {
				return pix.data[(ro * pix.width + co) * 4 + i] +
					pix.data[(ro * pix.width + co + 1) * 4 + i] +
					pix.data[((ro+1) * pix.width + co + 1) * 4 + i] +
					pix.data[((ro+1) * pix.width + co + 1) * 4 + i] / 4
			}

		ctx.fillStyle = COLOR.font_main;
		ctx.font = "24px courier new";

		charArray.forEach(function (c, i) {
			ctx.fillText(c, i * 16, 16);
		});

		var pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
			pixelsDbl = dbl.getImageData(0, 0, dbl.canvas.width, dbl.canvas.height),
			scale = 1;

		 for (var row = 0; row < pixels.height; row++) {
			for (var col = 0; col < pixels.width; col++) {

				var ro = Math.floor(row / 2) * 2;
				var co = Math.floor(col / 2) * 2;

				var sourcePixel = [
					quart(0, pixels, ro, co),
					quart(1, pixels, ro, co),
					quart(2, pixels, ro, co),
					quart(3, pixels, ro, co)
				];

				for(var y = 0; y < scale; y++) {
					var destRow = row * scale + y;
					for(var x = 0; x < scale; x++) {
						var destCol = col * scale + x;
						for(var i = 0; i < 4; i++) {
							pixelsDbl.data[(destRow * pixelsDbl.width + destCol) * 4 + i] = sourcePixel[i];
						}
					}
				}
			}
		}

		dbl.putImageData(pixelsDbl, 0, 0);
		sheet = makeSheet(dbl.canvas, 16, 24);

		return function (ctx, msg, x, y) {
			msg.split("").forEach(function (c, i) {
				if (c !== " ") {
					sheet.render(ctx, charArray.indexOf(c), 0, x + i * 16, y);
				}
				return true;
			});
		}

	}
};
