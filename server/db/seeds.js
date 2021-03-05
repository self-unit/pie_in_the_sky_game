use pieInTheSky;
db.dropDatabase();

db.games.insertMany([
  {
    name: "Sharon",
    wins : 5
  },
  {
    name: "April",
    wins: 8
  },
  {
    name: "Jacob",
    wins: 3
  }
]);
