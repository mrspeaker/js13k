var Camera = {
	x: 0,
	y: 0,
	init: function (w, h) {

		this.w = w;
		this.h = h;

		return this;

	},
	render: function (c, renderables) {
		c.save();
		c.translate(-(Math.round(this.x)), -(Math.round(this.y)));

		renderables
			// Flatten to an array
			.reduce(function (ac, e) {

				if (Array.isArray(e)) {
					return ac.concat(e);
				}
				ac.push(e);
				return ac;

			}, [])
			// Remove out-of-view entites
			.filter(function (r) {

				return r.repeat || !(
					r.x + r.w < self.x ||
					r.y + r.h < self.y ||
					r.x > self.x + (self.w / self.zoom) ||
					r.y > self.y + (self.h / self.zoom));

			})
			// Draw 'em
			.forEach(function (r) {

				r.render(c, self);

			});

		c.restore();
	}
};