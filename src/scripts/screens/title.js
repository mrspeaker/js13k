(function (Screen) {

	Screen.title = {

		count: 0,
		stars: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8],

		init: function () {
			this.tiles = makeSheet(game.res.tiles, game.tw, game.th);
			return this;
		},

		tick: function (input) {

			this.count++;

			if ((this.count - 1) % 100 === 0) {
				this.stars = this.stars.map(function () {
					return [
						Math.random() * game.ctx.w | 0,
						Math.random() * game.ctx.h | 0,
						Math.random() * 7 | 0]
				});
			}
			this.stars = this.stars.map(function (s) {
				return [s[0] + Math.random() * 2 - 1, s[1], s[2]]
			});

			if (this.count > 50 && input.pressed("fire")) {
				game.setScreen(Screen.level);
			}

		},

		render: function (c) {

			c.fillStyle = "hsla(211, 20%, 37%, 0.15)";
			c.fillRect(0, 0, c.w, c.h);
			c.fillStyle = "hsla(65, 40%, 70%, 0.2)";

			this.stars.forEach(function (s) {
				c.beginPath();
				c.arc(s[0], s[1], s[2], 0, Math.PI * 2, false);
				c.fill();
			});

			c.save();
			c.scale(3, 3);

			for (var i = 0; i < 12; i++) {
				this.tiles.render(c, 5, 0, i * game.tw, 100);
				for (var j = 0; j < 5; j++) {
					this.tiles.render(c, 7, 0, i * game.tw, game.th * (j + 1) + 100);
				}
			}

			game.res.font(c, "GLOWBOUGS", 82 + Math.sin(Date.now() / 450) * 5, 10 + Math.cos(Date.now() / 350) * 2);
			game.res.font(c, "BY", 5, 84);
			game.res.font(c, "MR SPEAKER", 5, 115);


			c.restore();
		}

	};

}(window.Screen || {}));
