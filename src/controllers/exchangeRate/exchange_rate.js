import pool from "../../config/oracledb-connect.js";

export class ExchangeRateService {
  static async getExchangeRate(req, res) {
    let connection;
    try {
      const { fromCurrency, toCurrency } = req.body;

      if (!fromCurrency || !toCurrency) {
        return res
          .status(400)
          .json({ message: "Both fromCurrency and toCurrency are required" });
      }

      connection = await (await pool).getConnection();
      console.log("Database connected...");

      const query = `
        SELECT rate
        FROM gl_currency_rates
        WHERE rate_fm_cur_code = :fromCurrency
          AND rate_to_cur_code = :toCurrency
          AND TRUNC(SYSDATE) BETWEEN TRUNC(rate_fm_date) AND TRUNC(rate_to_date)
      `;

      const result = await connection.execute(query, {
        fromCurrency,
        toCurrency,
      });

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Exchange rate not found" });
      }

      const rate = result.rows[0][0];

      console.log("Your exchange rate is: ", rate);

      return res.status(200).json({ rate });
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      return res.status(500).json({ message: "Error fetching exchange rate" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("Error closing DB connection:", err);
        }
      }
    }
  }
}
