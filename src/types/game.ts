export interface Position {
    x: number,
    y: number,
}

export enum Piece {
    PAWN = 'pawn',
    ROCK = 'rock',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    QUEEN = 'queen',
    KING = 'king',
}

export enum Type {
    BLACK = 'black',
    WHITE = 'white',
}

export interface Moves {
    top: string[]
    topRight: string[]
    right: string[]
    bottomRight: string[]
    bottom: string[]
    bottomLeft: string[]
    left: string[]
    topLeft: string[]
}

export interface Figure {
    piece: Piece
    type: Type,
    position: Position
    defaultMoves: Moves
    walkMoves?: Moves
    attackMoves?: Moves
    isMoved: boolean
}
export interface Square {
    position: Position
    figure?:Figure
}

export interface History {
    from: Position
    to: Position,
    figure: Figure
}

export type FiguresMap = {
    [key: string]: Figure
}

export type CheckedRows = {
    [key: string]: string[]
}

export interface DroppableFigure {
    positionFrom: Position,
    positionTo: Position,
    figure: Figure
}
export interface GameStore {
    figuresMap: FiguresMap,
    squares: Square[],
    history: History[],
    move: Type,
    checkedRows: CheckedRows,
    pinnedRows: string[],
    rules: FiguresMap,
    droppableFigure: DroppableFigure | null
    isShowDropdown: boolean
}
