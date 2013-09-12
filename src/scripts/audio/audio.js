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

	function envelope(gain, time, volume, duration, a, d, s, r) {
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + a);
        gain.gain.linearRampToValueAtTime(volume * s, time + a + d);
        gain.gain.setValueAtTime(volume * s, time + a + d + duration);
        gain.gain.linearRampToValueAtTime(0, time + a + d + duration + r);
    }

    // trigger: function(time) {
    //     this.noise.start(time, 1);
    //     envelope(this.noise.gain, time, this.volume, 0.05,
    //     0.01, 0.03, 0.25, this.release);
    //     this.noise.filter.frequency.setValueAtTime(this.freqFrom, time);
    //     this.noise.filter.frequency.linearRampToValueAtTime(this.freqTo, time + 0.1);
    // }

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

				//var f = c.createBiquadFilter();

				s.connect(audio.master);
				//f.Q.value = 20;
				//var start = Math.random() * 2000 + 500 | 0;
				//f.frequency.value = start;
				//f.frequency.setValueAtTime(start, now);
				//f.frequency.linearRampToValueAtTime(100, now + 0.02);

				//s.connect(f);

				s.start(now, 0.04);
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

