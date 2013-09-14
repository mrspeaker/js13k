(function () {

	"use strict";

	var Camera = {
		x: 0,
		y: 0,
		xRange: 80,
		yRange: 60,
		zoom: 1,

		init: function (entity, x, y, w, h) {
			this.entity = entity;
			this.w = w;
			this.h = h;
			this.x = x;
			this.y = y;

			this.track(entity);

			return this;
		},

		setBounds: function (w, h) {
			this.bounds = [w, h];
		},

		track: function (entity) {
			var e = entity || this.entity;
			this.x = e.x - (this.w / 2) + (e.w / 2);
			this.y = e.y - (this.h / 2);

			this.constrainToBounds();

		},

		constrainToBounds: function () {
			if (this.x < 0) {
				this.x = 0;
			}
			if (this.x > 0) {
				if (this.bounds && this.x + this.w > this.bounds[0]) {
					this.x = this.bounds[0] - this.w;
				};
			}
			if (this.y < 0) {
				this.y = 0;
			}
			if (this.y > 0) {
				if (this.bounds && this.y + this.h > this.bounds[1]) {
					this.y = this.bounds[1] - this.h;
				};
			}

		},

		tick: function () {
			var e = this.entity,
				center = {x: this.x + this.w / 2, y: this.y + this.h / 2},
				xr = this.xRange,
				yr = this.yRange,
				newX,
				newY;

			if(e.x < center.x - xr) {
				this.x = e.x - (this.w / 2) + xr;
			}
			if(e.x + e.w > center.x + xr) {
				this.x = e.x + e.w - (this.w / 2) - xr;
			}
			if(e.y < center.y - yr) {
				this.y = e.y - (this.h / 2) + yr;
			}
			if(e.y + e.h > center.y + yr) {
				this.y = e.y + e.h - (this.h / 2) - yr;
			}

			this.constrainToBounds();

		},
		render: function (c, renderables) {
			var self = this;

			// renderables.push({
			// 	render: function (c, cam) {

			// 		c.lineWidth = 1;
			// 		c.strokeStyle = "rgba(200, 255, 255, 1)";
			// 		c.strokeRect(
			// 			cam.x + (cam.w / 2) - cam.xRange,
			// 			cam.y + (cam.h / 2) - cam.yRange,
			// 			cam.xRange * 2,
			// 			cam.yRange * 2);

			// 	}
			// })

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
					var visible = r.repeat || !(
						r.x + r.w < self.x ||
						r.y + r.h < self.y ||
						r.x > self.x + (self.w / self.zoom) ||
						r.y > self.y + (self.h / self.zoom));
					r.visible = visible;
					return visible;
				})
				// Draw 'em
				.forEach(function (r) {
					r.render(c, self);
				});

			c.restore();
		}
	};

	window.Camera = Camera;

}());
