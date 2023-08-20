import Phaser from "phaser";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";

const Random = Phaser.Math.Between;

class Demo extends Phaser.Scene {
	rexBoard: BoardPlugin;
	board: BoardPlugin.Board;
	print: Phaser.GameObjects.Text;
	cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;

	constructor() {
		super({
			key: "examples",
		});
	}

	preload() {}

	create() {
		var board = this.rexBoard.add
			.board({
				// grid: getHexagonGrid(this),
				// grid: getQuadGrid(this),
				grid: {
					gridType: "quadGrid",
					x: 10,
					y: 10,
					cellHeight: 50,
					cellWidth: 50,
				},

				width: 10,
				height: 10,
			})
			.forEachTileXY(function (tileXY, board) {
				var scene = board.scene as Demo;
				var chess = scene.rexBoard.add.shape(
					board,
					tileXY.x,
					tileXY.y,
					0,
					Random(0, 0xffffff),
					0.7
				);
				/*this.add
					.text(chess.x, chess.y, tileXY.x + "," + tileXY.y)
					.setOrigin(0.5)
					.setTint(0x0);*/
			});

		board
			.setInteractive()
			.on("tiledown", function (pointer, tileXY) {
				console.log("down " + tileXY.x + "," + tileXY.y);
			})
			.on("tileup", function (pointer, tileXY) {
				console.log("up " + tileXY.x + "," + tileXY.y);
			})
			.on("tilemove", function (pointer, tileXY) {
				console.log("move " + tileXY.x + "," + tileXY.y);
			})
			.on("tileover", function (pointer, tileXY) {
				console.log("over " + tileXY.x + "," + tileXY.y);
			})
			.on("tileout", function (pointer, tileXY) {
				console.log("out " + tileXY.x + "," + tileXY.y);
			})
			.on("gameobjectdown", function (pointer, gameObject) {
				gameObject.setFillStyle(Random(0, 0xffffff), 0.7);
			})
			.on("tile1tap", function (tap, tileXY) {
				console.log("1 tap " + tileXY.x + "," + tileXY.y);
			})
			.on("tile2tap", function (tap, tileXY) {
				console.log("2 tap " + tileXY.x + "," + tileXY.y);
			})
			.on("tilepressstart", function (press, tileXY) {
				console.log("press start " + tileXY.x + "," + tileXY.y);
			})
			.on("tilepressend", function (press, tileXY) {
				console.log("press end " + tileXY.x + "," + tileXY.y);
			})
			.on("tileswipe", function (swipe, tileXY) {
				console.log(`swipe-${swipe.direction} ` + tileXY.x + "," + tileXY.y);
			});

		this.board = board;
		this.print = this.add.text(0, 0, "").setScrollFactor(0);

		var cursors = this.input.keyboard.createCursorKeys();
		this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
			camera: this.cameras.main,

			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),

			acceleration: 0.06,
			drag: 0.003,
			maxSpeed: 0.3,
		});
	}

	update(time, delta) {
		this.cameraController.update(delta);

		var pointer = this.input.activePointer;
		var out = this.board.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
		this.print.setText(out.x + "," + out.y);
	}
}

export default Demo;
