(function () {

	var c;

	function envelope(gain, time, volume, duration, a, d, s, r) {
		var g = gain.gain;
        g.cancelScheduledValues(0);
        g.setValueAtTime(0, time);
        g.linearRampToValueAtTime(volume, time + a);
        g.linearRampToValueAtTime(volume * s, time + a + d);
        g.setValueAtTime(volume * s, time + a + d + duration);
        g.linearRampToValueAtTime(0, time + a + d + duration + r);
    }

    function gainWithFilter(input, gain, freq, q) {
		var f = c.createBiquadFilter(),
			g = createGain();

		input.connect(f);
		f.connect(g);

		g.gain.value = gain;
		f.frequency.value = freq;
		f.Q.value = q;

		return [g, f];
    }

	function createNoise () {
		var buf = c.createBuffer(1, (60 / 120) * c.sampleRate, c.sampleRate),
			data = buf.getChannelData(0),
			node;

		for (i = 0; i < data.length; i++) {
			data[i] = (Math.random() * 2 - 1) / 2;
		}

		node = c.createBufferSource();
		node.buffer = buf;
		node.loop = true;
		return node;
	}

	function createGain() {
		var node;
		if (c.createGain) { node = c.createGain(); }
		else if (c.createGainNode) { node = c.createGainNode(); }
		else { audio.ctx = c = null; }
		return node;
	}

	window.audio = {

		jumpedAt: Date.now(),

		sfx: {
			jump: function() {
				if (!c || Date.now() - audio.jumpedAt < 100) {
					return;
				}
				audio.jumpedAt = Date.now();

				var now = c.currentTime,
					o = c.createOscillator();

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(300, now);
				o.frequency.linearRampToValueAtTime(400, now + 0.09);

				gainWithFilter(o, 0.35, 2000, 3)[0].connect(audio.master);

				audio.start(o, now);
				audio.stop(o, now + 0.1);
			},

			shoot: function () {
				if (!c) return;
				var now = c.currentTime,
					start = Math.random() * 2000 + 500 | 0,
					s = audio.noise,
					gf;

				gf = gainWithFilter(s, 1, start, 10);
				gf[1].frequency.setValueAtTime(start, now);
				gf[1].frequency.linearRampToValueAtTime(6000, now + 0.04);
				envelope(gf[0], now, 0.7, 0.04, 0.01, 0.01, 0.1, 0.1);
				gf[0].connect(audio.master);
			},

			pickup: function () {
				if (!c) return;
				var now = c.currentTime,
					o = c.createOscillator();

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(600, now);
				o.frequency.linearRampToValueAtTime(2600, now + 0.12);

				gainWithFilter(o, 0.12, 3000, 10)[0].connect(audio.master);

				audio.start(o, 0);
				audio.stop(o, now + 0.12);
			},

			collect: function () {
				if (!c) return;
				var now = c.currentTime;
				var o = c.createOscillator(),
					lfo = c.createOscillator(),
					lfoGain = createGain();

				gainWithFilter(o, 1, 350, 1)[0].connect(audio.master);

				o.type = "sine"

				lfo.type = "sine";
				lfo.frequency.value = 10;
				lfoGain.gain.setValueAtTime(10, now);
				lfoGain.gain.linearRampToValueAtTime(200, now + 1);
				lfo.connect(lfoGain);
				lfoGain.connect(o.frequency);

				audio.start(lfo, now);
				audio.start(o, now);
				audio.stop(lfo, now + 1);
				audio.stop(o, now + 1);
			},

			swiggle: function () {
				if (!c) return;
				var now = c.currentTime,
					o = c.createOscillator();

				gainWithFilter(o, 0.10, 3000, 10)[0].connect(audio.master);

				o.type = "square";
				o.frequency.value = 0;
				o.frequency.setValueAtTime(50, now);
				o.frequency.linearRampToValueAtTime(600, now + 0.32);

				audio.start(o, 0);
				audio.stop(o, now + 0.32);
			},

			die: function () {
				if (!c) return;
				var now = c.currentTime,
					s = audio.noise,
					start = Math.random() * 20000 + 500 | 0,
					gf;

				gf = gainWithFilter(s, 1, start, 10);
				envelope(gf[0], now, 0.6, 0.5, 0.01, 0.01, 0.4, 0.08);

				gf[1].frequency.setValueAtTime(start, now);
				gf[1].frequency.linearRampToValueAtTime(200, now + 0.5);
				gf[0].connect(audio.master);
			}
		},

		init: function () {
			// Some "polyfilling" of webaudio api
			if (window.AudioContext) {
				c = new AudioContext();
			} else if (window.webkitAudioContext) {
				c = new webkitAudioContext();
			}

			this.start = function (node, time) {
				if (node.start) { node.start(time); }
				else if (node.noteOn) { node.noteOn(time); }
				else { this.ctx = c = null; }
			}
			this.stop = function (node, time) {
				if (node.stop) { node.stop(time); }
				else if (node.noteOff) { node.noteOff(time); }
				else { this.ctx = c = null; }
			}

			if (c && (!createGain() || !c.createOscillator)) {
				c = null;
			}

			if (!c) {
				document.querySelector("#na").style.display = "block";
				return;
			}

			this.noise = createNoise();
			this.start(this.noise, 0);

			this.master = createGain();
			this.master.gain.value = 1;
			this.master.connect(c.destination);
		}

	};

}());
