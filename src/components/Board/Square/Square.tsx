import React, {useCallback} from 'react';
import styles from './square.module.scss'
import cn from 'classnames';
import {useDrop} from 'react-dnd';
import {DragTypes} from '../Figures/Figure';
import {useDispatch} from 'react-redux'
import {
    moveFigure, resetDropFigure,
    setDropFigure,
    setHistory,
    showDropdown,
    updateFiguresRules,
    updateMove
} from '../../../store/actions/game';
import {Figure, Piece, Position} from '../../../types/game'
import {getKey} from "../../../utils/game";
import {SquareOverlay} from "./SquareOverlay";
import {useTypedSelector} from "../../../utils/typedSelector";
import {FigureDropdown} from "../FigureDropdown/FigureDropdown";

interface SquareProps {
    children: React.ReactNode
    isBlack?: boolean,
    position: Position
}

interface DropReturnType {
    isOver: boolean
    canMove: boolean
}

export interface OnDropProps {
    position: Position,
    positionFrom: Position,
    figure: Figure
}

export const Square:React.FC<SquareProps> = ({ children, isBlack, position }) => {
    const dispatch = useDispatch();
    const { figuresMap, history, move} = useTypedSelector(state => state);

    const onDrop = useCallback(({position, positionFrom, figure}:OnDropProps) => {
        dispatch(moveFigure(positionFrom, position, figure))
        dispatch(setHistory(positionFrom, position, figure))
        dispatch(resetDropFigure())
        dispatch(updateMove())
        dispatch(updateFiguresRules())
    }, [dispatch])

    const [ { isOver, canMove }, dropRef] = useDrop<Figure, unknown, DropReturnType>(() => ({
        accept: DragTypes.FIGURE,
        canDrop: (figure) => {
            return Object.values(figure.walkMoves).some(direction => direction.includes(getKey(position)))
        },
        collect: (monitor) => {
            return {
                isOver: !!monitor.isOver(),
                canMove: !!monitor.canDrop()
            }
        },
        drop: (figure) => {
            const positionFrom = figure.position;
            dispatch(setDropFigure({positionFrom, positionTo: position, figure}));

            if(figure.piece === Piece.PAWN) {
                if(position.x === 0 || position.x === 7) {
                    dispatch(showDropdown())
                }else{
                    onDrop({positionFrom, position, figure})
                }
            }else{
                onDrop({positionFrom, position, figure})
            }
        }
    }), [position.x, position.y, figuresMap, history, move, onDrop])

    const className = cn(styles.square, {
        [styles.isBlack]: isBlack,
    });

     return (
        <div 
            ref={dropRef}
            className={styles.wrapper}
        >

            <FigureDropdown squarePosition={position} onDrop={onDrop}/>

            <div className={className}>
                {children}
            </div>
            <div className={styles.placeholder}>
                x:{position.x}-y:{position.y}
            </div>


            {isOver && (
                <SquareOverlay
                    color="yellow"
                />
            )}
            {!isOver && canMove && (
                <SquareOverlay
                    color="green"
                />
            )}
            {isOver && !canMove && (
                <SquareOverlay
                    color="red"
                />
            )}
        </div>

    )
}