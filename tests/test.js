const db = require("../db/db");
const seed = require("../db/seed");
const { getQueryInterface } = require("sequelize");
const { Board, Cheese, User } = require("../models");
// const main = require("../src/main");

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
      const data = await User.create({
        name: "Joe Bloggs",
        email: "joe@test.com",
      });
      expect(data.toJSON().name).toBe("Joe Bloggs");
      expect(data.toJSON().email).toBe("joe@test.com");
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
      const data = await Board.create({
        type: "French",
        description: "The perfect French cheese board",
        rating: 8,
      });
      expect(data.toJSON().type).toBe("French");
      expect(data.toJSON().description).toBe("The perfect French cheese board");
      expect(data.toJSON().rating).toBe(8);
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
      const data = await Cheese.create({
        title: "Camembert",
        description: "A moist, soft, creamy, surface-ripened cow's milk cheese",
      });
      expect(data.toJSON().title).toBe("Camembert");
      expect(data.toJSON().description).toBe(
        "A moist, soft, creamy, surface-ripened cow's milk cheese"
      );
    });
  });
});
