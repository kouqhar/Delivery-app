import {
  ADDRESS,
  LOCATION_CODE,
  PICKUP_NAME,
  PICKUP_NUMBER,
  ALT_PICKUP_NUMBER,
  PICKUP_DATE,
  NOTE,
} from "../actions/types";

// This is for the pickup Reducer
const initialPickupReducer = {
  address: "",
  locationCode: "",
  pickupName: "",
  pickupNumber: "",
  altPickupNumber: "",
  pickupDate: "",
  note: "",
};

const pickupReducer = (state, action) => {
  const { payload: payloadPoint } = action;
  switch (action.type) {
    case ADDRESS: {
      return {
        ...state,
        address: payloadPoint.address,
      };
    }
    case LOCATION_CODE: {
      return {
        ...state,
        locationCode: payloadPoint.locationCode,
      };
    }
    case PICKUP_NAME: {
      return {
        ...state,
        pickupName: payloadPoint.pickupName,
      };
    }
    case PICKUP_NUMBER: {
      return {
        ...state,
        pickupNumber: payloadPoint.pickupNumber,
      };
    }
    case ALT_PICKUP_NUMBER: {
      return {
        ...state,
        altPickupNumber: payloadPoint.altPickupNumber,
      };
    }
    case PICKUP_DATE: {
      return {
        ...state,
        pickupDate: new Date(payloadPoint.pickupDate),
      };
    }
    case NOTE: {
      return {
        ...state,
        note: payloadPoint.note,
      };
    }
  }
};

export { pickupReducer, initialPickupReducer };
