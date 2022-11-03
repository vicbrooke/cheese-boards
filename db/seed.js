const { Board, Cheese, User } = require("../models");
const db = require("../db/db");

async function seed() {
  await db.sync({
    force: true,
  });

  await Board.bulkCreate([
    {
      type: "English",
      description: "A delicious selection of English cheese.",
      rating: 10,
    },
    {
      type: "French",
      description: "The perfect French cheese board.",
      rating: 8,
    },
    {
      type: "Italina",
      description: "A perfect start to any Italian meal.",
      rating: 7,
    },
  ]);

  await Cheese.bulkCreate([
    {
      title: "Cheddar",
      description: "A cow's milk cheese that was first produced in England.",
    },
    {
      title: "Gouda",
      description:
        "A semi-hard cheese typically made from cow's milk and is known for its springy texture and rich, caramelized flavor. ",
    },
    {
      title: "Brie",
      description:
        "Typically made with cow's milk, brie is known for its soft, edible rind and smooth, creamy interior.",
    },
    {
      title: "Comte",
      description:
        "Comté is to the French what Cheddar is to the English. A ubiquitous hard sharp cheese known for its complex fruity and nutty flavour.",
    },
    {
      title: "Roquefort",
      description:
        "A sheep milk cheese from Southern France, one of the world's best known blue cheeses",
    },
    {
      title: "Wensleydale",
      description:
        "A medium cheese that is supple and crumbly with a slight honey aroma.",
    },
    {
      title: "Mozzarella",
      description: "A sliceable curd cheese originating in Italy.",
    },
    {
      title: "Stilton",
      description:
        "A rich tangy flavour, and a velvety-soft texture that makes it melt in the mouth.",
    },
    {
      title: "Chevin",
      description: "A soft, goat's milk cheese with a characteristic flavour.",
    },
    {
      title: "Manchego",
      description:
        "A cheese made in the La Mancha region of Spain from the milk of sheep of the Manchega breed. It has a firm and compact consistency and a buttery texture,",
    },
  ]);

  await User.bulkCreate([
    { name: "Tom", email: "tom@test.com" },
    { name: "Bob", email: "bob@test.com" },
    { name: "Sally", email: "sally@test.com" },
    { name: "Eddie", email: "eddie@test.com" },
    { name: "Jen", email: "jen@test.com" },
    { name: "Charlie", email: "charlie@test.com" },
  ]);
}

module.exports = seed;
