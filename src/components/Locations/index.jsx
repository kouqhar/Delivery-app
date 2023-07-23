import { useEffect, useState } from "react";
import styles from "./style/style.module.css";
import httpReq from "../../utils/request/Request";

const Location = () => {
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const reqOptions = {
      path: "locations",
    };
    const fetchLocations = async () => {
      const response = await httpReq(reqOptions);
      setLocation(response?.data);
    };

    fetchLocations();

    return fetchLocations;
  }, []);
  return (
    <div className={styles.Location_container}>
      <h1>Locations</h1>
      {location.map(({ state, locals }, idx) => {
        return (
          <div
            className={styles.Location_container__content}
            key={`${state}_${idx}`}
          >
            <h2>
              {state} State ({locals.length})
            </h2>
            <ul>
              {locals.map(({ name, locationCode }, idx) => {
                return (
                  <li
                    className={styles.Location_container__details}
                    key={`${locationCode}_${idx}`}
                  >
                    <p className={styles.Location_container__name}>
                      <span>Name: </span>
                      {name}
                    </p>
                    <p className={styles.Location_container__location}>
                      <span>Location Code: </span>
                      {locationCode}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
export default Location;
