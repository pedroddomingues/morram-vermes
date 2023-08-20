'use client';

import { Client } from "boardgame.io/react";
import { morram_vermes } from "./game";
import { Board } from "./game/Board";

const GameClient = Client({
	game: morram_vermes({ 0: { name: "Pedro", color: "black", position: 0 }, 1: { name: "Thayná", color: "white", position: 0 }}),
	board: Board,
});

export default function Home() {
	return (
		<GameClient />
	);
}
