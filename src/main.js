const { Board, Cheese, User } = require("../models");

async function addToUser(userName, userEmail) {
  await User.create({
    name: userName,
    email: userEmail,
  });
}

async function addToBoard(boardType, boardDescription, boardRating) {
  await Board.create({
    type: boardType,
    description: boardDescription,
    rating: boardRating,
  });
}

async function addToCheese(cheeseTitle, cheeseDescription) {
  await Cheese.create({
    title: cheeseTitle,
    description: cheeseDescription,
  });
}

async function addBoardToUser(userId, boardToAdd) {
  const user = await User.findByPk(userId);
  const newBoard = await Board.findAll({ where: { type: boardToAdd } });
  await user.addBoard(newBoard[0]);
}

module.exports = { addToUser, addToBoard, addToCheese, addBoardToUser };
