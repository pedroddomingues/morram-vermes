import type { Game, Move } from "boardgame.io";

const BOARD_SIZE = 24;

const SQUARE_TYPES_INDEX = [0, 1];

const SQUARE_TYPES = {
	0: "Nada",
	1: "Pergunta",
	2: "Indique outro jogador para responder",
	3: "Volte 2 casas",
	4: "Jogue o dado novamente",
};

const CARDS: card[] = [
	{
		question: "Quem é a mulher mais linda do mundo?",
		options: [
			{
				answer: "Thayná Machado Pereira",
				correct: true,
			},
			{
				answer: "Paola Oliveira",
				correct: false,
			},
			{
				answer: "Gisele Bunda da shein",
				correct: false,
			},
			{
				answer: "Qualquer outra",
				correct: false,
			},
		],
	},
	{
		question: "Qual é a cidade mais populosa do Brasil?",
		options: [
			{
				answer: "São Paulo",
				correct: true,
			},
			{
				answer: "Volta Redonda",
				correct: false,
			},
			{
				answer: "Santo Antônio de Pádua",
				correct: false,
			},
			{
				answer: "Curitiba",
				correct: false,
			},
		],
	},
];

interface option {
	answer: string;
	correct: boolean;
}

export interface card {
	image?: string;
	question: string;
	options: option[];
}

export interface player_state {
	color: string;
	name: string;
	position: number;
}

export interface game_state {
	path: number[];
	dice: number;
	players: Record<string, player_state>;
	deck: card[];
	withdraw_deck: card[];
	card?: card;
}

const move_piece: Move<game_state> = ({ G, playerID, random, events }) => {
	G.dice = random.D6();
	const next_position = G.players[playerID].position + G.dice;
	if (G.path[next_position] == 1 || next_position >= BOARD_SIZE) {
		alert("você caiu no quiz! se errar volte 3 casas");
		G.players[playerID].position = Math.min(next_position, BOARD_SIZE);
		events.setStage("quiz");
		return;
	} else if (G.path[next_position] == 3) {
		alert("ah não, você caiu no pântano! volte 2 casas");
		const back_position = next_position - 2;
		G.players[playerID].position = Math.max(back_position, 0);
		events.endTurn();
		return;
	} else if (G.path[next_position] == 4) {
		alert("que sorte! role o dado novamente");
		G.players[playerID].position = Math.min(next_position, BOARD_SIZE);
		events.setStage("moving");
		return;
	}
	G.players[playerID].position = Math.min(next_position, BOARD_SIZE);
	events.endTurn();
};

const draw_card: Move<game_state> = ({ G, random }) => {
	if (G.card) return;
	if (G.deck.length == 0) {
		G.deck = G.withdraw_deck;
		G.withdraw_deck = [];
		random.Shuffle(G.deck);
	}
	G.card = G.deck?.splice(random.Number() * G.deck.length, 1)[0];
};

const answer_question: Move<game_state> = ({ G, ctx, events }, option) => {
	if (!G.card) return;
	if (!option) return;
	if (G.card.options[option - 1].correct) {
		alert("acertou!!!");
		if (G.players[ctx.currentPlayer].position >= 24) {
			events.endGame();
			return;
		}
	} else {
		const next_position = G.players[ctx.currentPlayer].position - 3;
		G.players[ctx.currentPlayer].position =
			next_position < 0 ? 0 : next_position;
		alert("errou, volte 3 casas!!!!");
	}
	G.withdraw_deck?.push({ ...G.card });
	G.card = undefined;
	events.endTurn();
};

export function morram_vermes(
	players: Record<string, player_state>
): Game<game_state> {
	return {
		setup: (game_data) => {
			const initial_state: game_state = {
				path: Array(BOARD_SIZE),
				dice: 0,
				players,
				deck: CARDS,
				withdraw_deck: [],
			};
			for (let i = 0; i < BOARD_SIZE; i++) {
				initial_state.path[i] = Math.round(game_data.random.Number() * 4);
			}
			return initial_state;
		},
		moves: { move_piece, draw_card, answer_question },
		turn: {
			stages: {
				moving: {
					moves: { move_piece },
				},
				quiz: {
					moves: { draw_card, answer_question },
				},
			},
		},
	};
}
