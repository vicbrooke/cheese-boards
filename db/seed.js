const { Board, Cheese, User } = require("../models");
const db = require("../db/db");

async function seed() {
  await db.sync({
    force: true,
  });
}

module.exports = seed;
