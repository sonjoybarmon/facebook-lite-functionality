import axios from "axios";
import { CLEAR_CURRENT_PROFILE, GET_PROFILE } from "./type";

export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("http://localhost:8000/api/profile")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

// Profile Loading
export const setProfileLoading = () => {
  return {
    type: GET_PROFILE,
  };
};

// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
