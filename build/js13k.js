/*
	js13k game by Mr Speaker
*/
var utils = {
	snap: function(value, snapSize) {

		return Math.floor(value / snapSize) * snapSize;

	},

	anim: function (sfunc, efunc, cb) {

		return function () {
			// ticks
		}

	},

	checkCollision: function (entity, entities, cbName) {

		var i,
			j,
			a = entity,
			b,
			ax,
			bx,
			cbName = cbName || "hit",
			len = entities.length;

		for (i = 0; i < len; i++) {

			b = entities[i];

			ax = a.x + (a.xbb || 0);
			bx = b.x + (b.xbb || 0);

			if (a !== b &&
				ax + a.w >= bx &&
			    ax <= bx + b.w &&
			    a.y + a.h >= b.y &&
			    a.y <= b.y + b.h) {
				a[cbName] && a[cbName](b);
				b[cbName] && b[cbName](a);
			}
		}

	},

	checkCollisions: function (entities, cbName) {

		var i,
			j,
			a,
			b,
			cbName = cbName || "hit",
			all = entities.reduce(function (ac, e) {
				if (Array.isArray(e)) {
					return ac.concat(e);
				}
				ac.push(e);
				return ac;

			}, []),
			len = all.length;

		for (i = 0; i < len - 1; i++) {
			a = all[i];
			for (j = i + 1; j < len; j++) {
				b = all[j];

				if (a !== b &&
					a.x + a.w >= b.x &&
				    a.x <= b.x + b.w &&
				    a.y + a.h >= b.y &&
				    a.y <= b.y + b.h) {
					a[cbName] && a[cbName](b);
					b[cbName] && b[cbName](a);
				}
			}
		}
	},

	createCanvas: function (w, h, id) {
		var can = document.createElement("canvas"),
			ctx = can.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.w = w;
		ctx.h = h;
		can.setAttribute("height", h);
		can.setAttribute("width", w);
		id && can.setAttribute("id", id);

		return ctx;
	},

	dist: function (a, b) {

		var dx = a[0] - b[0],
			dy = a[1] - b[1];

		return Math.sqrt(dx * dx + dy * dy);

	},

	angleBetween: function (a, b) {

		var dx = a.x - b.x,
			dy = a.y - b.y,
			angle = Math.atan2(dy, dx);

		return angle % Math.PI;

	}


};

// Polyfills
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

(function () {

	var c;

	function Modulator (type, freq, gain) {
	  // this.osc = audioCtx.createOscillator();
	  // this.gain = audioCtx.createGainNode();
	  // this.osc.type = type;
	  // this.osc.frequency.value = freq;
	  // this.gain.gain.value = gain;
	  // this.osc.connect(this.gain);
	  // this.osc.start(0);
	}

	function noise () {
		var buf = c.createBuffer(1, (60 / 120) * c.sampleRate, c.sampleRate),
			data = buf.getChannelData(0);

		// Noise generator
		for (i = 0; i < data.length; i++) {
			data[i] = (Math.random() * 2 - 1) / 2;
		}

		var node = c.createBufferSource();
		node.buffer = buf;
		node.loop = true;
		return node;
	}

	window.audio = {

		sfx: {
			"jump": function() {
				var now = c.currentTime;
				var o = c.createOscillator();
				var f = c.createBiquadFilter();
				var g = c.createGain();
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				g.gain.value = 0.12;
				f.frequency.value = 2000;
				f.Q.value = 10;

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(300, now);
				o.frequency.linearRampToValueAtTime(600, now + 0.1);

				o.start(0);
				o.stop(now + 0.1);
			},

			shoot: function () {
				var now = c.currentTime;
				var s = noise();

				var f = c.createBiquadFilter();

				f.connect(audio.master);
				f.Q.value = 20;
				var start = Math.random() * 2000 + 500 | 0;
				f.frequency.value = start;
				f.frequency.setValueAtTime(start, now);
				f.frequency.linearRampToValueAtTime(100, now + 0.02);

				s.connect(f);

				s.start(0);
				s.stop(now + 0.04);
			},

			pickup: function () {
				var now = c.currentTime;
				var o = c.createOscillator();
				var f = c.createBiquadFilter();
				var g = c.createGain();
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				g.gain.value = 0.15;
				f.frequency.value = 3000;
				f.Q.value = 10;

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(600, now);
				o.frequency.linearRampToValueAtTime(2600, now + 0.12);

				o.start(0);
				o.stop(now + 0.12);
			}
		},

		init: function () {
			this.ctx = c = new (window.AudioContext || window.webkitAudioContext)();

			this.master = c.createGain();
			this.master.gain.value = 0.5;
			this.master.connect(c.destination);

			this.createTune();
		},

		stop: function () {
			this.osc.stop(c.currentTime);
		},

		createTune: function () {
			return;
			for (var bar = 0; bar < 2; bar++) {
			  var time = startTime + bar * 8 * eighthNoteTime;

			  for (var i = 0; i < 8; ++i) {
			    playSound(hihat, time + i * eighthNoteTime);
			  }
			}
		}

};

}());

var GEN = {
	tiles: function (w, h) {

		var maxTiles = 20,
			tile,
			c,
			pixels,
			x,
			y,
			i,
			off,
			color,
			col,
			dist,
			br,
			siny;

		c = utils.createCanvas(maxTiles * w, h);
		pixels = c.createImageData(c.w, c.h);

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					off = x * 4 + (y * c.w * 4) + (tile * w * 4);
					color = 0xff00ff;
					br = 255 - ((Math.random() * 96) | 0);

					switch (tile) {
						case 5:
						case 11:
						case 12:
							color = 0x715137;
							if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 8)) {
								color = 0x6aaa40;
							} else if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 9)) {
								br = br * 2 / 3;
							}
							if (tile === 11 && x < 2 && y < 2) {
								dist = Math.sqrt((2 - x) * (2 - x) + (2 - y) * (2 - y));
								if (dist >= 1.8) {
									color = -1;
								}
								break;
							}
							if (tile === 12 && x > 17 && y < 2) {
								dist = Math.sqrt((17 - x) * (17 - x) + (2 - y) * (2 - y));
								if (dist >= 1.9) {
									color = -1;
								}
								break;
							}
							break;
						case 7:
							color = 0x715137;
							break;
						case 6:
							color = 0x7f7f7f;
							break;
						case 1:
							color = Math.random() < 0.15 ? 0x50D937 : -1;
							if ((x + (y >> 2) * 16) % 8 == 1 || y % 8 == 0) {
								color = 0xe1c479;
							}
							break;
						case 2:
						case 3:
						case 4:
							color = 0x4b83c3;
							siny = y % 12 - ((tile-2)*4);
							if (siny < 0) siny += 12;
							if (Math.abs(Math.sin(x / 2) * 5| 0) === siny) {
								color = 0xffffff;
							}
							break;
						case 8:
						case 9:
						case 10:
							color = 0xfe9b00;
							siny = y % 4 - (tile - 8);
							if (siny < 0) siny += 4;
							if (Math.abs(Math.sin(x / 2) * 2| 0) === siny) {
								color = 0xe12900;
							}
							br = Math.min(255, br * 1.4);
							break;
					}

					col = (((color >> 16) & 0xff) * br / 255) << 16
						| (((color >> 8) & 0xff) * br / 255) << 8
						| (((color) & 0xff) * br / 255);

					pixels.data[off + 0] = color == -1 ? 0 : (col >> 16) & 0xff;
					pixels.data[off + 1] = color == -1 ? 0 : (col >> 8) & 0xff;
					pixels.data[off + 2] = color == -1 ? 0 : col & 0xff;
					pixels.data[off + 3] = color == -1 ? 0 : 255;

				}

			}

		}

		c.putImageData(pixels, 0, 0);

		return c.canvas;

	},

	font: function () {

		var ctx = utils.createCanvas(24 * 30, 24),
			dbl = utils.createCanvas(24 * 30, 24),
			chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!?.:;,/'",
			charArray = chars.split(""),
			sheet;

		ctx.fillStyle = "#fff";
		ctx.font = "24px courier new";

		charArray.forEach(function (c, i) {
			ctx.fillText(c, i * 16, 16);
		});

		var pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
			pixelsDbl = dbl.getImageData(0, 0, dbl.canvas.width, dbl.canvas.height),
			scale = 1;

		 for (var row = 0; row < pixels.height; row++) {
			for (var col = 0; col < pixels.width; col++) {
				var co = (col / 2.5 | 0) * 2.5 | 0;
				var ro = (row / 2.5 | 0) * 2.5 | 0;
				var sourcePixel = [
					pixels.data[(ro * pixels.width + co) * 4 + 0],
					pixels.data[(ro * pixels.width + co) * 4 + 1],
					pixels.data[(ro * pixels.width + co) * 4 + 2],
					pixels.data[(ro * pixels.width + co) * 4 + 3]
				];

				if (sourcePixel[3] < 20) {
					if (sourcePixel[3] > 100) {
						sourcePixel[0] = 255;
						sourcePixel[1] = 255;
						sourcePixel[2] = 0;
						sourcePixel[3] = 155
					} else {

						sourcePixel[3] = 0;
					}
				}
				else sourcePixel[3] = 255;

				//if (row % 2 === 0) {
				//	sourcePixel[3] = 100;
				//}

				for(var y = 0; y < scale; y++) {
					var destRow = row * scale + y;
					for(var x = 0; x < scale; x++) {
						var destCol = col * scale + x;
						for(var i = 0; i < 4; i++) {
							pixelsDbl.data[(destRow * pixelsDbl.width + destCol) * 4 + i] = sourcePixel[i];
						}
					}
				}
			}
		}

		dbl.putImageData(pixelsDbl, 0, 0);
		sheet = makeSheet(dbl.canvas, 16, 24);

		return function (ctx, msg, x, y) {
			msg.split("").forEach(function (c, i) {
				if (c !== " ") {
					sheet.render(ctx, charArray.indexOf(c), 0, x + i * 16, y);
				}
				return true;
			});
		}

	}
};
var BLOCKS = {

	walkable: 4,

	type: {
		LADDER: 1,
		WATER: 2,
		WATERRIGHT: 3,
		WATERLEFT: 4,
		LAVA: 8
	}

};

window.BLOCKS = BLOCKS;

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
(function () {

	var rooms,
		roomMap;

	window.Map = {

		x: 0,
		y: 0,

		init: function (sheet, camera) {

			this.sheet = sheet;
			this.camera = camera;

			this.cells = this.expandRoomMap(rooms, this.generateRoomMap());
			this.pickups = this.addPickups();
			this.pieces = this.addPieces();

			this.walkable = BLOCKS.walkable;
			this.cellH = this.cells.length;
			this.cellW = this.cells[0].length;
			this.h = this.cellH * sheet.h;
			this.w = this.cellW * sheet.w;

			this.camera.setBounds(this.w, this.h);

			return this;

		},

		generateRoomMap: function () {

			var roomMap = [];

			for (var i = 0; i < 12; i++) {
				roomMap.push([]);
				for (var j = 0; j < 15; j++) {
					roomMap[i].push(Math.random() * (rooms.length) | 0);
				}
			}

			return roomMap;
		},

		expandRoomMap: function (rooms, roomMap) {

			var cells = [],
				room,
				roomsH = roomMap.length,
				roomsW = roomMap[0].length,
				cellW = rooms[0][0].length,
				cellH = rooms[0].length,
				x,
				y;

			for (y = 0; y < roomsH * cellH + 2; y++) {
				cells.push([]);
				for (x = 0; x < roomsW * cellW; x++) {
					if (y < roomsH * cellH) {
						room = roomMap[y / cellH | 0][x / cellW | 0];
						cells[y].push(rooms[room][y % cellH][x % cellW]);
					} else {
						// bedrock
						cells[y].push(6);
					}
				}
			}

			return cells;

		},

		addPickups: function () {

			var pickup = [];

			for (var i = 0; i < 60; i++) {

				pickup.push([
					Math.random() * this.cells[0].length | 0,
					Math.random() * this.cells.length | 0
				]);

			}

			return pickup;

		},

		addPieces: function () {

			var pieces = [];

			for (var i = 0; i < 4; i++) {

				pieces.push([
					Math.random() * this.cells[0].length | 0,
					Math.random() * this.cells.length | 0
				]);

			}

			return pieces;

		},

		tick: function (player) {


		},

		getBlocks: function(blocks) {

			return blocks.map(function (b) {

				var row = b[1] / this.sheet.h | 0,
					col = b[0] / this.sheet.w | 0;

				if (row < 0 || row > this.cellH - 1) {
					return null;
				}

				return this.cells[row][col];

			}, this);

		},

		getBlockEdge: function(pos, vertical) {

			var snapTo = vertical ? this.sheet.h : this.sheet.w;

		    return utils.snap(pos, snapTo);

		},

		render: function (c) {

			var tw = game.tw,
				th = game.th,
				cellW = this.sheet.cellW,
				cellH = this.sheet.cellH,
				stx = this.camera.x / tw | 0,
				sty = this.camera.y / th | 0,
				endx = stx + (this.camera.w / tw | 0) + 1,
				endy = sty + (this.camera.h / th | 0) + 1,
				j,
				i,
				cell;


			for (j = sty; j <= endy; j++) {
				if (j < 0 || j > this.cellH - 1) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (i > this.cellW - 1) {
						continue;
					}

					cell = this.cells[j][i];
					if (cell === 0) {
						continue;
					}

					// flowin' water
					if (cell >= 2 && cell <= 4) {
						cell = ((Date.now() / 200) % 3 | 0) + 2;
					}
					// flowin' lava
					if (cell >= 8 && cell <= 10) {
						cell = ((Date.now() / 400) % 3 | 0) + 8;
					}

					this.sheet.render(
						c,
						cell % cellW  | 0,
						cell / cellW | 0,
						i * tw,
						j * th);
				}
			}

		},
	};

	rooms = [
	[
		[ 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
		[ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
		[ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
		[ 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
		[ 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 5, 1, 5, 5, 5, 5, 5, 5, 1, 5, 5]
	], [
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 5, 8,12, 0, 0, 0, 0, 0, 6, 1, 6],
		[ 7, 8, 8,12, 0, 0, 0, 0, 0, 1, 0],
		[ 7, 8, 8, 8,12, 0, 0, 0, 0, 1, 0],
		[ 7, 0, 8, 8, 8,12, 0, 0, 0, 1, 0],
		[ 0, 0, 5, 5, 5, 5, 5, 5, 5, 1, 5],
	], [
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
		[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1]
	], [
		[ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7],
		[ 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7],
		[ 6, 1, 1, 0, 0, 0, 3, 3, 3, 2, 7],
		[ 0, 1, 1, 0, 0, 0, 7, 7, 7, 2, 7],
		[ 0, 1, 1, 0, 0,11, 7, 7, 7, 2, 7],
		[ 5, 1, 1, 5, 5, 7, 7, 2, 4, 4, 7],
		[ 7, 7, 1, 7, 7, 7, 2, 2, 7, 7, 7]
	], [
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[7, 0, 0, 5,12, 0, 0, 0, 0, 0, 5],
		[1, 0, 5, 7, 7, 0, 0, 0, 0, 0, 7],
		[1, 5, 7, 7, 7, 0, 5, 5, 5, 1, 7]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
		[0, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0],
		[0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
		[0, 0, 5, 5,12, 0, 0, 0, 0, 0, 7],
		[7, 5, 7, 7, 7, 0, 5, 5, 5, 1, 7]
	],
	[
		[0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0],
		[5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
		[0, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0],
		[0, 0, 5, 5, 0, 0, 0, 5, 7, 0, 0],
		[0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 5],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
	];


}());

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

		// check if we're falling (with some pixels overhang)
		yBlocks = map.getBlocks([
			[this.x - (this.dir > 0 ? 6 : 0), this.y + this.h],
			[this.x + (this.w - 1) + (this.dir < 0 ? 6 : 0), this.y + this.h]
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
var Ghoul = function () {
	this.w = 15;
	this.h = 22;
	this.dir = 1;
	this.speed = 1.1;
	this.angrySpeed = 1.5;
	this.life = 3;
	this.knockBack = 0;
	this.xpValue = 5;
	this.isAngry = false;
};
Ghoul.prototype = new Entity;
Ghoul.prototype.init = function (x, y, dir, level) {
	this.x = x;
	this.y = y;

	this.level = level;

	this.dir = dir || 1;

	this.offs = {
		headX: 2,
		headY: -3,
		bodyX: 0,
		bodyY: 5
	}

	return this;
},
Ghoul.prototype.hit = function (e) {
	if (e instanceof Spear && !e.stuck) {
		this.knockBack = e.dir === this.dir ? 2 * e.dir : -6 * this.dir;
		if(this.life-- <= 0) {
			this.level.xp(this);
			this.remove = true;
		}
	}
	if (e instanceof Trap) {
		this.remove = true;
	}
};
Ghoul.prototype.tick = function (map) {
	var yo = 0,
		xo = 0,
		player;
	if (!this.isAngry) {
		yo = Math.sin(Date.now() / 100);
		xo = this.speed * this.dir;
	} else {
		player = this.level.player;
		var dist = utils.dist([this.x, this.y], [player.x, player.y]);
		if (dist < 400) {
			if (Math.abs(this.y - player.y) > 2) {
				yo = this.angrySpeed * (this.y < player.y ? 1 : -1);
			} else if (Math.abs(this.x - player.x) > 5) {
				this.dir = this.x < player.x ? 1 : -1;
				xo = this.angrySpeed * this.dir;
			}
		}

	}

	if (this.knockBack !== 0) {
		xo += this.knockBack;
		this.knockBack = this.knockBack + (this.knockBack > 0 ? -1 : 1);
	}

	if (!this.isAngry) {
		this.move(xo, yo, map);
	} else {
		this.x += xo;
		this.y += yo;
	}
	return !(this.remove);
};
Ghoul.prototype.hitBlocks = function (x, y) {
	this.dir *= -1;
};
Ghoul.prototype.render = function (c) {

	c.strokeStyle = "hsl(70, 100%, 50%)";

	c.shadowColor =  "hsl(70, 100%, 50%)";
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur    = 10;

	c.fillStyle = this.isAngry ? "hsl(10, 80%, 60%)" : "hsl(180, 80%, 50%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	//c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = this.isAngry ? "hsl(0, 80%, 60%)" : "hsl(120, 30%, 40%)";
	c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	//c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);

	c.fillStyle = "hsl(120, 40%, 50%)";
	c.fillRect(this.x + 2, this.y +20, 8, 3);

	c.fillRect(this.x + 4, this.y + 11, 3, 5);

};var Player = function() {
	this.w = 12;
	this.h = 23;
	this.xp = 0;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
	this.wasFalling = false;
	this.onLadder = false;
	this.wasOnLadder = false;
	this.dir = 1;

	this.numPickups = 0;
	this.numTraps = 0;
	this.pieces = [false, false, false, false];

	this.trapLaunch = -1;

};
Player.prototype = new Entity;
Player.prototype.init = function (x, y, level) {
	this.x = x;
	this.y = y;
	this.level = level;

	this.checkpoint = [this.x, this.y];

	this.initpos = [x, y];

	this.projectiles = [];
	this.traps = [];

	this.offs = {
		headX: 2,
		headY: -3,
		bodyX: 0,
		bodyY: 5
	}

	return this;
},
Player.prototype.complete = function () {
	var p = this.pieces;
	return p[0] + p[1] + p[2] + p[3];
};
Player.prototype.tick = function (input, map) {

	var speed = 0.9;

	this.projectiles = this.projectiles.filter(function (p) {
		return p.tick(map);
	});
	this.traps = this.traps.filter(function (t) {
		return t.tick(map);
	});

	if (input.isDown("up")) {
		if (this.inWater || (this.onLadder && !this.onTopOfLadder)) {
			this.acc[1] -= speed;
		} else {
			if (!this.falling && !this.wasFalling) {
				audio.sfx.jump();
				this.acc[1] = -map.sheet.h - 1;
				this.vel[1] = 0;
				this.falling = true;
			}
		}
	}
	if (input.isDown("down")) {
		if (input.isDown("fire") && this.numTraps > 0) {
			if (this.trapLaunch < 0) {
				this.trapLaunch = 20;
			} else {
				if (--this.trapLaunch === -1) {
					this.trapLaunch = 1000; // TODO: just release fire button.
					this.numTraps--;
					this.traps.push(
						new Trap().init(this.x, this.y - 2 - 24)
					);
					this.traps.forEach(function (t) {
						t.setClosestPiece(this.level.pieces);
					}, this);
				}
			}
		} else {
			// Move downwards
			this.trapLaunch = -1;
			this.acc[1] += speed;
		}
	}
	if (input.isDown("left")) {
		this.acc[0] -= speed;
		this.dir = -1;
	}
	if (input.isDown("right")) {
		this.acc[0] += speed;
		this.dir = 1;
	}
	if (input.pressed("fire")) {
		this.projectiles.push(
			new Spear().init(this.x, this.y, this.dir)
		);
		audio.sfx.shoot();
	}

	this.tickVelocity();

	this.wasFalling = this.falling;
	this.move(this.xo, this.yo, map);
	this.checkBlocks(input, map);

};

Player.prototype.tickVelocity = function () {
	this.grav = Math.min(this.falling ? this.grav + 0.23 : 0, 2.3);

	this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1] + this.grav];
	this.vel = [this.vel[0] * this.friction, this.vel[1] * this.friction];

	this.acc = [0, 0];

	if (Math.abs(this.vel[0]) < 0.01) this.vel[0] = 0;
	if (Math.abs(this.vel[1]) < 0.01) this.vel[1] = 0;

	this.xo += this.vel[0];
	this.yo += this.vel[1];
};
Player.prototype.hit = function (e) {
	if (e instanceof Pickup) {
		e.remove = true;
		this.level.xp(e);
		// Befor you needed multipe pickups to make a trap. remove this.
		audio.sfx.pickup();
		this.numTraps++;
		if(this.numPickups++ === 0) {
			this.level.firstPickup();
		};
		return;
	}
	if (e instanceof Ghoul) {
		this.killed();
		return;
	}

	if (e instanceof Piece) {
		e.remove = true;
		var p = this.pieces;
		p[e.id] = true;
		this.checkpoint = [this.x, this.y];
		this.level.xp(e);
		if (this.complete() === 4) {
			this.level.winsTheGame();
		} else {
			if (this.complete() === 1) {
				this.level.firstPiece();
			}
			this.traps.forEach(function (t) {
				t.setClosestPiece(this.level.pieces.filter(function (p) {
					return p !== e;
				}));
			}, this);
		}
		return;
	}
};
Player.prototype.hitSpear = function (spear) {
	if (spear.stuck) {
		this.onLadder = true;
		this.falling = false;
		if (this.y + this.h - spear.y < 10) {
			this.onTopOfLadder = true;
			this.y = spear.y - this.h;
		}
	} else {
		this.onTopOfLadder = false;
	}
};

Player.prototype.isMoving = function () {
	return Math.abs(this.vel[0]) > 0.3 || Math.abs(this.vel[1]) > 0.3;
};

Player.prototype.killed = function (spear) {
	this.x = this.checkpoint[0];
	this.y = this.checkpoint[1];
};
Player.prototype.hitBlocks = function (x, y) {

	if ((x && x.indexOf(BLOCKS.type.LAVA) > -1) || (y && y.indexOf(BLOCKS.type.LAVA) > -1)) {
		this.killed();
	}

};
Player.prototype.checkBlocks = function (input, map) {

	this.wasOnLadder = this.onLadder;

	var blocks = map.getBlocks([
		[this.x, this.y],
		[this.x, this.y + (this.h - 1)],
		[this.x + (this.w - 1), this.y],
		[this.x + (this.w - 1), this.y + (this.h - 1)]
	]);

	this.onTopOfLadder = false;
	if (blocks.indexOf(BLOCKS.type.LADDER) > -1) {
		if (!this.wasOnLadder) {
			if (blocks[0] !== BLOCKS.type.LADDER && blocks[2] !== BLOCKS.type.LADDER) {
				// Snap to top.
				this.y = utils.snap(this.y, map.sheet.h) + (map.sheet.h - this.h);
				this.onTopOfLadder = true;
				if (!input.isDown("down")) {
					this.vel[1] = 0;
				}
			}
		}
		this.onLadder = true;
		this.falling = false;
	} else {
		this.onLadder = false;
	}

	this.inWater = false;
	if (blocks.indexOf(BLOCKS.type.WATER) > -1) {
		this.yo += 4;
		this.inWater = true;
		this.falling = false;
	}
	if (blocks.indexOf(BLOCKS.type.WATERRIGHT) > -1) {
		this.xo += 4;
		this.inWater = true;
	}
	if (blocks.indexOf(BLOCKS.type.WATERLEFT) > -1) {
		this.xo -= 4;
		this.inWater = true;
	}

};
Player.prototype.render = function (c) {

	c.shadowBlur = 0;

	c.fillStyle = "#900";
	c.fillRect(this.checkpoint[0], this.checkpoint[1] + this.h - 4, this.w, 4);
	// draw checkpoint

	this.projectiles.forEach(function (p) {
		return p.render(c);
	});

	this.traps.forEach(function (t) {
		return t.render(c);
	});

	c.strokeStyle = "#000";
	c.lineWidth = 2;

	// body
	c.fillStyle = "hsl(10, 70%, 30%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(20, 30%, 40%)";
	if (!this.onLadder) {
		c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
		c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	} else {
		c.fillRect(this.x + 3, this.y + this.offs.headY, 6, 10);
		c.strokeRect(this.x + 3, this.y + this.offs.headY, 6, 10);
	}

	c.fillStyle = "hsl(55, 100%, 50%)";
	if (this.isMoving()) {
		if ((Date.now() / 100 | 0) % 2 === 0) {
			// legs and arms
			if (!this.onLadder) {
				c.fillRect(this.x + 2, this.y + 20, 3, 3);
				c.fillRect(this.x + 8, this.y + 20, 3, 3);
				c.fillRect(this.x + 4, this.y + 11, 3, 5);
			} else {
				// Arms
				c.fillRect(this.x - 2, this.y + 2, 3, 5);
				c.fillRect(this.x + 11, this.y + 8, 3, 5);

				// Legs
				c.fillRect(this.x + 2, this.y + 20, 3, 2);
				c.fillRect(this.x + 8, this.y + 20, 3, 4);

			}
		} else {
			if (!this.onLadder) {
				c.fillRect(this.x + 4, this.y + 20, 4, 3);
				c.fillRect(this.x + 5, this.y + 11, 3, 5);
			} else {
				// Arms
				c.fillRect(this.x - 2, this.y + 8, 3, 5);
				c.fillRect(this.x + 11, this.y + 2, 3, 5);

				// Legs
				c.fillRect(this.x + 2, this.y + 20, 3, 4);
				c.fillRect(this.x + 8, this.y + 20, 3, 2);
			}
		}
	} else {
		// Standing still.
		if (!this.onLadder || this.wasFalling) {
			c.fillRect(this.x + 2, this.y + 20, 3, 3);
			c.fillRect(this.x + 8, this.y + 20, 3, 3);
			c.fillRect(this.x + 4, this.y + 11, 3, 5);
		} else {
			// Arms
			c.fillRect(this.x - 2, this.y + 8, 3, 5);
			c.fillRect(this.x + 11, this.y + 2, 3, 5);

			// Legs
			c.fillRect(this.x + 2, this.y + 20, 3, 4);
			c.fillRect(this.x + 8, this.y + 20, 3, 2);
		}
	}


};
var Spear = function (){
	this.w = 15;
	this.h = 4;
	this.speed = 8;
	this.dir = -1;
	this.life = 200;
	this.remove = false;
	this.stuck = false;
	this.x = 0;
	this.y = 0;
};
Spear.prototype = new Entity;
Spear.prototype.init = function (x, y, dir) {
	this.x = x;
	this.y = y;
	this.dir = dir;

	return this;
}
Spear.prototype.tick = function (map) {
	if (!this.stuck) {
		var speed = this.speed * this.dir,
			moved = this.move(speed, this.yo, map);
		if (moved[0] === 0) {
			this.stuck = true;
		}
	}

	if (this.life-- < 0) {
		this.remove = true;
	}

	return !(this.remove);
};
Spear.prototype.hit = function (e) {

	if (!(e instanceof Spear)) {
		//e.remove = true;
		this.remove = true;
	} else {
		//e.stuck = true;
		this.stuck = true;
	}
};
Spear.prototype.render = function (c) {
	c.fillStyle = "hsl(55, 100%, 50%)";
	c.strokeStyle = "#000";
	c.lineWidth = 1;
	c.fillRect(this.x, this.y + 1, this.w, this.h - 2);
	c.fillRect(this.x + (this.dir < 0 ? 10 : this.w - 12), this.y, 2, this.h);
	c.strokeRect(this.x - 1, this.y, this.w + 2, this.h);


};

var Pickup = function (){
	this.w = 20;
	this.h = 24;
	this.xpValue = 3;
};
Pickup.prototype = new Entity;
Pickup.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

	return this;
}
Pickup.prototype.tick = function (map) {
	return !(this.remove);
};
Pickup.prototype.hit = function (e) {};
Pickup.prototype.render = function (c) {
	c.strokeStyle = "#000";
	c.fillStyle = "#a00";
	c.beginPath();
	c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w /3, 0, Math.PI * 2, false);
	c.fill();
	c.stroke();

};

var Piece = function (){
	this.w = 20;
	this.h = 24;
	this.xpValue = 11;
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
    c.shadowBlur    = 10;

	c.strokeStyle = "#ff0";
	c.fillStyle = "#aa0";
	c.beginPath();
	c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w /3, 0, Math.PI * 2, false);
	c.fill();
	c.stroke();
};

var Camera = {
	x: 0,
	y: 0,
	xRange: 80,
	yRange: 100,
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
window.Screen = window.Screen || {};
Screen.title = {

	init: function () {
		return this;
	},

	tick: function (input) {

	},

	render: function (c) {
		c.fillStyle = "#000";
		c.fillRect(0, 0, c.w, c.h);

		c.fillStyle = "#888";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);
	}

};
window.Screen = window.Screen || {};
Screen.level = {

	init: function () {
		var tiles = makeSheet(game.res.tiles, game.tw, game.th);

		this.player = new Player().init(100, 100, this);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.pickups = this.map.pickups.map(function (p) {
			return new Pickup().init(p[0] * game.tw, p[1] * game.th)
		});
		this.pieces = this.map.pieces.map(function (p, i) {
			return new Piece().init(p[0] * game.tw, p[1] * game.th, i)
		});
		this.ghouls = [];

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghouls = this.ghouls.filter(function (g) {
			return g.tick(this.map);
		}, this);
		this.pickups = this.pickups.filter(function (p) {
			return p.tick();
		});
		this.pieces = this.pieces.filter(function (p) {
			return p.tick();
		});

		if (Math.random() < 0.01 && this.ghouls.length < 35) {
			var empty = false,
				x,
				y;
			while (!empty) {
				x = Math.random() * (this.map.cellW - 4) | 0;
				y = (Math.random() * (this.map.cellH - 4) | 0) + 2;
				empty = true;
				for (var i = 0; i < 4; i++) {
					if (this.map.cells[y][x + i] > this.map.walkable ||
						this.map.cells[y - 1][x + i] > this.map.walkable ||
						this.map.cells[y + 1][x + i] > this.map.walkable ) {
						empty = false;
						break;
					}
				}
			}
			if (this.ghouls.length < 1) {
				console.log("create!");
			this.ghouls.push(
				new Ghoul().init((x + 1) * game.tw, y * game.th, Math.random() < 0.5 ? 1 : -1, this)
			)
			// Random based on completeness that ghost is angry
			if (Math.random() < 0.4 * ((this.player.complete() + 1) / 4)) {
				this.ghouls[this.ghouls.length - 1].isAngry = true;
			}
			}
		}

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollisions([this.ghouls, this.player.traps]);
		utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
		utils.checkCollision(this.player, this.pieces);
		utils.checkCollision(this.player, this.pickups);
		utils.checkCollision(this.player, this.ghouls);
	},


	xp: function (e) {

		this.player.xp += e.xpValue;

	},

	firstPickup: function () {
		game.dialog = new Dialog().init(function (c) {
			game.res.font(c, "YOU HAVE FOUND A GHOUL TRAP...", 40, 60);
			game.res.font(c, "TO ACTIVATE IT, HOLD DOWN AND FIRE.", 40, 100);
			game.res.font(c, "CATCH A GHOUL TO FIND YOUR WAY.", 40, 150);
		});
	},

	firstPiece: function () {
		game.dialog = new Dialog().init(function (c) {
			game.res.font(c, "YOU HAVE FOUND A PIECE OF THE HOLY GRAIL.", 40, 60);
			game.res.font(c, "FIND THE REMAINING THREE PIECES TO", 40, 120);
			game.res.font(c, "COMPLETE YOUR QUEST.", 40, 150);

			game.res.font(c, "YOU WILL NOW RETURN HERE, IF YOU DIE.", 40, 220);
		});
	},

	winsTheGame: function () {

		game.dialog = new Dialog().init(function (c) {
			game.res.font(c, "YOU HAVE DISCOVERED THE LAST PIECE.", 40, 60);
			game.res.font(c, "IT'S BEAUUTIFUL.", 40, 120);
			game.res.font(c, "YOUR QUEST IS COMPLETE.", 40, 150);
		}, function () {
			game.reset();
		});
	},

	render: function (c) {

		c.clearRect(0, 0, c.w, c.h);

		this.camera.render(c, [
			this.map,
			this.pickups,
			this.pieces,
			this.ghouls,
			this.player
		]);

		game.res.font(c, "GRAIL: " + this.player.complete() + "/4", 20, 20);
		game.res.font(c, "XP: " + this.player.xp, 20, 40);
		game.res.font(c, "TRAPS: " + this.player.numTraps, 20, 60);


	}
};
var Input = {

	keys: {
		37: { wasDown: false, isDown: false },
		38: { wasDown: false, isDown: false },
		39: { wasDown: false, isDown: false },
		40: { wasDown: false, isDown: false },
		32: { wasDown: false, isDown: false },
	},

	actions: {
		"up": 38,
		"right": 39,
		"down": 40,
		"left": 37,
		"fire": 32
	},

	init: function () {

		var self = this;

		function keyed(code, isDown) {
			if (self.keys[code]) {
				self.keys[code].wasDown = self.keys[code].isDown;
				self.keys[code].isDown = isDown;
			}
		}

		document.addEventListener('keydown', function(e){
			keyed(e.keyCode, true);
		}, false );

		document.addEventListener('keyup', function(e){
			keyed(e.keyCode, false);
		}, false );

		return this;

	},

	reset: function () {

		for (var k in this.keys) {
			this.keys[k].isDown = false;
			this.keys[k].wasDown = false;
		}

	},

	tick: function () {

		var key;

		for(key in this.keys) {
			this.keys[key].wasDown = this.keys[key].isDown;
		}

	},

	isDown: function (action) {
		return this.keys[this.actions[action]].isDown;
	},
	wasDown: function (action) {
		return this.keys[this.actions[action]].wasDown;
	},
	pressed: function (action) {
		return this.isDown(action) && !(this.wasDown(action));
	}

};
var game = {

	tw: 20,
	th: 24,

	dialog: null,

	init: function () {
		this.ctx = this.addMainCanvas();

		this.res = {
			"tiles": GEN.tiles(this.tw, this.th),
			"font": GEN.font()
		}

		this.input = Input.init();
		audio.init();
		this.reset();
		this.run();
	},

	setScreen: function (screen) {
		this.screen = screen.init();
	},

	addMainCanvas: function () {
		var ctx = utils.createCanvas(720, 405, "board");
		document.body.appendChild(ctx.canvas);
		return ctx;
	},

	reset: function () {
		this.input.reset();
		this.setScreen(Screen.level);
	},

	run: function (d) {
		if (!this.dialog) {
			this.screen.tick(this.input);
		} else {
			if (!this.dialog.tick(this.input)) {
				this.dialog = null;
			}
		}
		this.input.tick();

		this.screen.render(this.ctx);
		this.dialog && this.dialog.render(this.ctx);

		window.requestAnimationFrame(function () {
        	game.run(Date.now());
		});
	}

};
