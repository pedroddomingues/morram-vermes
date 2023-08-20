'use client'

import type { BoardProps } from 'boardgame.io/react';
import type { game_state } from '.';

interface game_props extends BoardProps<game_state> {}

export function Board({ ctx, G, moves, reset }: game_props) {
	const move_piece = () => moves.move_piece();
	const click_option = (option: number) => moves.answer_question(option);
	const draw_card = () => moves.draw_card();
	const reset_game = () => reset();

	return (
		<div className='flex flex-col items-start gap-6 px-24 py-8'>
		{ ctx.gameover ?
			(
				<div>
					<p>O vencedor é: { G.players[ctx.currentPlayer].name }</p>
					<button onClick={() => reset_game()}>Reiniciar jogo</button>
				</div>
			) : (
			<>
				<p>Morram, vermes!!</p>
				<p>Jogador da vez: {G.players[ctx.currentPlayer].name}</p>
				<p>Dado: {G.dice}</p>
				<p>Posição {G.players[0].name}: {G.players[0].position}</p>
				<p>Posição {G.players[1].name}: {G.players[1].position}</p>
				{(ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] == "quiz") ? <button onClick={() => draw_card()}>Tire uma carta</button> : <button onClick={() => move_piece()}>Role o dado</button>}
				{G.card &&
					<div>
						<h2>{G.card.question}</h2>
						<div className='flex flex-col items-start gap-2'>
							{G.card.options.map((option, i) => (
								<button key={i} onClick={() => click_option(i+1)}>{option.answer}</button>
							))}
						</div>
					</div>
				}
			</>
		)}
		</div>
	);
}
