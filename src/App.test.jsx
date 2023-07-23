import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";

describe("Check that texts appear on the page before component loads", () => {
  it("renders headings", () => {
    render(<App />);
    const location = screen.getByText(/Locations/i);
    const booking = screen.getByText(/Bookings/i);
    const currentBalance = screen.getByText(/Current Balance/i);
    const loadingDescription = screen.getByText(/No transactions found/i);
    expect(location).toBeInTheDocument();
    expect(booking).toBeInTheDocument();
    expect(currentBalance).toBeInTheDocument();
    expect(loadingDescription).toBeInTheDocument();
  });
});

describe("Check that the buttons behave as expected with the intended result", () => {
  it("Disable buttons, or Mutates values or not on hit of the reset button", () => {
    //test block
    test("Fire buttons", () => {
      render(<App />);

      //select the elements you want to interact with
      const dropOffLength = screen.getByTestId("dropOffLength");
      const partialAmount = screen.getByTestId("partialAmount");
      const finalAmount = screen.getByTestId("finalAmount");
      const dropOffAccLength = screen.getByTestId("dropOffAccLength");
      const resetBtn = screen.getByTestId("resetBtn");
      const addDropOffBtn = screen.getByRole("button", {
        name: "addDropOffBtn",
      });
      const bookDeliveryBtn = screen.getByRole("button", {
        name: "bookDeliveryBtn",
      });

      expect(resetBtn).not.toBeDisabled();

      //interact with those elements
      fireEvent.click(resetBtn);

      //assert the expected result
      expect(dropOffLength).toHaveTextContent("0");
      expect(dropOffAccLength).toHaveTextContent("2");
      expect(partialAmount).toHaveTextContent("0");
      expect(finalAmount).toHaveTextContent("0");
      expect(addDropOffBtn).toBeDisabled();
      expect(bookDeliveryBtn).toBeDisabled();
    });
  });
});

describe("Check for elements not meant to be in the application", () => {
  it("Images, sounds, and videos should not be in the application", () => {
    //test block
    test("Check for media files", () => {
      render(<App />);

      const image = screen.getByRole("img");
      const video = screen.getByRole("video");
      const audio = screen.getByRole("audio");
      const iframe = screen.getByRole("iframe");

      //assert the expected result
      expect(image).toBeNull();
      expect(video).toBeNull();
      expect(audio).toBeNull();
      expect(iframe).toBeNull();
    });
  });
});

// Mocking the fetch function to perform an http request test
import httpReq from "./utils/request/Request";

const unmockedFetch = global.fetch;
const reqOptions = {
  method: "POST",
  path: "deliveries",
  data: {
    customerId: "kouqhar",
    pickup: {
      address: "Abule Egba - Agbado ljaye Road",
      locationCode: "ETWD",
      pickupName: "Duniya",
      pickupNumber: "081204449231",
      altPickupNumber: "0821287231",
      pickupDate: "2023-07-31",
      note: "For mocking the fetch function",
    },
    drops: [
      {
        locationCode: "26TD",
        address: "Abule Egba - Alagbado",
        recipientName: "Tolanu Yakub",
        recipientNumber: "081204449231",
        altRecipientNumber: "08219828921",
      },
      {
        locationCode: "A36G",
        address: "Ejigbo - Pipeline",
        recipientName: "JANE DOE",
        recipientNumber: "081204449231",
        altRecipientNumber: "08219828921",
        note: "HELLO JANE DOE",
      },
    ],
  },
};

beforeAll(() => {
  global.fetch = async () => {
    const response = await httpReq(reqOptions);
    return response?.data;
  };
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

describe("Check for that the network responses and returns the right data", () => {
  it("The same pickup and drop-offs coordinates should return the same response", () => {
    //test block
    test("Check for accurate data", async () => {
      render(<App />);

      const bookDeliveryBtn = screen.getByRole("button", {
        name: "bookDeliveryBtn",
      });
      fireEvent.click(bookDeliveryBtn);

      const requestDeliveryResponse = await screen.findByText(
        /["Abule Egba - Alagbado"&"Abule Egba - Agbado ljaye Road"&"Duniya"&"JANET"&"JANE"&"Ejigbo - Pipeline"&"a36g"&"ETWD"]/i
      );
      const notRequestDeliveryResponse = await screen.findByText(
        /["Ikeja - ALLEN AVENUE"&"5WDM"&"Ikeja - computer villaqe"&"MD0K"&"Ikoyi - Obalende"&"8WL5"&"Ikoyi - Kings way road"&"YA05"&"IYANA IBA"&"RX81"]/i
      );
      expect(requestDeliveryResponse).toBeInTheDocument();
      expect(notRequestDeliveryResponse).not.toBeInTheDocument();
    });
  });
});
