var audio = {

	init: function () {
		var c = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		var osc = this.osc = c.createOscillator();
		osc.type = "sine";
		osc.connect(c.destination);
		osc.start(0);
		osc.stop(c.currentTime + 0.2);
		osc.frequency.setValueAtTime(300, 0);
		osc.frequency.linearRampToValueAtTime(1000, c.currentTime + 0.2);
	},

	stop: function () {
		this.osc.stop(c.currentTime);
	}

}