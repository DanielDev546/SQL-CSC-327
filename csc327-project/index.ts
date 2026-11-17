import { Database } from "bun:sqlite";

// Create or open our SQLite database
const db = new Database("students.db");

console.log("Connected to SQLite successfully!");
