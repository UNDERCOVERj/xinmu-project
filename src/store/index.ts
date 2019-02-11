import * as reducers from './reducers'
import { combineReducers, createStore } from 'redux';

const store = createStore(combineReducers(reducers))

export default store;