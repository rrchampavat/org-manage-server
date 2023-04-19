import { Pool, createPool } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults
// export const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "orgs",
//   password: "password",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

export default class Database {
  static init(): Pool {
    return createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_DEV_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_DEV_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: true,
      },
    });
  }
}
