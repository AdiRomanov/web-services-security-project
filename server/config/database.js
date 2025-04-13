const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');
const dbUtils = require('../utils/dbUtils');

const db = new sqlite3.Database(path.join(__dirname, '../db.sqlite'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// Promisify DB methods
db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    userId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

// Enable WAL mode for better concurrency
dbUtils.enableWALMode(db);

module.exports = db;