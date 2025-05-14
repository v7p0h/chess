import {DroppableFigure, Figure, Position} from "../../types/game";

export enum GAME_ACTIONS {
    MOVE_FIGURE = 'MOVE_FIGURE',
    SET_HISTORY = 'SET_HISTORY',
    UPDATE_FIGURES_RULES = 'UPDATE_FIGURES_RULES',
    UPDATE_MOVE = 'UPDATE_MOVE',
    SHOW_DROPDOWN = 'SHOW_DROPDOWN',
    HIDE_DROPDOWN = 'HIDE_DROPDOWN',
    UPDATE_FIGURE_PIECE = 'UPDATE_FIGURE_PIECE',
    SET_DROP_FIGURE = 'SET_DROP_FIGURE',
    RESET_DROP_FIGURE = 'RESET_DROP_FIGURE',
}

export const moveFigure = (positionFrom:Position, positionTo: Position, figure:Figure) => {
    return {
        type: GAME_ACTIONS.MOVE_FIGURE,
        positionFrom,
        positionTo,
        figure
    }
}
export const setHistory = (positionFrom:Position, positionTo: Position, figure:Figure) => {
    return {
        type: GAME_ACTIONS.SET_HISTORY,
        positionFrom,
        positionTo,
        figure
    }
}
export const updateFiguresRules = () => {
    return {
        type: GAME_ACTIONS.UPDATE_FIGURES_RULES
    }
}
export const updateMove = () => {
    return {
        type: GAME_ACTIONS.UPDATE_MOVE
    }
}
export const showDropdown = () => {
    return {
        type: GAME_ACTIONS.SHOW_DROPDOWN,
    }
}
export const hideDropdown = () => {
    return {
        type: GAME_ACTIONS.HIDE_DROPDOWN
    }
}
export const updateFigurePiece = ({position, piece}) => {
    return {
        type: GAME_ACTIONS.UPDATE_FIGURE_PIECE,
        position,
        piece
    }
}

export const setDropFigure = (droppableFigure:DroppableFigure) => {
    return {
        type: GAME_ACTIONS.SET_DROP_FIGURE,
        droppableFigure
    }
}
export const resetDropFigure = () => {
    return {
        type: GAME_ACTIONS.RESET_DROP_FIGURE
    }
}