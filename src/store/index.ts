import { createStore } from 'redux';
import { gameReducer } from './reducers/game';
import {composeWithDevTools} from 'redux-devtools-extension'

const store = createStore(
    gameReducer,
    composeWithDevTools()
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store