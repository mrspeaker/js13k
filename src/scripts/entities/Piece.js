(function () {

	"use strict";

	var Piece = function (){
		this.w = 20;
		this.h = 24;
		this.xpValue = 32;
	};

	Piece.prototype = new Entity;

	Piece.prototype.init = function (x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;

		return this;
	}

	Piece.prototype.tick = function (map) {
		return !(this.remove);
	};

	Piece.prototype.hit = function (e) {};

	Piece.prototype.render = function (c) {
		c.shadowColor =  "hsl(70, 100%, 50%)";
	    c.shadowOffsetX = 0;
	    c.shadowOffsetY = 0;
	    c.shadowBlur = 10;

		c.strokeStyle = "#ff0";
		c.fillStyle = "#aa0";
		c.beginPath();
		c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w /3, 0, Math.PI * 2, false);
		c.fill();
		c.stroke();

	};

	window.Piece = Piece;

}());
