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

