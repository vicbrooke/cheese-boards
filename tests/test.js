const db = require("../db/db");
const seed = require("../db/seed");
const { Board, Cheese, User } = require("../models");
const {
  addToUser,
  addToBoard,
  addToCheese,
  addBoardToUser,
  addCheeseToBoard,
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
      const newUser = await User.findOne({ where: { name: "Joe Bloggs" } });
      expect(newUser.dataValues.name).toBe("Joe Bloggs");
      expect(newUser.dataValues.email).toBe("joe.bloggs@test.com");
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
      const newBoard = await Board.findOne({ where: { type: "Dutch" } });
      expect(newBoard.dataValues.type).toBe("Dutch");
      expect(newBoard.dataValues.description).toBe("A Dutch cheese board.");
      expect(newBoard.dataValues.rating).toBe(7);
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
      const board = await Board.findOne({ where: { type: "French" } });
      expect(board.UserId).toBe(2);
    });
    test("a user can have many boards", async () => {
      const frenchBoard = await Board.findOne({ where: { type: "French" } });
      const englishBoard = await Board.findOne({ where: { type: "English" } });
      const italianBoard = await Board.findOne({ where: { type: "Italian" } });
      const user = await User.findByPk(2);
      await user.addBoards([frenchBoard, englishBoard, italianBoard]);
      const userBoards = await user.getBoards();
      expect(userBoards.length).toBe(3);
      expect(userBoards.map((el) => el.type)).toEqual([
        "English",
        "French",
        "Italian",
      ]);
    });
  });
  describe("Boards <-> Cheeses", () => {
    test("a board can have a cheese", async () => {
      await addCheeseToBoard(1, "Wensleydale");
      const board = await Board.findByPk(1);
      const cheeseBoards = await board.getCheeses();
      expect(cheeseBoards.length).toBe(1);
    });
    test("a board can have many cheeses", async () => {
      const cheese1 = await Cheese.findOne({ where: { title: "Wensleydale" } });
      const cheese2 = await Cheese.findOne({ where: { title: "Cheddar" } });
      const cheese3 = await Cheese.findOne({ where: { title: "Stilton" } });
      const board = await Board.findByPk(1);
      await board.addCheeses([cheese1, cheese2, cheese3]);
      const cheeseBoards = await board.getCheeses();
      expect(cheeseBoards.length).toBe(3);
      expect(cheeseBoards.map((el) => el.title)).toEqual([
        "Cheddar",
        "Wensleydale",
        "Stilton",
      ]);
    });
    test("a cheese can be on many boards", async () => {
      const cheese = await Cheese.findOne({ where: { title: "Stilton" } });
      const board1 = await Board.findByPk(1);
      const board2 = await Board.findByPk(2);
      const board3 = await Board.findByPk(3);
      await cheese.addBoards([board1, board2, board3]);
      const cheeseBoards = await cheese.getBoards();
      expect(cheeseBoards.length).toBe(3);
      expect(cheeseBoards.map((el) => el.type)).toEqual([
        "English",
        "French",
        "Italian",
      ]);
    });
  });
  describe("Eager loading", () => {
    test("a board can be loaded with its cheeses ", async () => {
      await addCheeseToBoard(1, "Wensleydale");
      await addCheeseToBoard(1, "Cheddar");
      await addCheeseToBoard(1, "Stilton");
      const boardEnglish = await Cheese.findAll({
        include: {
          model: Board,
          where: {
            id: 1,
          },
        },
      });
      console.table(boardEnglish.map((c) => c.toJSON()));
      expect(boardEnglish.length).toBe(3);
    });
    test("a user can be loaded with its boards", async () => {
      await addBoardToUser(6, "English");
      await addBoardToUser(6, "French");
      await addBoardToUser(6, "Italian");
      const userBoards = await Board.findAll({
        include: {
          model: User,
          where: {
            id: 6,
          },
        },
      });
      console.table(userBoards.map((c) => c.toJSON()));
      expect(userBoards.length).toBe(3);
    });
    test("a cheese can be loaded with its board data", async () => {
      await addCheeseToBoard(1, "Stilton");
      await addCheeseToBoard(2, "Stilton");
      await addCheeseToBoard(3, "Stilton");
      const whichBoards = await Board.findAll({
        include: {
          model: Cheese,
          where: {
            title: "Stilton",
          },
        },
      });
      console.table(whichBoards.map((c) => c.toJSON()));
      expect(whichBoards.length).toBe(3);
    });
  });
});
