(function () {

	var c = new (window.AudioContext || window.webkitAudioContext)();

	function Modulator (type, freq, gain) {
	  this.osc = audioCtx.createOscillator();
	  this.gain = audioCtx.createGainNode();
	  this.osc.type = type;
	  this.osc.frequency.value = freq;
	  this.gain.gain.value = gain;
	  this.osc.connect(this.gain);
	  this.osc.start(0);
	}

	window.audio = {

		sfx: {
			"jump": function() {
				var now = c.currentTime;
				var o = c.createOscillator();
				var f = c.createBiquadFilter();

				o.connect(f);
				f.connect(audio.master);

				f.frequency.value = 300;
				f.Q.value = 8;


				o.type = "square"
				o.frequency.value = 0;
				o.frequency.setValueAtTime(200, 0);
				o.frequency.linearRampToValueAtTime(400, now + 0.01);
				o.start(0);
				o.stop(now + 0.01);
			}
		},

		init: function () {
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

