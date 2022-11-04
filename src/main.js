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

module.exports = { addToUser, addToBoard, addToCheese };
