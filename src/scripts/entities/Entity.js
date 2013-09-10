var Entity = function () {
	this.w = 10;
	this.h = 10;
	this.remove = false;
	this.falling = false;
	this.xo = 0;
	this.yo = 0;
};
Entity.prototype = {
	init: function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	},
	hit: function () {},
	hitBlocks: function () {},
	tick: function () { return !(this.remove); },
	move: function (x, y, map) {

		// Temp holder for movement
		var xo,
			yo,

			xv,
			yv,

			hitX = false,
			hitY = false,

			xBlocks,
			yBlocks;

		xo = x;
		yo = y;

		xv = this.x + xo;
		yv = this.y + yo;

		// check blocks given vertical movement TL, BL, TR, BR
		yBlocks = map.getBlocks([
			[this.x, yv],
			[this.x, yv + (this.h - 1)],
			[this.x + (this.w - 1), yv],
			[this.x + (this.w - 1), yv + (this.h - 1)]
		]);

		// if overlapping edges, move back a little
		if (y < 0 && (yBlocks[0] > map.walkable || yBlocks[2] > map.walkable)) {
			yo = map.getBlockEdge((yv | 0) + map.sheet.h, "VERT") - this.y;
			hitY = true;
		}
		if (y > 0 && (yBlocks[1] > map.walkable || yBlocks[3] > map.walkable)) {
			yo = map.getBlockEdge(yv + this.h, "VERT") - this.y - this.h;
			hitY = true;
		}

		// Add the allowed Y movement
		this.y += yo;

		// Now check blocks given horizontal movement TL, BL, TR, BR
		xBlocks = map.getBlocks([
			[xv, this.y],
			[xv, this.y + (this.h - 1)],
			[xv + (this.w - 1), this.y],
			[xv + (this.w - 1), this.y + (this.h - 1)]
		]);

		// if overlapping edges, move back a little
		if (x < 0 && (xBlocks[0] > map.walkable || xBlocks[1] > map.walkable)) {
			xo = map.getBlockEdge(xv + map.sheet.w) - this.x;
			hitX = true;
		}
		if (x > 0 && (xBlocks[2] > map.walkable || xBlocks[3] > map.walkable)) {
			xo = map.getBlockEdge(xv + this.w) - this.x - this.w;
			hitX = true;
		}

		if (hitX || hitY) {
			this.hitBlocks(hitX ? xBlocks : null, hitY ? yBlocks : null);
		}

		// Add the allowed X movement
		this.x += xo;

		// check if we're falling
		yBlocks = map.getBlocks([
			[this.x, this.y + this.h],
			[this.x + (this.w - 1), this.y + this.h]
		]);

		this.wasFalling = this.falling;
		if (yBlocks[0] <= map.walkable && yBlocks[1] <= map.walkable) {
			if (!this.onLadder) this.falling = true;
			else this.falling = false;
		} else {
			this.falling = false;
		}

		// Reset offset amount
		this.xo = 0;
		this.yo = 0;

		return [xo, yo];

	},
	render: function(c) {
		c.fillStyle = "red";
		c.fillRect(this.x, this.y, this.w, this.h);
	}
};
