(function () {

	var Particle = function () {

		this.particles =  null;
		this.running = false;

	}

	Particle.prototype = {

		init: function (opts, cb) {

			this.maxLife = opts.life || 40;
			this.life = this.maxLife;
			this.cb = cb;
			this.col = opts.col || "100, 0, 0";

			this.particles = [];
			for(var i = 0; i < 20; i++) {
				this.particles.push(
					new Part({col: this.col}, this)
				);
			}

			return this;
		},

		play: function (x, y) {

			this.life = this.maxLife;
			this.x = x;
			this.y = y;
			this.running = true;
			this.particles.forEach(function (p) {
				p.reset();
			});

		},

		tick: function () {

			if (!this.running) {
				return;
			}

			this.life -= 1;

			this.particles.forEach(function (p) {
				p.tick();
			});

			if (this.life < 0) {
				this.running = false;
				this.cb && this.cb();
			}

		},

		render: function (c) {

			var self = this;

			if (!this.running) {
				return;
			}

			this.particles.forEach(function (p) {
				p.render(c, self.x, self.y);
			});

		}

	};

	function Part (opts, parent) {
		this.parent = parent;
		this.x = 0;
		this.y = 0;
		this.w = 4;
		this.h = 4;
		this.col = opts.col;
		this.xSpeed = Math.random() * 2 - 1;
		this.ySpeed = Math.random() * 2 - 1 - 1;
	}
	Part.prototype = {

		reset: function () {
			this.life = this.parent.maxLife;
			this.x = 0;
			this.y = 0;
			this.xSpeed = Math.random() * 2 - 1;
			this.ySpeed = Math.random() * 2 - 1 - 3;
		},

		tick: function () {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			this.ySpeed += 0.2;
		},

		render: function (c, x, y) {

			c.fillStyle = "rgba(" + this.col + ", " + (0.3 + this.parent.life / this.parent.maxLife) + ")";
			c.fillRect(this.x + x, this.y + y, this.w, this.h);

		}

	};

	window.Particle = Particle;

}());
