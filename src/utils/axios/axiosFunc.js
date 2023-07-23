import axios from "axios";
const { VITE_DOMAIN, VITE_APP_ID, VITE_APP_SECRET } = import.meta.env;

const gatewayURI = VITE_DOMAIN;
const headers = {
  app_secret: VITE_APP_SECRET,
  app_id: VITE_APP_ID,
};

const axiosRequest = async (reqOptions) => {
  const defaultOptions = {
    url: "",
    method: "GET",
    data: {},
    headers: { ...headers },
  };

  for (const key in reqOptions) {
    if (key === "path")
      defaultOptions["url"] = `${gatewayURI}${reqOptions[key]}`;
    else if (key === "headers")
      defaultOptions["headers"] = { ...reqOptions[key] };
    else defaultOptions[key] = reqOptions[key];
  }
  return await axios(defaultOptions)
    .then((response) => {
      if (response?.status === 200) {
        const detailText = {
          status: response?.status,
          data: response?.data,
        };
        return detailText;
      }
    })
    .catch((error) => {
      const detailText = {
        status: error?.response?.status,
        data: error?.message,
      };
      return detailText;
    });
};

export default axiosRequest;
