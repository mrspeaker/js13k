var Map = {

	x: 0,
	y: 0,

	init: function (sheet, camera) {

		this.sheet = sheet;
		this.camera = camera;
		this.camera.x = 40;

		this.cells = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		this.walkable = 0;
		this.cellH = this.cells.length;
		this.cellW = this.cells[0].length;
		this.h = this.cellH * sheet.h;
		this.w = this.cellW * sheet.w;

		return this;

	},

	tick: function (player) {

		// Move camera to player pos
		this.camera.x += Math.sin(Date.now() / 1000);

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
