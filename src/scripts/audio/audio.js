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
				o.connect(audio.master);
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
		},

		stop: function () {
			this.osc.stop(c.currentTime);
		}

};

}());

