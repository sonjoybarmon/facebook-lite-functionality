import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { GET_USER_ERROR, SET_CURRENT_USER } from "./type";
import jwt_decode from "jwt-decode";

// user register
export const userRegister = (userData, history) => (dispatch) => {
  axios
    .post(`http://localhost:8000/api/user/register`, userData)
    .then((res) => history.push("/login"))
    // .then((res) => console.log(res))
    .catch((err) =>
      dispatch({
        type: GET_USER_ERROR,
        payload: err.response.data,
      })
    );
};

// user login - get user token
export const userLogin = (userData) => (dispatch) => {
  axios
    .post("http://localhost:8000/api/user/login", userData)
    .then((res) => {
      // save token to localStorage
      const { token } = res.data;
      // set token to 1s
      localStorage.setItem("token", token);
      // set token to Auth header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set current user to auth token
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_ERROR,
        payload: err.response.data,
      })
    );
};

// set logged in user

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out

export const logoutUser = () => (dispatch) => {
  //  remove token from localStorage
  localStorage.removeItem("token");
  // remove auth header for future requests
  setAuthToken(false);
  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
