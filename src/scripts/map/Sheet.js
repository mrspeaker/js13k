function makeSheet(img, w, h) {

	return {
		w: w,
		h: h,
		cellW: Math.ceil(img.width / w),
		cellH: Math.ceil(img.height / h),
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
