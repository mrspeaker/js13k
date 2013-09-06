var Map = {

	x: 0,
	y: 0,

	init: function (sheet, camera) {

		this.sheet = sheet;
		this.camera = camera;

		this.cells = [
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 7, 1, 7, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[ 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
			[ 7, 0, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 1, 7, 7, 7, 5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 7],
			[ 7, 0, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 7, 7, 7, 7],
			[ 0, 5, 0, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 7],
			[ 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 7, 7, 7],
			[ 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 7, 7],
			[ 7, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 7, 7, 7, 7, 2, 7, 7],
			[ 7, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 1, 5, 5, 5, 5, 5, 5, 7, 2, 4, 4, 7, 7],
			[ 7, 0, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 7, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
			[ 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 0, 0, 5],
			[ 7, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 5],
			[ 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 5, 5, 5, 5, 5, 5],
			[ 7, 7, 7, 7, 7, 7, 7, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
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
