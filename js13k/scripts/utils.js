var utils = {
	snap: function(value, snapSize) {

		return Math.floor(value / snapSize) * snapSize;

	}
};

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
