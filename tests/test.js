const db = require("../db/db");
const seed = require("../db/seed");
const { Board, Cheese, User } = require("../models");
const { addToUser, addToBoard, addToCheese } = require("../src/main");

beforeAll(() => seed());

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
      await addToBoard("French", "Another French cheese board.", 7);
      const newBoard = await Board.findAll({ where: { type: "French" } });
      expect(newBoard[0].dataValues.type).toBe("French");
      expect(newBoard[0].dataValues.description).toBe(
        "The perfect French cheese board."
      );
      expect(newBoard[0].dataValues.rating).toBe(8);
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
