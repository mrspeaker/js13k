function Sheet(img, w, h) {

	return {
		render: function (c, col, row, x, y) {
			c.drawImage(
				img,
				col * w,
				row * h,
				w,
				h,
				x,
				y,
				w,
				h);
		}
	}

};