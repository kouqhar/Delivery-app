import { useEffect, useState, useMemo } from "react";
import styles from "./style/style.module.css";
import httpReq from "../../utils/request/Request";

const Location = () => {
  const [location, setLocation] = useState([]);
  
  const memoizedFetchLocations = useMemo(async () => {
	const reqOptions = {
	  path: "locations",
	};
	const response = await httpReq(reqOptions);
	return response?.data;
  }, []);

  useEffect(() => {
  	memoizedFetchLocations
  	 .then(res => setLocation(res))
  	 .catch(err => throwExpressions(err?.message))
  }, [memoizedFetchLocations]);
  
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
