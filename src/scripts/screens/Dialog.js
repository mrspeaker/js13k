var Dialog = function () {
	this.count = 0;
};
Dialog.prototype = {

	init: function (renderfunc, donefunc) {
		this.renderfunc = renderfunc;
		this.donefunc = donefunc;
		return this;
	},

	tick: function () {
		this.count ++;

		if (this.count > 50 && Input.isDown("fire")) {
			this.donefunc && this.donefunc.call(this);
			return false;
		}
		return true;
	},

	render: function (c) {
		c.fillStyle = "rgba(0, 0, 0, 0.85)";
		c.fillRect(0, 0, game.ctx.w, game.ctx.h);

		this.renderfunc.call(this, c);
	}
};
