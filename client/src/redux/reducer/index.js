import { combineReducers } from "redux";
import authReducer from "./authReducer";
import demoReducer from "./demoReducer";
import errorReducer from "./errorReducer";
import ProfileReducer from "./ProfileReducer";

const rootReducer = combineReducers({
  demo: demoReducer,
  auth: authReducer,
  errors: errorReducer,
  profile: ProfileReducer,
});

export default rootReducer;
