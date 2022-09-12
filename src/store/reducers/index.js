// such file combines all reducers in one, for a unique store

import { combineReducers } from "redux";
import authReducer from "./auth";
import chatReducer from "./chat";


export default combineReducers({authReducer, chatReducer})