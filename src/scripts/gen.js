var GEN = {
	tiles: function (w, h) {

		var tile,
			maxTiles = 20,
			x, y, i, pixels,
			c,
			can;

		can = document.createElement("canvas");
		can.setAttribute("width", maxTiles * w);
		can.setAttribute("height", 1 * h);
		c = can.getContext("2d");

		pixels = c.createImageData(can.width, can.height);

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					var off = x * 4 + (y * can.width * 4) + (tile * w * 4);

					var color = 0xff00ff,
						br = 255,
						siny;

					br = 255 - ((Math.random() * 96) | 0);
					switch (tile) {
						case 5:
						case 11:
						case 12:
							color = 0x715137;
							if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 8)) {
			                    color = 0x6AAA40;
			                } else if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 9)) {
			                    br = br * 2 / 3;
			                }
			                if (tile === 11 && x < 2 && y < 2) {
			                	var dist = Math.sqrt((2 - x) * (2 - x) + (2 - y) * (2 - y));
			                	if (dist >= 1.8) {
									color = -1;
								}
								break;
							}
							if (tile === 12 && x > 17 && y < 2) {
			                	var dist = Math.sqrt((17 - x) * (17 - x) + (2 - y) * (2 - y));
			                	if (dist >= 1.9) {
									color = -1;
								}
								break;
							}
							break;
						case 7:
							color = 0x715137;
							break;
						case 6:
							color = 0x7f7f7f;
							break;
						case 1:
							color = Math.random() < 0.15 ? 0x50D937 : -1;
							if ((x + (y >> 2) * 16) % 8 == 1 || y % 8 == 0) {
                        		color = 0xe1c479;
                    		}
							break;
						case 2:
						case 3:
						case 4:
							color = 0x4b83c3;
							siny = y % 12 - ((tile-2)*4);
							if (siny < 0) siny += 12;
							if (Math.abs(Math.sin(x / 2) * 5| 0) === siny) {
								color = 0xffffff;
							}
							break;
						case 8:
						case 9:
						case 10:
							color = 0xfe9b00;
							siny = y % 4 - (tile - 8);
							if (siny < 0) siny += 4;
							if (Math.abs(Math.sin(x / 2) * 2| 0) === siny) {
								color = 0xe12900;
							}
							br = Math.min(255, br * 1.4);
							break;
					}

                    if (color == -1) {
                    	pixels.data[off + 0] = 0;
	      				pixels.data[off + 1] = 0;
	      				pixels.data[off + 2] = 0;
	      				pixels.data[off + 3] = 0;

                    } else {
						var col = (((color >> 16) & 0xff) * br / 255) << 16
		                    | (((color >> 8) & 0xff) * br / 255) << 8
		                    | (((color) & 0xff) * br / 255);

						pixels.data[off + 0] = (col >> 16) & 0xff;
	      				pixels.data[off + 1] = (col >> 8) & 0xff;
	      				pixels.data[off + 2] = col & 0xff;
	      				pixels.data[off + 3] = 255;
	      			}

				}

			}

		}

		for (i = 0; i < can.width * can.height; i++) {
        	//pixels.data[i * 4 + 3] = 255;
    	}

		c.putImageData(pixels, 0, 0);

		return can;

	}
};
