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

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					var off = x * 4 + (y * can.width * 4) + (tile * w * 4);

					var color = 0xff00ff,
						brr = 255;

					brr = 255 - ((Math.random() * 96) | 0);
					switch (tile) {
						case 5:
							color = 0x715137;
							if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 8)) {
			                    color = 0x6AAA40;
			                } else if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 9)) {
			                    brr = brr * 2 / 3;
			                }
							break;
						case 7:
							color = 0x715137;
							break;
						case 6:
							color = 0x6a6a6a;
							break;
						case 1:
							color = 0xe1c479;
							if ((x + (y >> 2) * 4) % 8 == 0 || y % 4 == 0) {
                        		color = 0x513117;
                    		}
							break;
						case 2:
						case 3:
						case 4:
							color = 0x4b83c3;
							break;
					}

					var col = (((color >> 16) & 0xff) * brr / 255) << 16
                        | (((color >> 8) & 0xff) * brr / 255) << 8
                        | (((color) & 0xff) * brr / 255);

					pixels.data[off + 0] = (col >> 16) & 0xff;
      				pixels.data[off + 1] = (col >> 8) & 0xff;
      				pixels.data[off + 2] = col & 0xff;
      				pixels.data[off + 3] = 255;

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