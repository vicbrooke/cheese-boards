const db = require("../db/db");
const seed = require("../db/seed");
const { Board, Cheese, User } = require("../models");
const {
  addToUser,
  addToBoard,
  addToCheese,
  addBoardToUser,
} = require("../src/main");

beforeEach(async () => {
  await db.sync({
    force: true,
  });
  await seed();
});

describe("Check if tables are created and data can be inserted", () => {
  describe("Users table", () => {
    test("Users table should exist", async () => {
      const data = await db.getQueryInterface().showAllSchemas();
      expect(data[0].name).toBe("Users");
    });
    test("Users table has correct columns", async () => {
      const data = await db.queryInterface.describeTable("Users");
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("email");
    });
    test("data can be inserted into Users table", async () => {
      await addToUser("Joe Bloggs", "joe.bloggs@test.com");
      const newUser = await User.findAll({ where: { name: "Joe Bloggs" } });
      expect(newUser[0].dataValues.name).toBe("Joe Bloggs");
      expect(newUser[0].dataValues.email).toBe("joe.bloggs@test.com");
    });
    test("seed data exists", async () => {
      const users = await User.findAll();
      expect(users.length).toBe(6);
    });
  });
  describe("Boards table", () => {
    test("Boards table should exist", async () => {
      const data = await db.getQueryInterface().showAllSchemas();
      expect(data[1].name).toBe("Boards");
    });
    test("Boards table has correct columns", async () => {
      const data = await db.queryInterface.describeTable("Boards");
      expect(data).toHaveProperty("type");
      expect(data).toHaveProperty("description");
      expect(data).toHaveProperty("rating");
    });
    test("data can be inserted into Boards table", async () => {
      await addToBoard("Dutch", "A Dutch cheese board.", 7);
      const newBoard = await Board.findAll({ where: { type: "Dutch" } });
      expect(newBoard[0].dataValues.type).toBe("Dutch");
      expect(newBoard[0].dataValues.description).toBe("A Dutch cheese board.");
      expect(newBoard[0].dataValues.rating).toBe(7);
    });
  });
  describe("Cheeses table", () => {
    test("Cheeses table should exist", async () => {
      const data = await db.getQueryInterface().showAllSchemas();
      expect(data[2].name).toBe("Cheeses");
    });
    test("Cheeses table has correct columns", async () => {
      const data = await db.queryInterface.describeTable("Cheeses");
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("description");
    });
    test("data can be inserted into Cheeses table", async () => {
      await addToCheese(
        "Camembert",
        "A moist, soft, creamy, surface-ripened cow's milk cheese."
      );
      const newCheese = await Cheese.findAll({ where: { title: "Camembert" } });
      expect(newCheese[0].dataValues.title).toBe("Camembert");
      expect(newCheese[0].dataValues.description).toBe(
        "A moist, soft, creamy, surface-ripened cow's milk cheese."
      );
    });
  });
});

describe("Check associations of tables", () => {
  describe("Users <-> Board", () => {
    test("a board can be added to a user", async () => {
      await addBoardToUser(2, "French");
      const user = await User.findByPk(2);
      const userBoards = await user.getBoards();
      expect(userBoards.length).toBe(1);
    });
    test("the board will be associated with the userId", async () => {
      await addBoardToUser(2, "French");
      const board = await Board.findAll({ where: { type: "French" } });
      expect(board[0].UserId).toBe(2);
    });
    test("a user can have many boards", async () => {
      await addBoardToUser(2, "French");
      await addBoardToUser(2, "English");
      await addBoardToUser(2, "Italian");
      const user = await User.findByPk(2);
      const userBoards = await user.getBoards();
      expect(userBoards.length).toBe(3);
    });
  });
});
