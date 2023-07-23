import { useEffect, useState } from "react";
import styles from "./style/style.module.css";
import httpReq from "../../utils/request/Request";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const reqOptions = {
      path: "wallet/transactions",
    };
    const fetchTransactions = async () => {
      const response = await httpReq(reqOptions);
      setHistory(response?.data);
    };

    fetchTransactions();

    return fetchTransactions;
  }, []);

  let transactionHistory;
  if (history && history.length > 0) {
    transactionHistory = history.map(
      ({ id, amount, description, createdAt }) => {
        const date = new Date(createdAt);
        const [year, month, day] = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        ];

        return (
          <div className={styles.History_container__content___details} key={id}>
            <p>
              <span>Date: </span>{" "}
              {`${year}-${month > 9 ? month : `0${month}`}-${
                day > 9 ? day : `0${day}`
              }`}
            </p>
            <p>
              <span>Amount: </span> ${amount ? amount : 0}
            </p>
            <p>
              <span>Description: </span>{" "}
              {description ? description : "No description available"}
            </p>
          </div>
        );
      }
    );
  }

  return (
    <div className={styles.History_container}>
      <h1>Transactions</h1>
      <div className={styles.History_container__content}>
        {history.length > 0 ? (
          transactionHistory
        ) : (
          <h3>No transactions found</h3>
        )}
      </div>
    </div>
  );
};
export default History;
