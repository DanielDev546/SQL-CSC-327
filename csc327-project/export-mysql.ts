import { Database } from "bun:sqlite";

const db = new Database("./students.db");

const students = db
  .query(
    `
  SELECT serial_number, first_name, second_name,
         csc_327_score, gender, age
  FROM students
`,
  )
  .all() as any[];

const escapeSQL = (value: any) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);

  return "'" + String(value).replace(/\\/g, "\\\\").replace(/'/g, "''") + "'";
};

const statements = students.map(
  (student) => `
INSERT INTO students
(serial_number, first_name, second_name, csc_327_score, gender, age)
VALUES (
  ${escapeSQL(student.serial_number)},
  ${escapeSQL(student.first_name)},
  ${escapeSQL(student.second_name)},
  ${escapeSQL(student.csc_327_score)},
  ${escapeSQL(student.gender)},
  ${escapeSQL(student.age)}
);`,
);

await Bun.write("./students_import.sql", statements.join("\n"));

console.log(`Exported ${students.length} records to students_import.sql`);

db.close();
