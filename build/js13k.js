/*
	js13k game by Mr Speaker
*/
var utils = {
	snap: function(value, snapSize) {

		return Math.floor(value / snapSize) * snapSize;

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
	}

};

// Polyfills
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

var GEN = {
	tiles: function (w, h) {

		var tile,
			maxTiles = 20,
			x, y, i, pixels,
			c,
			can;

		can = document.createElement("canvas");
		can.setAttribute("width", maxTiles * w);
		can.setAttribute("height", 1 * h);
		c = can.getContext("2d");

		pixels = c.createImageData(can.width, can.height);

		for (tile = 0; tile < maxTiles; tile++) {

			for (y = 0; y < h; y++) {

				for(x = 0; x < w; x++) {

					var off = x * 4 + (y * can.width * 4) + (tile * w * 4);

					var color = 0xff00ff,
						brr = 255,
						siny;

					brr = 255 - ((Math.random() * 96) | 0);
					switch (tile) {
						case 5:
						case 11:
						case 12:
							color = 0x715137;
							if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 8)) {
			                    color = 0x6AAA40;
			                } else if ((y < (((x * x * 3 + x * 41) >> 2) & 3) + 9)) {
			                    brr = brr * 2 / 3;
			                }
			                if (tile === 11 && x < 2 && y < 2) {
			                	var dist = Math.sqrt((2 - x) * (2 - x) + (2 - y) * (2 - y));
			                	if (dist >= 1.8) {
									color = -1;
								}
								break;
							}
							if (tile === 12 && x > 17 && y < 2) {
			                	var dist = Math.sqrt((17 - x) * (17 - x) + (2 - y) * (2 - y));
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
							brr = Math.min(255, brr * 1.4);
							break;
					}

                    if (color == -1) {
                    	pixels.data[off + 0] = 0;
	      				pixels.data[off + 1] = 0;
	      				pixels.data[off + 2] = 0;
	      				pixels.data[off + 3] = 0;

                    } else {
						var col = (((color >> 16) & 0xff) * brr / 255) << 16
		                    | (((color >> 8) & 0xff) * brr / 255) << 8
		                    | (((color) & 0xff) * brr / 255);

						pixels.data[off + 0] = (col >> 16) & 0xff;
	      				pixels.data[off + 1] = (col >> 8) & 0xff;
	      				pixels.data[off + 2] = col & 0xff;
	      				pixels.data[off + 3] = 255;
	      			}

				}

			}

		}

		for (i = 0; i < can.width * can.height; i++) {
        	//pixels.data[i * 4 + 3] = 255;
    	}

		c.putImageData(pixels, 0, 0);

		return can;

	}
};
(function () {

	var c = new (window.AudioContext || window.webkitAudioContext)();

	function Modulator (type, freq, gain) {
		return;
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
				o.connect(f);
				f.connect(audio.master);
				f.frequency.value = 1000;
				f.Q.value = 8;


				o.type = "square"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(100, now);
				o.frequency.linearRampToValueAtTime(100, now + 0.01);
				o.start(0);
				o.stop(now + 0.01);
			},
			shoot: function () {
				var now = c.currentTime;
				var s = noise();

				var f = c.createBiquadFilter();

				f.connect(audio.master);
				f.Q.value = 20;
				f.frequency.value = 2000;
				f.frequency.setValueAtTime(2000, now );
				f.frequency.linearRampToValueAtTime(100, now + 0.02);

				s.connect(f);

				s.start(0);
				s.stop(now + 0.04);
			}
		},

		init: function () {
			this.ctx = c;
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
var Map = {

	x: 0,
	y: 0,

	init: function (sheet, camera) {

		this.sheet = sheet;
		this.camera = camera;

		this.cells = [
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 1, 5,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 1, 5,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 7, 1, 7, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 7, 1, 7, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[ 7, 0, 0,11, 5, 5, 5,12, 0,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 1, 7, 7, 7, 5, 5, 5, 5, 5,12, 2,11, 5, 5, 5, 7, 7, 0, 0,11, 5, 5, 5,12, 0,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 1, 7, 7, 7, 5, 5, 5, 5, 5,12, 2,11, 5, 5, 5, 7],
			[ 7, 0, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 7, 7, 7, 7],
			[ 8,12, 0, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 7, 8,12, 0, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 7],
			[ 5, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7, 7, 5, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7, 7],
			[ 7, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 7, 7, 7, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 7, 7],
			[ 7, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 7, 2, 7, 7, 7, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,11, 7, 7, 7, 2, 7, 7, 7, 0, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,11, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 1, 5, 5, 5, 5, 5, 7, 7, 2, 4, 4, 7, 7, 7, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 1, 5, 5, 5, 5, 5, 7, 7, 2, 4, 4, 7, 7],
			[ 7, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 7, 7, 7, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 7, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 8],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 8, 8, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 8, 8, 5],
			[ 7, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 7, 7, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7],

			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 1, 5,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 1, 5,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 7, 1, 7, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 7, 1, 7, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[ 7, 0, 0,11, 5, 5, 5,12, 0,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 1, 7, 7, 7, 5, 5, 5, 5, 5,12, 2,11, 5, 5, 5, 7, 7, 0, 0,11, 5, 5, 5,12, 0,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 1, 7, 7, 7, 5, 5, 5, 5, 5,12, 2,11, 5, 5, 5, 7],
			[ 7, 0, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 7, 7, 7, 7],
			[ 8,12, 0, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 7, 8,12, 0, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 7],
			[ 5, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7, 7, 5, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7, 7],
			[ 7, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 7, 7, 7, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 7, 7],
			[ 7, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 7, 2, 7, 7, 7, 0, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 8, 8, 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,11, 7, 7, 7, 2, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,11, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 1, 5, 5, 5, 5, 5, 7, 7, 2, 4, 4, 7, 7, 7, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 1, 5, 5, 5, 5, 5, 7, 7, 2, 4, 4, 7, 7],
			[ 7, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 7, 7, 7, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 7, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 8, 7, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 8],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 8, 8, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 8, 8, 5],
			[ 7, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 7, 7, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7]
		];
		this.walkable = BLOCKS.walkable;
		this.cellH = this.cells.length;
		this.cellW = this.cells[0].length;
		this.h = this.cellH * sheet.h;
		this.w = this.cellW * sheet.w;

		this.camera.setBounds(this.w, this.h);

		return this;

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



	}
};
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
			this.falling = true;
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
	this.speed = 3;
};
Ghoul.prototype = new Entity;
Ghoul.prototype.init = function (x, y, dir) {
	this.x = x;
	this.y = y;

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
		this.remove = true;
	}
	if (e instanceof Trap) {
		this.remove = true;
	}
};
Ghoul.prototype.tick = function () {
	this.y += Math.sin(Date.now() / 100);
	this.x += this.speed * this.dir;

	if (this.x < 0 || this.x > game.ctx.w) {
		//this.remove = true;
		this.dir *= -1;
	}
	return !(this.remove);
};
Ghoul.prototype.render = function (c) {

	c.strokeStyle = "hsl(70, 100%, 50%)";

	c.shadowColor =  "hsl(70, 100%, 50%)";
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur    = 10;

	c.fillStyle = "hsl(180, 80%, 50%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	//c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(120, 30%, 40%)";
	c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	//c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);

	c.fillStyle = "hsl(120, 40%, 50%)";
	c.fillRect(this.x + 2, this.y +20, 8, 3);

	c.fillRect(this.x + 4, this.y + 11, 3, 5);

};var Player = function() {
	this.w = 12;
	this.h = 23;
	this.vel = [0, 0];
	this.acc = [0, 0];
	this.grav = 0;
	this.friction = 0.75;
	this.falling = true;
	this.onLadder = false;
	this.wasOnLadder = false;
	this.dir = 1;

	this.trapLaunch = -1;
};
Player.prototype = new Entity;
Player.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;

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
			if (!this.falling) {
				audio.sfx.jump();
				this.acc[1] = -map.sheet.h - 1;
				this.vel[1] = 0;
				this.falling = true
			}
		}
	}
	if (input.isDown("down")) {
		if (input.isDown("fire")) {
			if (this.trapLaunch < 0) {
				this.trapLaunch = 20;
			} else {
				if (--this.trapLaunch === -1) {
					this.trapLaunch = 1000; // TODO: just release fire button.
					this.traps.push(
						new Trap().init(this.x, this.y - 2 - 24)
					);
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
	this.move(this.xo, this.yo, map);

	this.checkBlocks(map);

};

Player.prototype.tickVelocity = function () {
	this.grav = this.falling ? this.grav + 0.25 : 0;
	this.vel = [this.vel[0] + this.acc[0], this.vel[1] + this.acc[1] + this.grav];
	this.vel = [this.vel[0] * this.friction, this.vel[1] * this.friction];

	this.acc = [0, 0];

	if (Math.abs(this.vel[0]) < 0.01) this.vel[0] = 0;
	if (Math.abs(this.vel[1]) < 0.01) this.vel[1] = 0;

	this.xo += this.vel[0];
	this.yo += this.vel[1];
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
Player.prototype.hitBlocks = function (x, y) {


	if ((x && x.indexOf(BLOCKS.type.LAVA) > -1) || (y && y.indexOf(BLOCKS.type.LAVA) > -1)) {
		this.x = this.initpos[0];
		this.y = this.initpos[1];
	}

};
Player.prototype.checkBlocks = function (map) {

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

	this.projectiles.forEach(function (p) {
		return p.render(c);
	});

	this.traps.forEach(function (t) {
		return t.render(c);
	});

	c.strokeStyle = "#000";

	c.fillStyle = "hsl(10, 70%, 30%)";
	c.fillRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);
	c.strokeRect(this.x + this.offs.bodyX, this.y + this.offs.bodyY, 12, 15);

	c.fillStyle = "hsl(20, 30%, 40%)";
	c.fillRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);
	c.strokeRect(this.x + this.offs.headX * this.dir + 3, this.y + this.offs.headY, 6, 10);

	c.fillStyle = "hsl(55, 100%, 50%)";
	c.fillRect(this.x + 2, this.y +20, 8, 3);

	c.fillRect(this.x + 4, this.y + 11, 3, 5);

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

		this.player = new Player().init(100, 100);
		this.camera = Camera.init(this.player, 0, 0, game.ctx.w, game.ctx.h);
		this.map = Map.init(tiles, this.camera);

		this.ghouls = [
			new Ghoul().init(200, 285)
		];

		return this;
	},

	tick: function (input) {
		this.camera.tick();
		this.player.tick(input, this.map);
		this.ghouls = this.ghouls.filter(function (g) {
			return g.tick();
		});

		if (Math.random() < 0.01 && this.ghouls.length < 15) {
			this.ghouls.push(
				new Ghoul().init(5, [110, 280, 420][Math.random() * 3 | 0], 1)
			)
		}

		utils.checkCollisions([this.ghouls, this.player.projectiles]);
		utils.checkCollisions([this.ghouls, this.player.traps]);
		utils.checkCollision(this.player, this.player.projectiles, "hitSpear");
	},

	render: function (c) {

		c.clearRect(0, 0, c.w, c.h);

		// var grd = c.createLinearGradient(0, 0, 0, c.h);
		// grd.addColorStop(0, 'hsl(30, 50%, 25%)');
		// grd.addColorStop(1, 'hsl(20, 50%, 00%)');
		// c.fillStyle = grd;

		c.fillStyle = "#550";
		c.font = "10pt monospace";
		c.fillText("abcdefghijklmnopqrstuvwxyz", c.w * 0.5, c.h * 0.5);

		this.camera.render(c, [this.map, this.ghouls, this.player]);

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
	res: {},

	init: function () {
		this.ctx = this.createCanvas();
		this.res = {
			"tiles": GEN.tiles(this.tw, this.th)
		}
		audio.init();
		this.input = Input.init();
		this.reset();
		this.run();
	},

	setScreen: function (screen) {
		this.screen = screen.init();
	},

	createCanvas: function () {
		var can = document.createElement("canvas");
		can.setAttribute("id", "board");
		can.setAttribute("width", 720);
		can.setAttribute("height", 405);
		document.body.appendChild(can);
		var ctx = can.getContext("2d");
		if (!ctx) {
			alert("Could not get 2D context.");
			throw new Error("lol, no canvas dude.");
		}
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;

		ctx.w = ctx.canvas.width;
		ctx.h = ctx.canvas.height;

		return ctx;
	},

	createChars: function () {

	},

	reset: function () {
		this.setScreen(Screen.level);
	},

	run: function (d) {
		this.screen.tick(this.input);
		this.input.tick();
		this.screen.render(this.ctx);

		window.requestAnimationFrame(function () {
        	game.run(Date.now());
		});
	}

};
