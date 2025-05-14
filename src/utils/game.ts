import {CheckedRows, Figure, FiguresMap, History, Moves, Piece, Position, Square, Type} from "../types/game";

interface MovementProps {
    position: Position
    toPosition: Position
}

interface CanMoveFigureProps extends MovementProps {
    figure: Figure
}

interface PinnedRows {
    [key: string]: string[]
}

interface Movement {
    move: Type
    checkedRows:CheckedRows
    figuresMap: FiguresMap
    squares: Square[]
    figure:Figure
    defaultMoves: Moves
    attackMoves: Moves
    walkMoves: Moves
    enemyFigures: Figure[]
    figures: Figure[]
    pinnedRows: PinnedRows
    history: History[]
}

const defaultMoves:Moves = {
    top: [],
    topRight: [],
    right: [],
    bottomRight: [],
    bottom: [],
    bottomLeft: [],
    left: [],
    topLeft: [],
}
export const getKey = (position:Position) => {
    return `${position.x}-${position.y}`
}
export const fromKey = (key:string):Position => {
    return {x: parseInt(key[0]), y: parseInt(key[2])}
}

export const initGame = ():[Square[], FiguresMap] => {

    const [squares, figuresMap] = new Array(64)
        .fill(undefined)
        .reduce<[Square[], FiguresMap]>(([squares, figuresMap], _, index) => {
        const x = Math.floor(index / 8);
        const y = index % 8;
        const position = {x, y};


        if(x === 1) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.PAWN,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(x === 6) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.PAWN,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(
            (y === 1 && x === 0) ||
            (y === 6 && x === 0)
         ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.KNIGHT,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(
            (y === 1 && x === 7) ||
            (y === 6 && x === 7)
        ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.KNIGHT,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(
            (y === 2 && x === 0) ||
            (y === 5 && x === 0)
         ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.BISHOP,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(
            (y === 2 && x === 7) ||
            (y === 5 && x === 7)
        ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.BISHOP,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }
                
        if(
            (y === 0 && x === 0) ||
            (y === 7 && x === 0)
         ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.ROCK,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(
            (y === 0 && x === 7) ||
            (y === 7 && x === 7)
        ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.ROCK,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(y === 3 && x === 0) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.QUEEN,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if((y === 3 && x === 7) ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.QUEEN,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        if(y === 4 && x === 0 ) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.KING,
                type: Type.BLACK,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }


        if(y === 4 && x === 7) {
            figuresMap[getKey(position)] = {
                position,
                piece: Piece.KING,
                type: Type.WHITE,
                defaultMoves: defaultMoves,
                isMoved: false,
            }
        }

        squares.push({position})

        return [squares, figuresMap];
    }, [[], {}])


    const figuresMapWithMoves = getFiguresMapWithMoves(squares, figuresMap);

    return [squares, figuresMapWithMoves];
}

export const getFiguresMapWithMoves = (squares:Square[], figuresMap:FiguresMap):FiguresMap => {
    const figures = Object.values(figuresMap);
    return  figures.reduce(( acc, figure) => {
        return {
            ...acc,
            [getKey(figure.position)]: getFigureWithDefaultMoves({squares, figure})
        }
    }, {});
}

type GetFigureWithDefaultMoves = Pick<Movement, 'figure' | 'squares'>
export const getFigureWithDefaultMoves = ({squares, figure}:GetFigureWithDefaultMoves):Figure => {
    const defaultMoves = defineMoves(squares, figure.position, figure);

    return {
        ...figure,
        defaultMoves,
        walkMoves: defaultMoves,
        attackMoves: defaultMoves
    }
}

export const defineMoves = (squares:Square[], position:Position, figure:Figure):Moves => {
    return squares.reduce((defaultMoves, square) => {
        if(canMoveFigure({figure, position, toPosition: square.position})) {
            let direction = getDirection({position, toPosition: square.position})

            return {
                ...defaultMoves,
                [direction]: [...defaultMoves[direction], getKey(square.position)]
            }
        }

        return defaultMoves;
    }, defaultMoves)
};

export const canMoveFigure = ({figure, ...movementProps}:CanMoveFigureProps) => {

    switch (figure.piece) {
        case Piece.PAWN:
            return movePawn(movementProps);
        case Piece.KNIGHT:
            return moveKnight(movementProps);
        case Piece.BISHOP:
            return moveBishop(movementProps);
        case Piece.ROCK:
            return moveRock(movementProps);
        case Piece.QUEEN:
            return moveQueen(movementProps);
        case Piece.KING:
            return moveKing(movementProps);
        default:
            return false
    }
}

const getDirection = ({position, toPosition}:MovementProps):keyof Moves => {
    if(toPosition.y === position.y && toPosition.x < position.x) {
        return "top"
    }
    if(toPosition.y === position.y && toPosition.x > position.x) {
        return "bottom"
    }
    if(toPosition.x === position.x && toPosition.y > position.y) {
        return "right"
    }
    if(toPosition.x === position.x && toPosition.y < position.y) {
        return "left"
    }
    if(position.x > toPosition.x && position.y > toPosition.y) {
        return "topLeft"
    }
    if(position.x > toPosition.x && position.y < toPosition.y) {
        return "topRight"
    }
    if(position.x < toPosition.x && position.y < toPosition.y) {
        return "bottomLeft"
    }
    if(position.x < toPosition.x && position.y > toPosition.y) {
        return "bottomRight"
    }
}


type GetAttackMovesProps = Pick<Movement, 'figure' | 'defaultMoves' | 'checkedRows' | 'pinnedRows'>
const getAttackMoves = ({figure, checkedRows, pinnedRows}:GetAttackMovesProps):Moves => {
    const figureKey = getKey(figure.position);
    const defaultMovesEntries = Object.entries(figure.defaultMoves) as [keyof Moves, string[]][];
    const pinnedRow = pinnedRows[figureKey];

    switch (figure.piece) {
        case Piece.PAWN:
            return defaultMovesEntries.reduce((acc, [direction, moves]) => {
                return {
                    ...acc,
                    [direction]: moves.filter(move => {
                        const movePosition = fromKey(move);
                        let right;
                        let left;
                        const canBlock = canBlockCheck(move, checkedRows);

                        let movementByPinnedRow = true;

                        if(pinnedRow) {
                            movementByPinnedRow = pinnedRow.includes(move);
                        }

                        if(figure.type === Type.BLACK) {
                            right =
                                figure.position.y + 1 === movePosition.y &&
                                figure.position.x + 1 === movePosition.x
                            left =
                                figure.position.y - 1 === movePosition.y &&
                                figure.position.x + 1 === movePosition.x
                        } else {
                            right =
                                figure.position.y - 1 === movePosition.y &&
                                figure.position.x + 1 === movePosition.x
                            left =
                                figure.position.y - 1 === movePosition.y &&
                                figure.position.x - 1 === movePosition.x
                        }

                        return (left || right) && canBlock && movementByPinnedRow
                    })
                }
            }, {}) as Moves
        default:
            return Object.assign({}, figure.defaultMoves);
    }
}

type GetWalkMovesProps = Pick<Movement, 'figure' | 'defaultMoves' | 'checkedRows' | 'figuresMap' | 'enemyFigures' | 'pinnedRows' | 'history'>
const getWalkMoves = ({figure, defaultMoves, checkedRows, figuresMap, enemyFigures, pinnedRows, history}:GetWalkMovesProps):Moves => {
    const figureKey = getKey(figure.position);
    const defaultMovesEntries = Object.entries(defaultMoves);
    const pinnedRow = pinnedRows[figureKey];

    if(figure.piece === Piece.KING) {
        return defaultMovesEntries.reduce((acc, [direction, moves]) => {
            return {
                ...acc,
                [direction]: moves.filter(move => {
                    const inRow = Object.values(checkedRows).some(row=> row.includes(move));
                    const isSameType = isSameFigureType(figure, figuresMap, move);
                    const dangerSquare = enemyFigures.some(enemyFigure => {
                        return Object.values(enemyFigure.attackMoves).some( enemyDirection => {
                            return !!enemyDirection.find( enemyMove => enemyMove === move )
                        })
                    })
                    return !inRow && !dangerSquare && !isSameType
                })
            };
        }, {} as Moves)
    }

    if(figure.piece === Piece.PAWN) {
        if(figure.position.x === 1 && figure.position.y === 4) {
            console.log({defaultMovesEntries, figure})
        }
        return defaultMovesEntries.reduce((acc, [direction, moves]) => {
            return {
                ...acc,
                [direction]: moves.filter(move => {
                    const movePosition = fromKey(move);
                    let isFirstMove;
                    let moveForward;
                    let moveForward2;
                    let right;
                    let left;
                    const canBlock = canBlockCheck(move, checkedRows)
                    //todo make another function to check this.
                    let movementByPinnedRow = true;

                    if(pinnedRow) {
                        movementByPinnedRow = pinnedRow.includes(move);
                    }

                    if(figure.type === Type.BLACK) {
                        isFirstMove = figure.position.x === 1;

                        const figureMoveForward = figuresMap[getKey({x: figure.position.x + 1, y: figure.position.y})]
                        const figureMoveForward2 = figuresMap[getKey({x: figure.position.x + 2, y: figure.position.y})]
                        const figureRight = figuresMap[getKey({x: figure.position.x + 1, y: figure.position.y + 1})]
                        const figureLeft = figuresMap[getKey({x: figure.position.x + 1, y: figure.position.y - 1})]
                        right = figure.position.x + 1 === movePosition.x &&
                                figure.position.y + 1 === movePosition.y &&
                                !!figureRight &&
                                figureRight.type !== Type.BLACK;
                        left = figure.position.x + 1 === movePosition.x &&
                                figure.position.y - 1 === movePosition.y &&
                                !!figureLeft &&
                                figureLeft.type !== Type.BLACK;
                        moveForward =
                            figure.position.x + 1 === movePosition.x &&
                            figure.position.y === movePosition.y &&
                            !figureMoveForward;

                        moveForward2 = figure.position.x + 2 === movePosition.x &&
                            figure.position.y === movePosition.y &&
                            !figureMoveForward &&
                            !figureMoveForward2

                        if(
                            figure.position.x === 1 && figure.position.y === 4 &&
                            (
                                (movePosition.x === 2 && movePosition.y === 4) ||
                                (movePosition.y === 4 &&movePosition.x === 3)
                            )
                        )
                        {
                            console.log({figure, isFirstMove, moveForward2, moveForward, movePosition})
                        }

                    } else {
                        const figureMoveForward = figuresMap[getKey({x: figure.position.x - 1, y: figure.position.y})];
                        const figureMoveForward2 = figuresMap[getKey({x: figure.position.x - 2, y: figure.position.y})];
                        const figureRight = figuresMap[getKey({x: figure.position.x - 1, y: figure.position.y + 1})]
                        const figureLeft = figuresMap[getKey({x: figure.position.x - 1, y: figure.position.y - 1})]

                        isFirstMove = figure.position.x === 6;
                        moveForward =
                            figure.position.x - 1 === movePosition.x &&
                            figure.position.y === movePosition.y &&
                            !figureMoveForward
                        ;
                        right = figure.position.x - 1 === movePosition.x &&
                            figure.position.y + 1 === movePosition.y &&
                            !!figureRight &&
                            figureRight.type !== Type.WHITE;
                        left = figure.position.x - 1 === movePosition.x &&
                            figure.position.y - 1 === movePosition.y &&
                            !!figureLeft &&
                            figureLeft.type !== Type.WHITE;
                        moveForward2 =
                            figure.position.x - 2 === movePosition.x &&
                            figure.position.y === movePosition.y &&
                            !figureMoveForward &&
                            !figureMoveForward2
                    }
                    const enPassant  = isEnPassant(figure, movePosition, history);

                    return isFirstMove ?
                        (moveForward || moveForward2 || left || right) && canBlock && movementByPinnedRow :
                        (moveForward || left || right || enPassant) && canBlock && movementByPinnedRow;
                })
            };
        }, {} as Moves)
    }

    return Object.assign({}, defaultMoves);
}

export const updateFiguresMap = ({figuresMap, move, history}:Pick<Movement, 'move' | 'checkedRows' | 'figuresMap' | 'history'>):FiguresMap => {
    const selfFigures = getPiecesByType(figuresMap, move)
    const enemyFigures = getPiecesByType(figuresMap, move, true)

    const updatedEnemyMap = restrictMoves({
        checkedRows: {},
        pinnedRows: {},
        history: [],
        move,
        figuresMap,
        figures: enemyFigures,
        enemyFigures: selfFigures
    })

    const enemyUpdatedFm = {
        ...figuresMap,
        ...updatedEnemyMap
    }
    const updatedEnemyFigures = Object.values(updatedEnemyMap);
    const checkedRows = getCheckedRows(move, enemyUpdatedFm);
    const pinnedRows = getPinnedRows({
        enemyFigures: updatedEnemyFigures,
        move,
        figuresMap: enemyUpdatedFm
    });

    const updatedSelfMoves = restrictMoves({
        checkedRows,
        move,
        figuresMap,
        figures: selfFigures,
        enemyFigures: updatedEnemyFigures,
        pinnedRows,
        history
    });

    return {
        ...enemyUpdatedFm,
        ...updatedSelfMoves
    }
}

type RestrictMovesProps = Pick<Movement, 'move' | 'checkedRows' | 'figures' | 'enemyFigures' | 'figuresMap' | 'pinnedRows' | 'history'>
const restrictMoves = ({figures, ...restProps}:RestrictMovesProps):FiguresMap => {


    return figures.reduce((newFiguresMap, figure) => {
        const restrictProps = {figure, ...restProps}

        if(figure.piece === Piece.PAWN) {

            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictPawnMoves(restrictProps)
            }
        }

        if(figure.piece === Piece.KING) {
            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictKingMoves(restrictProps)
            }
        }

        if(figure.piece === Piece.KNIGHT) {

            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictKnightMoves(restrictProps)
            }
        }
        if(figure.piece === Piece.ROCK) {
            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictRockMoves(restrictProps)
            }
        }
        if(figure.piece === Piece.BISHOP) {

            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictBishopMoves(restrictProps)
            }
        }
        if(figure.piece === Piece.QUEEN) {

            return {
                ...newFiguresMap,
                [getKey(figure.position)]: restrictQueenMoves(restrictProps)
            }
        }

        return {
            ...newFiguresMap,
            [getKey(figure.position)]: {
                ...figure,
            }
        }
    }, {})
}

type RestrictPawnMovesProps = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'enemyFigures' | 'pinnedRows' | 'history'>
const restrictPawnMoves = ({figure, checkedRows, figuresMap, enemyFigures, pinnedRows, history}:RestrictPawnMovesProps):Figure => {
    const {defaultMoves} = figure;

    const walkMoves = getWalkMoves({
        pinnedRows,
        figure,
        figuresMap,
        defaultMoves,
        checkedRows,
        enemyFigures,
        history
    })


    const attackMoves = getAttackMoves(
        {
            pinnedRows,
            figure,
            defaultMoves,
            checkedRows
        }
    )

    return {
        ...figure,
        attackMoves,
        walkMoves
    }
}


type RestrictKingMovesProps = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'enemyFigures' | 'pinnedRows' | 'history'>
const restrictKingMoves = ({figure, checkedRows, figuresMap, enemyFigures, pinnedRows, history}:RestrictKingMovesProps):Figure => {
    const {defaultMoves} = figure;
    const attackMoves = Object.assign({}, defaultMoves);

    //todo unnecessary defaultMoves prop.
    const walkMoves = getWalkMoves({
        figure,
        figuresMap,
        defaultMoves,
        checkedRows,
        enemyFigures,
        pinnedRows,
        history
    })

    return {
        ...figure,
        attackMoves,
        walkMoves
    }
}

type RestrictKnightMoves = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'pinnedRows'>;
const restrictKnightMoves = ({figure, checkedRows, figuresMap, pinnedRows}:RestrictKnightMoves):Figure => {
    const {defaultMoves} = figure;
    const figureKey = getKey(figure.position);
    const pinnedRow = pinnedRows[figureKey];

    const attackMoves = Object.entries(defaultMoves).reduce((acc, [direction, defaultMoves]) => {
        return {
            ...acc,
            [direction]: defaultMoves.filter(key => {

                const canBlock = canBlockCheck(key, checkedRows);
                let movementByPinnedRow = true;

                if(pinnedRow) {
                    movementByPinnedRow = pinnedRow.includes(key);
                }

                return canBlock && movementByPinnedRow
            })
        }
    }, figure.defaultMoves);

    const walkMoves = Object.entries(attackMoves).reduce((acc, [direction, attackMoves]) => {
        return {
            ...acc,
            [direction]: attackMoves.filter(key => !isSameFigureType(figure, figuresMap, key))
        };
    }, {}) as Moves;

    return {
        ...figure,
        attackMoves,
        walkMoves
    }
}


type RestrictRockMovesProps = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'pinnedRows'>
const restrictRockMoves = ({figure, checkedRows, figuresMap, pinnedRows}:RestrictRockMovesProps):Figure => {
    const {defaultMoves} = figure;
    const defaultMovesEntries = Object.entries(defaultMoves) as [keyof Moves, string[]][];
    const figureKey = getKey(figure.position);
    const pinnedRow = pinnedRows[figureKey];

    const [upPosition, downPosition] = getClosestColumnPieces(figure, figuresMap);
    const [leftPosition, rightPosition] = getClosestRowPieces(figure, figuresMap);

    const attackMoves = defaultMovesEntries.reduce((acc, [direction, defaultMoves]) => {
        return {
            ...acc,
            [direction]: defaultMoves.filter(key => {
                const toPosition = fromKey(key);
                // const isSameType = isSameFigureType(figure, figuresMap, key)
                let barricadeUp = false;
                let barricadeDawn = false;
                let barricadeLeft = false;
                let barricadeRight = false;
                const canBlock = canBlockCheck(key, checkedRows);

                if( upPosition ) {
                    barricadeUp = toPosition.y < upPosition.y
                }

                if( downPosition ) {
                    barricadeDawn = toPosition.y > downPosition.y
                }

                if(leftPosition) {
                    barricadeLeft = toPosition.x < leftPosition.x
                }

                if(rightPosition) {
                    barricadeRight = toPosition.x > rightPosition.x
                }

                let movementByPinnedRow = true;

                if(pinnedRow) {
                    movementByPinnedRow = pinnedRow.includes(key);
                }

                return  !barricadeUp &&
                        !barricadeDawn &&
                        !barricadeLeft &&
                        !barricadeRight &&
                        movementByPinnedRow &&
                        canBlock
            })
        }
    }, {}) as Moves

    const walkMoves = Object.entries(attackMoves).reduce((acc, [direction, attackMoves]) => {
        return {
            ...acc,
            [direction]: attackMoves.filter(key => !isSameFigureType(figure, figuresMap, key))
        };
    }, {}) as Moves;

    return {
        ...figure,
        attackMoves,
        walkMoves
    }
}

type RestrictBishopMovesProps = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'pinnedRows'>
const restrictBishopMoves = ({figure, checkedRows, figuresMap, pinnedRows}:RestrictBishopMovesProps):Figure => {
    const {defaultMoves} = figure;
    const defaultMovesEntries = Object.entries(defaultMoves) as [keyof Moves, string[]][];
    const figureKey = getKey(figure.position);
    const pinnedRow = pinnedRows[figureKey];

    const [topLeft, bottomRight] = getClosestDiagonalesAD(figure, figuresMap);
    const [topRight, bottomLeft] = getClosestDiagonalesCB(figure, figuresMap);

    const attackMoves = defaultMovesEntries.reduce((acc, [direction, defaultMoves]) => {
        return {
            ...acc,
            [direction]: defaultMoves.filter(key => {
                const toPosition = fromKey(key);
                // const isSameType = isSameFigureType(figure, figuresMap, key)
                const canBlock = canBlockCheck(key, checkedRows);

                let topLeftBarricade = false;
                let bottomRightBarricade = false;
                let topRightBarricade = false;
                let bottomLeftBarricade = false;

                if(topLeft) {
                    topLeftBarricade = topLeft.position.x > toPosition.x && topLeft.position.y > toPosition.y
                }

                if(bottomRight) {
                    bottomRightBarricade = bottomRight.position.x < toPosition.x && bottomRight.position.y < toPosition.y
                }

                if(topRight) {
                    topRightBarricade = topRight.position.x < toPosition.x && topRight.position.y > toPosition.y
                }

                if(bottomLeft) {
                    bottomLeftBarricade = bottomLeft.position.x > toPosition.x && bottomLeft.position.y < toPosition.y
                }

                let movementByPinnedRow = true;

                if(pinnedRow) {
                    movementByPinnedRow = pinnedRow.includes(key);
                }


                return !topLeftBarricade &&
                    !bottomRightBarricade &&
                    !topRightBarricade &&
                    !bottomLeftBarricade &&
                    // !isSameType &&
                    movementByPinnedRow &&
                    canBlock
            })
        }
    }, {}) as Moves

    const walkMoves = Object.entries(attackMoves).reduce((acc, [direction, attackMoves]) => {
        return {
            ...acc,
            [direction]: attackMoves.filter(key => !isSameFigureType(figure, figuresMap, key))
        };
    }, {}) as Moves;

    return {
        ...figure,
        attackMoves,
        walkMoves
    }
}

type RestrictQueenMovesProps = Pick<Movement, 'figure' | 'checkedRows' | 'figuresMap' | 'pinnedRows'>
const restrictQueenMoves = (props:RestrictQueenMovesProps):Figure => {
    const {attackMoves:rookAttackMoves, walkMoves: rookWalkMoves} = restrictRockMoves(props);

    const {attackMoves:bishopAttackMoves, walkMoves: bishopWalkMoves} = restrictBishopMoves(props)


    return {
        ...props.figure,
        walkMoves: {
            right: rookWalkMoves.right,
            left: rookWalkMoves.left,
            top: rookWalkMoves.top,
            bottom: rookWalkMoves.bottom,
            topLeft: bishopWalkMoves.topLeft,
            topRight: bishopWalkMoves.topRight,
            bottomRight: bishopWalkMoves.bottomRight,
            bottomLeft: bishopWalkMoves.bottomLeft
        },
        attackMoves: {
            right: rookAttackMoves.right,
            left: rookAttackMoves.left,
            top: rookAttackMoves.top,
            bottom: rookAttackMoves.bottom,
            topLeft: bishopAttackMoves.topLeft,
            topRight: bishopAttackMoves.topRight,
            bottomRight: bishopAttackMoves.bottomRight,
            bottomLeft: bishopAttackMoves.bottomLeft
        }
    }
}

export const getPiecesByType = (figuresMap:FiguresMap, move:Type, enemy?:boolean) => {
    if((move === Type.BLACK && !enemy) || (move === Type.WHITE && enemy)) {
        return Object.values(figuresMap).filter(figure => figure.type === Type.BLACK)
    }

    return Object.values(figuresMap).filter(figure => figure.type === Type.WHITE)
}

export const isCheck = (checkedRows:CheckedRows) => {
    return Object.values(checkedRows).length > 0;
};
export const canBlockCheck = (move:string, checkedRows:CheckedRows) => {
    if(!isCheck(checkedRows)) {
        return true;
    }

    if(Object.values(checkedRows).length > 1) {
        return false;
    }

    return Object.entries(checkedRows).every(([checkerPosition, checkedRow]) => {
        return checkerPosition === move || checkedRow.includes(move)
    })
};
export const isCheckmate = (figures:Figure[]) => {
    return figures.every(figure => Object.values(figure.defaultMoves).every(direction => direction.length === 0))
}

export const isEnPassant = (figure:Figure, toPosition:Position, history:History[]) => {
    const lastMoved = history[history.length - 1];

    if(lastMoved && lastMoved.figure.piece === Piece.PAWN) {
        if(figure.piece === Piece.PAWN) {
            const isPawnLeftOrRight = Math.abs(lastMoved.from.y - figure.position.y) === 1;

            if( figure.type === Type.BLACK ) {
                if(figure.position.x === 4) {
                    if(
                        lastMoved.figure.type === Type.WHITE &&
                        isPawnLeftOrRight &&
                        toPosition.y === lastMoved.from.y &&
                        toPosition.x === lastMoved.from.x - 1
                    ){
                        return true
                    }
                }
            } else {
                if(figure.position.x === 3) {
                    if(
                        lastMoved.figure.type === Type.BLACK &&
                        isPawnLeftOrRight &&
                        toPosition.y === lastMoved.from.y &&
                        toPosition.x === lastMoved.from.x + 1
                    ){
                        return true
                    }

                }
            }
        }
    }

    return false
}

const isSelfPosition = ({position, toPosition}:MovementProps) => {
    return position.x === toPosition.x && position.y === toPosition.y;
}

const isSameFigureType = (figure:Figure, figuresMap:FiguresMap, toPosition:Position | string) => {
    const toKey = typeof toPosition === 'string' ? toPosition : getKey(toPosition);
    const toFigure = figuresMap[toKey];

    return toFigure?.type === figure.type;
}

const movePawn = ({position, toPosition}:MovementProps) => {

    const toY = toPosition.y - position.y;
    const toX = toPosition.x - position.x;

    return  (Math.abs(toY) === 1 && Math.abs(toX) === 1) ||
            ( (Math.abs(toX) === 1 || Math.abs(toX) === 2) && toY === 0)
}

const getClosestColumnPieces = (figure:Figure, figuresMap:FiguresMap) => {
    let result:[Position?, Position?] = [];

    for(let i = figure.position.y - 1; i > 0; i--) {
        const key = getKey({x: figure.position.x, y: i});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[0] = closestPiece.position;
            break;
        }
    }

    for(let i = figure.position.y + 1; i < 8; i++) {
        const key = getKey({x: figure.position.x, y: i});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[1] = closestPiece.position;
            break;
        }
    }

    return result;
}

const getClosestRowPieces = (figure:Figure, figuresMap:FiguresMap) => {
    let result:[Position?, Position?] = [null, null];

    for(let i = figure.position.x - 1; i > 0; i--) {
        const key = getKey({x: i, y: figure.position.y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue;
        }

        if(closestPiece) {
            result[0] = closestPiece.position;
            break;
        }
    }

    for(let i = figure.position.x + 1; i < 8; i++) {
        const key = getKey({x: i, y: figure.position.y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[1] = closestPiece.position;
            break;
        }
    }

    return result;
}

const isFigureEnemyKing = (figure:Figure, closestPiece?:Figure) => {
    return closestPiece && (closestPiece.piece === Piece.KING && closestPiece.type !== figure.type)
}

const getClosestDiagonalesAD = (figure:Figure, figuresMap:FiguresMap) => {
    let result:[Figure?, Figure?] = [null, null];
    const {position} = figure;

    for(let x = position.x - 1, y = position.y - 1 ; x > 0 || y > 0; x--, y--) {
        //top left
        const key = getKey({x, y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[0] = closestPiece;
            break;
        }
    }

    for(let x = position.x + 1, y = position.y + 1 ; x < 8 || y < 8; x++, y++) {
        //bottom right
        const key = getKey({x, y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[1] = closestPiece;
            break;
        }
    }

    return result;
}
const getClosestDiagonalesCB = (figure:Figure, figuresMap:FiguresMap) => {
    const {position} = figure;
    let result:[Figure?, Figure?] = [null, null];

    for(let x = position.x + 1, y = position.y - 1 ; x < 8 || y > 0; x++, y--) {
        //top right
        const key = getKey({x, y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            // console.log({closestPiece})
            continue
        }

        if(closestPiece) {
            result[0] = closestPiece;
            break;
        }
    }

    for(let x = position.x - 1, y = position.y + 1 ; x > 0 || y < 0; x--, y++) {
        //bottom left
        const key = getKey({x, y});
        const closestPiece = figuresMap[key];

        if(isFigureEnemyKing(figure, closestPiece)) {
            continue
        }

        if(closestPiece) {
            result[1] = closestPiece;
            break;
        }
    }

    return result;
}
const moveKnight = (props:MovementProps) => {
    const {position, toPosition} = props;
    const toX = toPosition.x - position.x;
    const toY = toPosition.y - position.y;

    return !isSelfPosition(props) && (
         (Math.abs(toX) === 1 && Math.abs(toY) === 2) ||
         (Math.abs(toX) === 2 && Math.abs(toY) === 1)
    );
}

const moveBishop = (props:MovementProps) => {
    const {position, toPosition} = props;
    const toX = toPosition.x - position.x;
    const toY = toPosition.y -  position.y;


    return !isSelfPosition(props) && Math.abs(toX) === Math.abs(toY)
}

const moveRock = (props:MovementProps) => {
    const {position, toPosition} = props
    return !isSelfPosition(props) && (
        position.y === toPosition.y ||
        position.x === toPosition.x
    )
}

const moveQueen = (props:MovementProps) => {
    return moveBishop(props) || moveRock(props)
}

const moveKing = (props:MovementProps) => {
    const {position, toPosition} = props;
    const toX = toPosition.x - position.x;
    const toY = toPosition.y - position.y;

    return !isSelfPosition(props) && (
        (Math.abs(toY) === 1 && Math.abs(toX) === 1) ||
        (Math.abs(toX) === 1 && toPosition.y === position.y) ||
        (Math.abs(toY) === 1 && toPosition.x === position.x)
    )
}

export const getCheckedRows = (move:Type, figuresMap:FiguresMap):CheckedRows => {
    const king = getKing(move, figuresMap)
    const pieces:Figure[] = getPiecesByType(figuresMap, move, true);
    const kingPositionKey = getKey(king.position);

    return pieces.reduce((acc, enemyFigure) => {
        const enemyFigurePosition = getKey(enemyFigure.position);
        const enemyMoves = Object.values(enemyFigure.piece === Piece.PAWN ? enemyFigure.attackMoves : enemyFigure.defaultMoves)
        const attackRow = enemyMoves.find(direction => {
            return direction.some(enemyMove => enemyMove === kingPositionKey)
        })

        if(attackRow && attackRow.length > 0) {
            const rowInBetweenKing = getMovesInBetween(king.position, enemyFigure.position, attackRow);

            const isCheck = rowInBetweenKing.every(move => !figuresMap[move]);

            if(isCheck) {
                return {
                    ...acc,
                    [enemyFigurePosition]: [...rowInBetweenKing]
                }
            }
        }
        return acc;
    }, {})
}

type GetPinnedRowsProps = Pick<Movement, 'figuresMap' | 'enemyFigures' | 'move'>
export const getPinnedRows = ({figuresMap, enemyFigures, move}:GetPinnedRowsProps):PinnedRows => {
    const king = getKing(move, figuresMap)
    const kingPositionKey = getKey(king.position)

    return enemyFigures.reduce((acc, enemyFigure) => {
        const attackRow = Object.values(enemyFigure.defaultMoves).find(direction => {
            return direction.some(enemyMove => enemyMove === kingPositionKey)
        })

        if(attackRow) {
            const rowInBetweenKing = getMovesInBetween(king.position, enemyFigure.position, attackRow);

            const figuresInBetween = rowInBetweenKing.reduce((acc, key) => {
                const figureInBetween = figuresMap[key];
                if(figureInBetween && figureInBetween.type === move) {
                    return [...acc, figureInBetween]
                }

                return acc
            }, [])

            if(figuresInBetween.length === 1) {
                acc[getKey(figuresInBetween[0].position)] = [...rowInBetweenKing, getKey(enemyFigure.position)]
            }
        }
        return acc;
    }, {})
}

const getKing = (type:Type, figuresMap:FiguresMap) => {
    return Object.values(figuresMap).find(figure => figure.type === type && figure.piece === Piece.KING);
}

const getMovesInBetween = (kingPos:Position, attackerPos:Position, row:string[]) => {
    return row.filter(move => {
        const posMove = fromKey(move);

        if(kingPos.y === attackerPos.y) {
            // row
            if(kingPos.x > attackerPos.x) {
                return posMove.x < kingPos.x
            }
            if(kingPos.x < attackerPos.x) {
                return posMove.x > kingPos.x
            }
        }

        if(kingPos.x === attackerPos.x) {
            //column
            if(kingPos.y > attackerPos.y) {
                return posMove.y < kingPos.y
            }
            if(kingPos.y < attackerPos.y) {
                return posMove.y > kingPos.y
            }
        }

        if(kingPos.x > attackerPos.x) {
            if(kingPos.y > attackerPos.y) {
                // AD
                return posMove.x < kingPos.x && posMove.y < kingPos.y
            }
            if(kingPos.y < attackerPos.y) {
                // CB
                return posMove.x < kingPos.x && posMove.y > kingPos.y
            }
        }

        if(kingPos.x < attackerPos.x) {
            if(kingPos.y < attackerPos.y) {
                // DA
                return posMove.x > kingPos.x && posMove.y > kingPos.y
            }
            if(kingPos.y > attackerPos.y) {
                // BC
                return posMove.x > kingPos.x && posMove.y < kingPos.y
            }
        }

        return true;
    })
}


type CanCastleProps = Pick<Movement, 'figuresMap' | 'move'>
const canCastle = ({move, figuresMap}:CanCastleProps) => {
    const king = getKing(move, figuresMap);
    const result = [false, false];
    if(king.isMoved) {
        return result;
    }

    console.log({king});
    let leftRock, rightRock;
    if(move === Type.BLACK) {
        leftRock = figuresMap['0-0'];
        rightRock = figuresMap['7-0'];
    }else{
        leftRock = figuresMap['7-0'];
        rightRock = figuresMap['7-7'];
    }

    result[0] = !(!leftRock || leftRock.type !== move || leftRock.piece !== Piece.ROCK || leftRock.isMoved);
    result[1] = !(!rightRock || rightRock.type !== move || rightRock.piece !== Piece.ROCK || rightRock.isMoved);
}