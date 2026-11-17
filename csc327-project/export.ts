import { Database } from "bun:sqlite";

const db = new Database("./students.db");

// Read all 617 records
const students = db
  .query("SELECT * FROM students ORDER BY serial_number")
  .all() as Record<string, unknown>[];

if (students.length === 0) {
  throw new Error("No student records found!");
}

// Escape CSV values properly
function escapeCSV(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

// Generate CSV headers and rows
const headers = Object.keys(students[0]);

const csv = [
  headers.map(escapeCSV).join(","),
  ...students.map((student) =>
    headers.map((header) => escapeCSV(student[header])).join(","),
  ),
].join("\n");

// Save the CSV file
await Bun.write("students.csv", csv);

console.log(`Successfully exported ${students.length} students!`);

db.close();
