import axios from "axios";
import { CLEAR_CURRENT_PROFILE, GET_PROFILE, GET_USER_ERROR } from "./type";

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

// create profile

export const createProfile = (data, location) => (dispatch) => {
  axios
    .post("http://localhost:8000/api/profile", data)
    .then((res) => location.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_USER_ERROR,
        payload: err.response.data,
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
