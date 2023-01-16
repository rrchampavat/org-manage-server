// get the client
import mySql from "mysql2";

// Create the connection pool. The pool-specific settings are the defaults
export const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  database: "orgs",
  password: "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
