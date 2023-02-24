import { RowDataPacket, OkPacket } from "mysql2";

export type QueryResponse = RowDataPacket[] | RowDataPacket[][] | OkPacket[];
