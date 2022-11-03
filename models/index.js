const Board = require("./board.model");
const Cheese = require("./cheese.model");
const User = require("./user.model");

// One-to-many relationship
User.hasMany(Board);
Board.belongsTo(User);

//Many-to-many relationship
Board.belongsToMany(Cheese, { through: "Board_Cheese" });
Cheese.belongsToMany(Board, { through: "Board_Cheese" });

module.exports = { Board, Cheese, User };
