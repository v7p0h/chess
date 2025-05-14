import React from 'react';
import cn from 'classnames'
import { useDrag } from 'react-dnd';
import {Figure as IFigure} from '../../../types/game';
import styles from './figure.module.scss'
import {useTypedSelector} from "../../../utils/typedSelector";

export enum DragTypes {
    FIGURE = 'figure'
}

interface FigureProps {
    figure: IFigure
}

export const Figure:React.FC<FigureProps> = ({figure}) => {
    const {move} = useTypedSelector(state => state)
    const piece = figure?.piece;
    const type = figure?.type;

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: DragTypes.FIGURE,
        item: figure,
        canDrag: () => {
            return figure.type === move
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [figure, figure.type, figure.piece, figure.position.x, figure.position.y, move, figure.walkMoves]);


    return (
        <div
            ref={dragRef}
            className={cn(styles.figure, {
                isDragging,
            })}
        >
            <div
                className={styles.icon}
            >
                {piece ? <img  src={`/images/${piece}-${type}.png`} alt={`${piece} ${type}`} className={styles.image} /> : null}
            </div>
        </div>
    )
}