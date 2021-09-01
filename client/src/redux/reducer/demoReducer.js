const DEMO = "DEMO";

const initialState = {
  demo: [],
};

const demoReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEMO:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};

export default demoReducer;
