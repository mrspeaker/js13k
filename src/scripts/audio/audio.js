(function () {

	var c;

	function envelope(gain, time, volume, duration, a, d, s, r) {
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + a);
        gain.gain.linearRampToValueAtTime(volume * s, time + a + d);
        gain.gain.setValueAtTime(volume * s, time + a + d + duration);
        gain.gain.linearRampToValueAtTime(0, time + a + d + duration + r);
    }

	function noise () {
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

	window.audio = {

		jumpedat: Date.now(),

		sfx: {
			"jump": function() {
				if(!c) return;

				console.log(Date.now() - audio.jumpedat)
				if (Date.now() - audio.jumpedat < 100) {
					return;
				}
				audio.jumpedat = Date.now();

				var now = c.currentTime;
				var o = c.createOscillator();
				var f = c.createBiquadFilter();
				var g = audio.createGain();
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				g.gain.value = 0.35;
				f.frequency.value = 2000;
				f.Q.value = 3;

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(300, now);
				o.frequency.linearRampToValueAtTime(400, now + 0.09);

				audio.start(o, now);
				audio.stop(o, now + 0.1);
			},

			shoot: function () {
				if(!c) return;
				var now = c.currentTime;
				var s = audio.noise;
				var f = c.createBiquadFilter();
				var g = audio.createGain();

				envelope(g, now, 0.7, 0.04, 0.01, 0.01, 0.1, 0.1);

				var start = Math.random() * 2000 + 500 | 0;
				f.Q.value = 10;
				f.frequency.value = start;
				f.frequency.setValueAtTime(start, now);
				f.frequency.linearRampToValueAtTime(6000, now + 0.04);

				s.connect(f);
				f.connect(g);
				g.connect(audio.master);

			},

			pickup: function () {
				if(!c) return;
				var now = c.currentTime,
					o = c.createOscillator(),
					f = c.createBiquadFilter(),
					g = audio.createGain();
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				g.gain.value = 0.12;
				f.frequency.value = 3000;
				f.Q.value = 10;

				o.type = "sine"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(600, now);
				o.frequency.linearRampToValueAtTime(2600, now + 0.12);

				audio.start(o, 0);
				audio.stop(o, now + 0.12);
			},

			collect: function () {
				if(!c) return;
				var now = c.currentTime;
				var o = c.createOscillator(),
					lfo = c.createOscillator(),
					lfogain = audio.createGain();
				var f = c.createBiquadFilter();
				var g = audio.createGain();

				o.type = "sine"
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				lfo.type = "sine";
				lfo.frequency.value = 10;
				lfogain.gain.setValueAtTime(10, now);
				lfogain.gain.linearRampToValueAtTime(200, now + 1);
				lfo.connect(lfogain);
				lfogain.connect(o.frequency);

				g.gain.value = 1;
				audio.start(lfo, now);
				audio.start(o, now);
				audio.stop(o, now + 1);
			},

			swiggle: function () {
				if(!c) return;
				var now = c.currentTime;
				var o = c.createOscillator();
				var f = c.createBiquadFilter();
				var g = audio.createGain();
				o.connect(f);
				f.connect(g);
				g.connect(audio.master);

				g.gain.value = 0.10;
				f.frequency.value = 3000;
				f.Q.value = 10;

				o.type = "square"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(50, now);
				o.frequency.linearRampToValueAtTime(600, now + 0.32);

				audio.start(o, 0);
				audio.stop(o, now + 0.32);
			},

			die: function () {
				if(!c) return;
				var now = c.currentTime,
					s = audio.noise,
					f = c.createBiquadFilter(),
					g = audio.createGain();

				envelope(g, now, 0.6, 0.5, 0.01, 0.01, 0.4, 0.08);

				var start = Math.random() * 20000 + 500 | 0;
				f.Q.value = 10;
				f.frequency.value = start;
				f.frequency.setValueAtTime(start, now);
				f.frequency.linearRampToValueAtTime(200, now + 0.5);

				s.connect(f);
				f.connect(g);
				g.connect(audio.master);

			}
		},

		init: function () {
			// Some "polyfilling" of webaudio api
			if (window.AudioContext) {
				c = new AudioContext();
			} else if (window.webkitAudioContext) {
				c = new webkitAudioContext();
			}

			this.createGain = function () {
				var node = null;
				if (c.createGain) { node = c.createGain(); }
				else if (c.createGainNode) { node = c.createGainNode(); }
				else { this.ctx = c = null; }
				return node
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

			if (c && (!this.createGain() || !c.createOscillator)) {
				c = null;
			}

			if (!c) {
				document.querySelector("#na").style.display = "block";
				return;
			}

			this.noise = noise();
			this.start(this.noise, 0);

			this.master = audio.createGain();
			this.master.gain.value = 1;
			this.master.connect(c.destination);

		},

		stop: function () {
			this.osc.stop(c.currentTime);
		}

};

}());

