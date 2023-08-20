"use client"
import { useEffect } from "react";

export default function PhaserPage() {
	useEffect(() => {
		async function initPhaser() {
			const Phaser = await import("phaser");
			const {default: BoardPlugin} = await import("phaser3-rex-plugins/plugins/board-plugin");

			const TILESMAP = [
				'11111  ',
				'    1  ',
				'  111  ',
				'  1    ',
				'  1111 ',
				'     1 ',
				'  1111 ',
				'111    '
			];
			const Between = Phaser.Math.Between;
			class Demo extends Phaser.Scene {
				rexBoard: BoardPlugin;
				constructor() {
					super()
				}

				preload() {
					this.load.image('tiles', "../../../terrain_atlas.png");
					this.load.tilemapTiledJSON('map', "../../../map.json");
				}

				create() {
					var map = this.make.tilemap({ key: 'map'});
					var tiles = map.addTilesetImage('atlas_terrain', 'tiles');
					var baseLayer = map.createLayer("base", tiles);
					var islandLayer = map.createLayer("island", tiles);

					var board = this.rexBoard.createBoardFromTilemap(map, "island");
					/*var board = this.rexBoard.add.board({
						grid: {
							gridType: 'quadGrid',
							x: 0,
							y: 0,
							cellWidth: 32,
							cellHeight: 32,
							type: 'orthogonal',
						},
						width: 10,
						height: 10,
						wrap: false,
						infinity: false,
					})*/
					board.forEachTileXY(function (tileXY, board) {
						var scene = board.scene as Demo;
						var tile = islandLayer?.getTileAt(tileXY.x, tileXY.y);
						if (tile.index === 113) {
							scene.rexBoard.add.shape(board, tileXY.x, tileXY.y, 2, 0xffffff, 1).setOrigin(0).setData('cost', 1);
						} else {
							scene.rexBoard.add.shape(board, tileXY.x, tileXY.y, 2, 0xffffff, 0.5).setOrigin(0).setData('cost', undefined);
						}
					});

					console.log(board)

					var chessA = new ChessA(board, {
						x: 1,
						y: 8
					});

					this.input.on('pointerdown', function (pointer) {
						var movingPoints = Between(1, 6);
						console.log("dado: " + movingPoints)
						chessA.moveForward(movingPoints);
					});

					console.log(board.getAllChess())

				}
			}

			class ChessA extends RexPlugins.Board.Shape {
				constructor(board, tileXY) {
					var scene = board.scene;
					if (tileXY === undefined) {
						tileXY = board.getRandomEmptyTileXY(0);
					}
					// Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
					super(board, tileXY.x, tileXY.y, 2, 0x3f51b5);
					scene.add.existing(this.setOrigin(0));

					// add behaviors
					this.monopoly = scene.rexBoard.add.monopoly(this, {
						pathTileZ: 2,
						costCallback: function (curTileXY, preTileXY, monopoly) {
							var board = monopoly.board;
							const tile = board.tileXYZToChess(curTileXY.x, curTileXY.y, 2);
							console.log(tile.rexChess.tileXYZ)
							return tile.getData('cost')
						},
					});
					this.moveTo = scene.rexBoard.add.moveTo(this);

					// private members
					this.movingPathTiles = [];
				}

				showMovingPath(tileXYArray) {
					this.hideMovingPath();
					var tileXY, worldXY;
					var scene = this.scene,
						board = this.rexChess.board;
					for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
						tileXY = tileXYArray[i];
						worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y, true);
						this.movingPathTiles.push(scene.add.circle(worldXY.x, worldXY.y, 8, 0xb0003a).setOrigin(-0.5));
					}
				}

				hideMovingPath() {
					for (var i = 0, cnt = this.movingPathTiles.length; i < cnt; i++) {
						this.movingPathTiles[i].destroy();
					}
					this.movingPathTiles.length = 0;
					return this;
				}

				moveForward(movingPoints) {
					if (this.moveTo.isRunning) {
						return this;
					}

					var path = this.monopoly.getPath(movingPoints);
					this.showMovingPath(path);
					this.moveAlongPath(path);
					return this;
				}

				moveAlongPath(path) {
					//console.log({path})
					//console.log(this.monopoly.getPath(path.length))
					if (path.length === 0) {
						return;
					}

					this.moveTo.once('complete', function () {
						this.moveAlongPath(path);
					}, this);
					var tileData = path.shift();
					this.moveTo.moveTo(tileData);
					this.monopoly.setFace(this.moveTo.destinationDirection);
					return this;
				}
			}

			var getQuadGrid = function (scene) {
				var grid = scene.rexBoard.add.quadGrid({
					x: 100,
					y: 100,
					cellWidth: 50,
					cellHeight: 50,
					type: 0
				});
				return grid;
			}

			var config = {
				type: Phaser.AUTO,
				parent: 'phaser-example',
				width: 800,
				height: 600,
				scale: {
					mode: Phaser.Scale.FIT,
					autoCenter: Phaser.Scale.CENTER_BOTH,
				},
				scene: Demo,
				plugins: {
					scene: [{
						key: 'rexBoard',
						plugin: BoardPlugin,
						mapping: 'rexBoard'
					}]
				}
			};

			var game = new Phaser.Game(config);
}
initPhaser()
}, []);

	return (<div id="game"></div>)
}
