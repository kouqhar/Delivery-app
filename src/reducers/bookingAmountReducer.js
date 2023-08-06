// This is for the price reflection Reducer

import { PARTIAL, FINAL, RESET } from "../actions/types";

const initialBookingAmountReducer = { partial: 0, final: 0 };

const bookingAmountReducer = (state, action) => {
  const { payload: payloadPoint } = action;
  switch (action.type) {
    case PARTIAL: {
      return {
        ...state,
        partial: payloadPoint.partial,
      };
    }
    case FINAL: {
      return {
        ...state,
        final: payloadPoint.final,
      };
    }
    case RESET: {
      return {
        ...state,
        final: 0,
        partial: 0,
      };
    }
  }
};

export { bookingAmountReducer, initialBookingAmountReducer };
