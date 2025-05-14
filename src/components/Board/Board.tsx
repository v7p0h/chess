import React, {useEffect, useMemo} from 'react';
import {Square as SquareComponent} from "./Square/Square";
import styles from './board.module.scss'
import {Figure} from "./Figures/Figure";
import {useTypedSelector} from '../../utils/typedSelector';
import {FiguresMap, Square, Type} from '../../types/game';
import {getCheckedRows, getKey, getPiecesByType, isCheck, isCheckmate} from '../../utils/game';
import {useDispatch} from "react-redux";
import {updateFiguresRules} from "../../store/actions/game";

const initGame = (squares:Square[], figuresMap:FiguresMap = {}) => {

    return squares.map((square) => {
        const {position} = square;
        const key = getKey(position)
        const figure = figuresMap[key];

        return (
           <SquareComponent 
                key={`${position.x}-${position.y}`}
                isBlack={(position.x + position.y) % 2 === 1}
                position={position}
            >
               {figure && <Figure figure={figure} />}
           </SquareComponent>
       )
       })
}

export const Board = () => {
    const dispatch = useDispatch();
    const { figuresMap, squares, move  } = useTypedSelector(state => state);
    // const [checked, setChecked] = useState(false)

    const toMoveText = useMemo(() => {
        return move === Type.WHITE ? "White to move" : "Black to move"
    }, [move]);

    const checkedRows = useMemo(() => {
        return getCheckedRows(move, figuresMap)
    }, [move, figuresMap]);

    const checkText = useMemo(() => {
        if(isCheck(checkedRows)) {
            const figures = getPiecesByType(figuresMap, move);
            const checkmate = isCheckmate(figures);

            if(checkmate) {
                return move === Type.BLACK ? "White won" : "Black won"
            }
        }

        return move === Type.BLACK ? "Black king under check" : "White king under check"
    }, [move, figuresMap, checkedRows]);

    useEffect(() => {
        dispatch(updateFiguresRules())
    }, [dispatch])


    return(
        <div className={styles.page}>
            <div className={styles.board}>
                {initGame(squares, figuresMap)}
            </div>
            <div className={styles.info}>
                <h1>{toMoveText}</h1>
                {isCheck(checkedRows) && (
                    <h1>{checkText}</h1>
                )}
            </div>
        </div>

    )
}