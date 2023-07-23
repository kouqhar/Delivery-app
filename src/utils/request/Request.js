import axiosRequest from "../axios/axiosFunc";

let index = 0;
const Request = async (reqOptions) => {
  try {
    const response = await axiosRequest(reqOptions);
    const result = await response;
    // console.log("Axios Response : ", response);

    if (typeof result?.status === "number" && result?.status === 200)
      return result?.data;
    else {
      if (index === 0) {
        index = 0;
        return result?.data;
      } else {
        index += 1;
        Request(reqOptions);
      }
    }
  } catch (error) {
    throw new Error("Loop request Error : ", error);
  }
};

const httpReq = async (reqOptions) => {
  let result;
  try {
    const response = await Request(reqOptions);
    result = response;
  } catch (error) {
    throw new Error("error : ", error);
  }

  return result;
};

export default httpReq;
