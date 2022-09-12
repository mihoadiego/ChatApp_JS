import {legacy_createStore as createStore, applyMiddleware} from 'redux'; // logacy_createStore beacause createStore being depecrated for RTK
import thunk from 'redux-thunk';

import rootReducer from './reducers'

const store = createStore(rootReducer,applyMiddleware(thunk)) // thunk to handle async calls/updates of the store

export default store;