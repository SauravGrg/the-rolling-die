const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function getDb() {
    return await sqlite.open({
        filename: "database.db",
        driver: sqlite3.Database
    });
}

async function getAllGames() {
    const db = await getDb();
    return await db.all("SELECT * FROM Games ORDER BY title ASC");
}

async function findGameByTitle(title) {
    const db = await getDb();
    return await db.get("SELECT * FROM Games WHERE LOWER(title) LIKE LOWER(?)", ["%" + title + "%"]);
}

async function filterGames(category, maxPrice) {
    const db = await getDb();
    return await db.all(
        "SELECT * FROM Games WHERE LOWER(category) = LOWER(?) AND price <= ? ORDER BY price ASC",
        [category, maxPrice]
    );
}

async function createGame(title, category, players, price, stock) {
    const db = await getDb();
    await db.run(
        "INSERT INTO Games (title, category, players, price, stock) VALUES (?, ?, ?, ?, ?)",
        [title, category, players, parseFloat(price), parseInt(stock)]
    );
}

async function updateGame(id, title, category, players, price, stock) {
    const db = await getDb();
    await db.run(
        "UPDATE Games SET title = ?, category = ?, players = ?, price = ?, stock = ? WHERE id = ?",
        [title, category, players, parseFloat(price), parseInt(stock), id]
    );
}

async function deleteGame(id) {
    const db = await getDb();
    await db.run("DELETE FROM Games WHERE id = ?", [id]);
}

module.exports = {
    getAllGames,
    findGameByTitle,
    filterGames,
    createGame,
    updateGame,
    deleteGame
};