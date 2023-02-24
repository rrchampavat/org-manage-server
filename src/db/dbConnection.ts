// import {Pool} from "mysql2";

import { Pool, createPool } from "mysql2";

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
      host: "localhost",
      user: "root",
      database: "orgs",
      password: "password",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
}
