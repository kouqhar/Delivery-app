import { useEffect, useRef, useState, useReducer } from "react";
import styles from "./style/style.module.css";
import httpReq from "../../utils/request/Request";
import InputField from "../../UI/Common/Fields/InputField";

// dependencies
import axios from "axios";

// This is for the pickup Reducer
const pickupReducer = (state, action) => {
  switch (action.type) {
    case "address": {
      return {
        ...state,
        address: action.address,
      };
    }
    case "locationCode": {
      return {
        ...state,
        locationCode: action.locationCode,
      };
    }
    case "pickupName": {
      return {
        ...state,
        pickupName: action.pickupName,
      };
    }
    case "pickupNumber": {
      return {
        ...state,
        pickupNumber: action.pickupNumber,
      };
    }
    case "altPickupNumber": {
      return {
        ...state,
        altPickupNumber: action.altPickupNumber,
      };
    }
    case "pickupDate": {
      return {
        ...state,
        pickupDate: new Date(action.pickupDate),
      };
    }
    case "note": {
      return {
        ...state,
        note: action.note,
      };
    }
  }
};
const initialPickupReducer = {
  address: "",
  locationCode: "",
  pickupName: "",
  pickupNumber: "",
  altPickupNumber: "",
  pickupDate: "",
  note: "",
};

// This is for the price reflection Reducer
const bookingAmountReducer = (state, action) => {
  switch (action.type) {
    case "partial": {
      return {
        ...state,
        partial: action.partial,
      };
    }
    case "final": {
      return {
        ...state,
        final: action.final,
      };
    }
    case "reset": {
      return {
        ...state,
        final: 0,
        partial: 0,
      };
    }
  }
};

// Input fields
const dropOffFields = [
  "address",
  "locationCode",
  "recipientName",
  "recipientNumber",
  "altRecipientNumber",
  "note",
];
const pickupFields = [
  "address",
  "locationCode",
  "pickupName",
  "pickupNumber",
  "altPickupNumber",
  "pickupDate",
  "note",
];

const Delivery = () => {
  let balanceBgColor = useRef("");
  const [balance, setBalance] = useState(0);
  const [requestDelivery, setRequestDelivery] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [addDropOffBtn, setAddDropOffBtn] = useState(true);
  const [dropOff, setDropOff] = useState([]);
  const [dropOffHolder, setDropOffHolder] = useState({});
  const [bookingAmountState, bookingAmountDispatch] = useReducer(
    bookingAmountReducer,
    { partial: 0, final: 0 }
  );
  const [pickupState, pickupDispatch] = useReducer(
    pickupReducer,
    initialPickupReducer
  );

  useEffect(() => {
    console.log("Request a Delivery : ", requestDelivery);
  }, [requestDelivery]);

  useEffect(() => {
    // Disable button on insufficient funds
    setBtnDisabled(
      balance >= bookingAmountState.final && dropOff.length > 0 ? false : true
    );
  }, [balance, bookingAmountState.final]);

  // Checks do disable adding more drop offs
  useEffect(() => {
    if (
      dropOffHolder?.locationCode === undefined ||
      dropOffHolder?.locationCode.length < 4
    ) {
      bookingAmountDispatch({
        type: "partial",
        partial: 0,
      });
      setAddDropOffBtn(true);
    } else setAddDropOffBtn(bookingAmountState?.partial <= 0 ? true : false);
    if (dropOff.length >= 2) setAddDropOffBtn(true);
  }, [dropOff, dropOffHolder, bookingAmountState?.partial]);

  // Get the wallet Balance
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    const reqOptions = {
      path: "wallet/balance",
      cancelToken: cancelToken.token,
    };
    const fetchBalance = async () => {
      const response = await httpReq(reqOptions);
      setBalance(response?.data?.balance);
    };

    fetchBalance();
    return () => {
      cancelToken.cancel();
    };
  }, [balance, requestDelivery]);

  // Get the DropOff amount
  useEffect(() => {
    const date = new Date(pickupState?.pickupDate);
    const [year, month, day] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ];
    const time = `${year}-${month > 9 ? month : `0${month}`}-${
      day > 9 ? day : `0${day}`
    }`;

    if (
      dropOffHolder?.locationCode !== undefined &&
      dropOffHolder?.locationCode.length === 4
    ) {
      let isCancelled = false;
      const reqOptions = {
        method: "POST",
        path: "deliveries/price",
        data: {
          pickupCode: `${pickupState?.locationCode}`,
          pickupDate: `${time}`,
          dropoffCode: `${dropOffHolder?.locationCode}`,
        },
      };
      const fetchDropOffTotal = async () => {
        if (!isCancelled) {
          const response = await httpReq(reqOptions);
          bookingAmountDispatch({
            type: "partial",
            partial: response?.data?.price,
          });
        }
      };

      fetchDropOffTotal();
      return () => {
        isCancelled = true;
      };
    }
  }, [dropOffHolder?.locationCode]);

  // Adjust the balance background color
  balance < 100
    ? (balanceBgColor.current = "rgb(151, 15, 15)")
    : balance < 1000
    ? (balanceBgColor.current = "rgb(133, 108, 63)")
    : (balanceBgColor.current = "rgb(30, 88, 30)");

  // Handle pick up reducer change
  const handlePickupInputChange = (e) => {
    pickupDispatch({
      type: e.target.name,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Drop off Input Change
  const handleDropOffInputChange = (e) => {
    setDropOffHolder({ ...dropOffHolder, [e.target.name]: e.target.value });
  };

  // Add dropOff
  const handleOnAddDropOff = (e) => {
    e.preventDefault();
    const isFound = dropOff.filter((dropOff) => dropOff === dropOffHolder);
    if (isFound.length < 1) {
      setBtnDisabled(balance >= bookingAmountState.final ? false : true);
      setDropOff([...dropOff, dropOffHolder]);
      bookingAmountDispatch({
        type: "final",
        final: bookingAmountState.partial + bookingAmountState.final,
      });
      bookingAmountDispatch({
        type: "partial",
        partial: 0,
      });
    } else return `Already added!!!`;
  };

  // Handle from submission to Request Delivery
  const handleFormOnSubmit = async (e) => {
    e.preventDefault();
    const delivery_detail = {
      pickup: pickupState,
      drops: dropOff,
    };
    const reqOptions = {
      path: "deliveries",
      method: "POST",
      data: delivery_detail,
    };

    const response = await httpReq(reqOptions);
    if (response?.status) {
      setRequestDelivery(response?.data);
      alert(
        "Hello HR, Can you kindly check your console for the 'Booked Delivery' result!!!"
      );
    } else {
      setRequestDelivery(response);
      alert(
        "Hello HR, Can you kindly RETRY AGAIN for the 'Booked Delivery' result!!!"
      );
    }
  };

  return (
    <div className={styles.Delivery_container}>
      <div className={styles.Delivery_container__content}>
        <div className={styles.Delivery_container__content___balance}>
          <h2>Bookings</h2>
          <p style={{ backgroundColor: balanceBgColor.current }}>
            Current Balance: ${balance}
          </p>
        </div>

        <form
          className={styles.Delivery_container__content___form}
          onSubmit={handleFormOnSubmit}
        >
          <figure>
            <figcaption>
              Pickup <sub>All Fields are required *</sub>
            </figcaption>

            {pickupFields.map((field, index) => (
              <InputField
                key={index}
                type={field === "pickupDate" ? "date" : "text"}
                name={`${field}`}
                value={dropOffHolder[field]}
                onChange={handlePickupInputChange}
                placeholder={`${field}`}
              />
            ))}
          </figure>
          <figure>
            <figcaption>
              Drop off <sub>All Fields are required *</sub>
            </figcaption>
            <div>
              <p>
                Number of DropOffs Added :{" "}
                <span data-testid="dropOffLength">{dropOff.length}</span> out of
                maximum of <span data-testid="dropOffAccLength">2</span>
              </p>
            </div>
            {dropOffFields.map((field, index) => (
              <InputField
                key={index}
                name={`${field}`}
                value={dropOffHolder[field]}
                onChange={handleDropOffInputChange}
                placeholder={`${field}`}
              />
            ))}
          </figure>
          <div
            className={
              styles.Delivery_container__content___form____bookingAmount
            }
          >
            <p>
              Partial Amount $
              <span data-testid="partialAmount">
                {bookingAmountState.partial}
              </span>
            </p>
            <p>
              Total Amount $
              <span data-testid="finalAmount">{bookingAmountState.final}</span>
            </p>
            <div className={styles.dropOff__btn}>
              <button
                name="addDropOffBtn"
                onClick={handleOnAddDropOff}
                disabled={addDropOffBtn}
              >
                {dropOff.length >= 2 ? "Max reached" : "Add DropOff"}
              </button>
              <button
                data-testid="resetBtn"
                type="button"
                onClick={() => {
                  setDropOff([]);
                  bookingAmountDispatch({
                    type: "reset",
                  });
                }}
              >
                Reset all
              </button>
            </div>
          </div>

          <button name="bookDeliveryBtn" type="submit" disabled={btnDisabled}>
            {balance < bookingAmountState.final
              ? "Insufficient Balance"
              : dropOff.length < 1
              ? "Add at least one drop off"
              : "Book Your Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Delivery;
