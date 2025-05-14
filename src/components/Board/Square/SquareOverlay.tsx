import React from 'react';
import styles from './square.module.scss';

interface SquareOverlayProps {
    color: string
}

export const SquareOverlay:React.FC<SquareOverlayProps> = ({ color }) => {

    return (
        <div className={styles.isOverLayer} style={{backgroundColor: color}}/>
    )
}