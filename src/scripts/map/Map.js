(function () {

	var rooms,
		roomMap;

	window.Map = {

		x: 0,
		y: 0,

		init: function (sheet, camera) {

			this.sheet = sheet;
			this.camera = camera;

			var cells = [],
				roomsH = roomMap.length,
				roomsW = roomMap[0].length,
				cellW = rooms[0][0].length,
				cellH = rooms[0].length;

			cells = new Array(roomsH * cellH);

			for (var y = 0; y < cells.length; y++) {
				cells[y] = new Array(roomsW * cellW);
				for (var x = 0; x < cells[0].length; x++) {
					var roomX = x / cellW | 0,
						roomY = y / cellH | 0,
						room = roomMap[roomY][roomX];
					cells[y][x] = rooms[room][y % cellH][x % cellW];
				}
			}

			this.cells = cells;

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

		},
	};

	rooms = [
	[
		[ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 5, 1, 5, 5, 5, 5, 5, 5, 1, 5, 5]
	], [
		[ 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
		[ 8,12, 0, 0, 0, 0, 0, 0, 0, 0, 6],
		[ 5, 8,12, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 7, 8, 8,12, 0, 0, 0, 0, 0, 0, 0],
		[ 7, 8, 8, 8,12, 0, 0, 0, 0, 0, 0],
		[ 7, 0, 8, 8, 8,12, 0, 0, 0, 0, 0],
		[ 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	], [
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1],
		[ 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0],
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
		[ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1]
	], [
		[ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7],
		[ 0, 0, 0, 0, 0, 0, 2, 0, 0,11, 7],
		[ 6, 1, 1, 0, 0, 0, 3, 3, 3, 2, 7],
		[ 0, 1, 1, 0, 0, 0, 7, 7, 7, 2, 7],
		[ 0, 1, 1, 0, 0,11, 7, 7, 7, 2, 7],
		[ 5, 1, 1, 5, 5, 7, 7, 2, 4, 4, 7],
		[ 7, 7, 1, 7, 7, 7, 2, 2, 7, 7, 7]
	], [
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
		[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[7, 0, 0, 5,12, 0, 0, 0, 0, 0, 5],
		[7, 0, 5, 7, 7, 0, 0, 0, 0, 0, 7],
		[7, 5, 7, 7, 7, 0, 5, 5, 5, 1, 7]
	]
	];

	roomMap = [];

	for (var i = 0; i < 12; i++) {
		roomMap.push([]);
		for (var j = 0; j < 15; j++) {
			roomMap[i].push(Math.random() * (rooms.length) | 0);
		}
	}


}());

