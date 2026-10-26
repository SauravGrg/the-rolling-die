const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(function() {
    db.run(`CREATE TABLE Games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        players TEXT,
        price REAL,
        stock INTEGER
    )`);

    db.run(`CREATE TABLE Users (
        username TEXT,
        password TEXT
    )`);

    const stmt = db.prepare("INSERT INTO Games (title, category, players, price, stock) VALUES (?, ?, ?, ?, ?)");
    stmt.run("Wingspan", "Strategy", "1-5", 64.99, 5);
    stmt.run("Catan", "Family", "3-4", 49.99, 0);
    stmt.run("Monopoly", "Classic", "2-8", 29.99, 10);
    stmt.run("Scrabble", "Word", "2-4", 24.99, 6);
    stmt.run("Uno", "Card", "2-10", 9.99, 15);
    stmt.finalize();

    db.run("INSERT INTO Users VALUES ('priya', 'password123')");

    console.log("Database created successfully.");
});

db.close();