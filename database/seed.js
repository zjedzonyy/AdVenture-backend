const prisma = require("./prisma");

async function main() {
  // CREATE REF DATA (CATEGORIES, RANGE OF PRICES ETC.)
  //   Category
  const categoryData = [
    "All",
    "Self-Discovery",
    "Art",
    "Cooking",
    "Creativity",
    "Sports",
    "Travel",
    "Technology",
    "Music",
    "Internet",
  ];

  for (const item of categoryData) {
    await prisma.category.create({ data: { title: item } });
  }

  //   Duration

  const durationData = [
    "0-15",
    "15-30",
    "30-60",
    "60-120",
    "120-480",
    "day",
    "weekend",
  ];

  for (const item of durationData) {
    await prisma.duration.create({ data: { label: item } });
  }

  //   GroupSize
  const groupSizeData = ["1", "2", "3-5", ">6"];

  for (const item of groupSizeData) {
    await prisma.groupSize.create({ data: { size: item } });
  }

  // USERS PLAIN DATA
  //   const userData = [];
  //   for (let i = 0; i < 10; i++) {
  //     let user = {
  //       username: `TestUser${i}`,
  //       email: `TestUser${i}gmail.com`,
  //       password: "Password1",
  //     };
  //     userData.push(user);
  //   }
  //   console.log(userData);
  // }
}

main();
