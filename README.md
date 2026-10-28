
# Project #1: The Rolling Die

## About
The Rolling Die is a board game store website with a Discord bot. Customers can browse games, check prices and stock, and get recommendations. Staff can log in to manage games and view Discord bot activity on the live dashboard.

## Technologies Used
- Node.js
- Express
- Mustache
- SQLite
- Discord.js
- Socket.IO

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up the Discord Bot
Configure the Discord bot token and required IDs in the `.env` file.

### 3. Set Up the Database
Run the database initialization script:

```bash
node initdb.js
```

### 4. Register Discord Commands
```bash
node deploy-commands.js
```

### 5. Start the Application
```bash
node app.js
```

Open http://localhost:3000 in your browser.

## Sample Manager Login
- Username: `priya`
- Password: `password123`

## Features
- Public page to browse games.
- Staff login and game inventory management.
- `/price` to check a game's price.
- `/stock` to check a game's stock.
- `/recommend` to find games by category and maximum price.
- Live dashboard showing Discord bot activity without refreshing the page.
