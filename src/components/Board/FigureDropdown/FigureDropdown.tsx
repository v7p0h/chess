import React, {useMemo} from "react";
import styles from "./figureDropdown.module.scss";
import {Piece, Position, Type} from "../../../types/game";
import cn from "classnames";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../utils/typedSelector";
import {
    hideDropdown,
    updateFigurePiece,
} from "../../../store/actions/game";
import {OnDropProps} from "../Square/Square";


interface FigurePickerProps {
    squarePosition: Position
    onDrop: (props:OnDropProps) => void
}

export const FigureDropdown:React.FC<FigurePickerProps> = ({squarePosition, onDrop}) => {
    const {isShowDropdown, droppableFigure} = useTypedSelector(state => state)
    const dispatch = useDispatch();
    const type = squarePosition.y === 0 ? Type.WHITE : Type.BLACK;
    const className = cn(styles.dropdown, {
        [styles.bottom]: type === Type.BLACK,
        [styles.top]: type === Type.WHITE
    })

    const images = useMemo(() => {
        const defaultOrder = [
            {
                image:`/images/queen-${type}.png`,
                piece: Piece.QUEEN
            },
            {
                image:`/images/rock-${type}.png`,
                piece: Piece.ROCK

            },
            {
                image:`/images/bishop-${type}.png`,
                piece: Piece.BISHOP

            },
            {
                image:`/images/knight-${type}.png`,
                piece: Piece.KNIGHT
            }
        ];

        return type === Type.WHITE ? defaultOrder : defaultOrder.reverse();
    }, [type])

    const onClickHandler = (piece:Piece) => {
        const { positionFrom, positionTo, figure } = droppableFigure;
        dispatch(updateFigurePiece({position: positionFrom, piece}))
        dispatch(hideDropdown())
        onDrop({position: positionTo, figure, positionFrom});
    }

    if(!isShowDropdown) {
        return null;
    }

    if(droppableFigure?.positionTo?.x !== squarePosition.x || droppableFigure?.positionTo?.y !== squarePosition.y) {
        return null
    }

    return (
        <div className={className}>
            {images.map(({image,piece}) => {
                return (
                    <div className={styles.item} key={image} onClick={() => onClickHandler(piece)}>
                        <img src={image} alt='choosing figure'/>
                    </div>
                )
            })}
        </div>
    )
}