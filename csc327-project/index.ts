import { Database } from "bun:sqlite";

// 1. Connect to SQLite
const db = new Database("students.db");

console.log("Connected to SQLite successfully!");

// 2. Create table if it doesn't already exist
db.run(`
    CREATE TABLE IF NOT EXISTS students (
        serial_number INTEGER PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        second_name VARCHAR(50) NOT NULL,
        csc_327_score INTEGER,
        gender VARCHAR(10),
        age INTEGER
    )
`);

console.log("Students table is ready!");

// 3. Student names
const firstNames = [
  "Daniel",
  "John",
  "Mary",
  "David",
  "Sarah",
  "Peter",
  "Grace",
  "Michael",
  "Esther",
  "James",
  "Faith",
  "Samuel",
  "Joy",
  "Joseph",
  "Ruth",
  "Paul",
];

const lastNames = [
  "Johnson",
  "Williams",
  "Brown",
  "Smith",
  "Okafor",
  "Adeyemi",
  "Olawale",
  "Amund",
  "Mensah",
  "Bello",
  "James",
  "Musa",
];

// 4. Prepare INSERT statement
const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO students
    (serial_number, first_name, second_name,
     csc_327_score, gender, age)
    VALUES (?, ?, ?, ?, ?, ?)
`);

// 5. Generate 617 students
const insertMany = db.transaction(() => {
  for (let i = 1; i <= 617; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const gender = Math.random() < 0.5 ? "Male" : "Female";

    const score = Math.floor(Math.random() * 101);

    const age = Math.floor(Math.random() * 10) + 16;

    insertStudent.run(i, firstName, lastName, score, gender, age);
  }
});

insertMany();

console.log("Student generation process completed!");

// 6. Verify records
const result = db.query("SELECT COUNT(*) AS total FROM students").get() as {
  total: number;
};

console.log("Total students:", result.total);

// 7. Close connection

console.log("\n========== QUERY RESULTS ==========");

// 1. List all male students
const males = db
  .query(
    `
    SELECT * FROM students
    WHERE gender = 'Male'
`,
  )
  .all();

console.log("\n1. ALL MALE STUDENTS");
console.table(males);

// 2. Scores greater than 70
const highScores = db
  .query(
    `
    SELECT * FROM students
    WHERE csc_327_score > 70
`,
  )
  .all();

console.log("\n2. STUDENTS WITH SCORES ABOVE 70");
console.table(highScores);

// 3. Scores less than 40
const lowScores = db
  .query(
    `
    SELECT * FROM students
    WHERE csc_327_score < 40
`,
  )
  .all();

console.log("\n3. STUDENTS WITH SCORES BELOW 40");
console.table(lowScores);

db.close();
