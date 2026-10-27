const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function checkUser(username, password) {
    const db = await sqlite.open({
        filename: "database.db",
        driver: sqlite3.Database
    });

    return await db.get(
        "SELECT * FROM Users WHERE username = ? AND password = ?", [username, password]
    );
}

module.exports = { checkUser };