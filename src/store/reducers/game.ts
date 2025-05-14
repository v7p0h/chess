import {
    getFigureWithDefaultMoves,
    getKey,
    initGame,
    isEnPassant, updateFiguresMap
} from "../../utils/game"
import {GAME_ACTIONS} from "../actions/game";
import {GameStore, Type} from "../../types/game";

const [squares, figuresMap] = initGame();

const initialState:GameStore = {
    figuresMap,
    squares,
    history: [],
    move: Type.WHITE,
    checkedRows: {},
    pinnedRows: [],
    rules: {},
    isShowDropdown: false,
    droppableFigure: null
}

export const gameReducer = (state:GameStore = initialState, action) => {
    const {type, positionTo, positionFrom, figure} = action;

    switch (type) {
        case GAME_ACTIONS.UPDATE_FIGURES_RULES:
            return {
                ...state,
                figuresMap: updateFiguresMap({
                    figuresMap:state.figuresMap,
                    move: state.move,
                    checkedRows: state.checkedRows,
                    history: state.history
                }),
            }
        case GAME_ACTIONS.MOVE_FIGURE:
            const fromKey = getKey(positionFrom);
            const toKey = getKey(positionTo);
            const figureFrom = state.figuresMap[fromKey];
            const enPassant = isEnPassant(figure, positionTo, state.history)

            if(enPassant) {
                delete state.figuresMap[getKey(state.history[state.history.length - 1].to)]
            } else {
                const figureTo = state.figuresMap[toKey]

                if(figureTo) {
                    delete state.figuresMap[toKey]
                }
            }

            delete state.figuresMap[fromKey];

            const newFigure = {
                ...figureFrom,
                position: positionTo
            }

            const newFiguresMap =  {
                ...state.figuresMap,
                [toKey]: getFigureWithDefaultMoves({
                    figure: newFigure,
                    squares: state.squares
                })
            }

            return {
                ...state,
                figuresMap: newFiguresMap
            }
        case GAME_ACTIONS.SET_HISTORY:
            return {
                ...state,
                history: [...state.history, { from: positionFrom, to: positionTo, figure }]
            }
        case GAME_ACTIONS.UPDATE_MOVE:
            return {
                ...state,
                move: state.move === Type.BLACK ? Type.WHITE : Type.BLACK
            }
        case GAME_ACTIONS.SHOW_DROPDOWN:
            return {
                ...state,
                isShowDropdown: true
            }
        case GAME_ACTIONS.HIDE_DROPDOWN:
            return {
                ...state,
                isShowDropdown: false
            }
        case GAME_ACTIONS.UPDATE_FIGURE_PIECE:
            return {
                ...state,
                figuresMap: {
                    ...state.figuresMap,
                    [getKey(action.position)]: getFigureWithDefaultMoves({
                        figure: {
                            ...state.figuresMap[getKey(action.position)],
                            piece: action.piece
                        },
                        squares: state.squares,
                    }),
                }
            }
        case GAME_ACTIONS.SET_DROP_FIGURE:
            return {
                ...state,
                droppableFigure: action.droppableFigure
            }
        case GAME_ACTIONS.RESET_DROP_FIGURE:
            return {
                ...state,
                droppableFigure: null
            }
        default:
          return state
      }
}
