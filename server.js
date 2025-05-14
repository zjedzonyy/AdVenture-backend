const app = require("./app");

const prisma = require("./database/prisma");

const PORT = process.env.PORT || 3000;
let server;

// Graceful shutdown
async function shutdownGracefully() {
  console.log("Shuting down server...");

  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
    });
  }

  try {
    // Close database connection
    await prisma.$disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error while closing the database connection:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Start server
async function startServer() {
  try {
    // Connect with database
    await prisma.$connect();
    console.log("Successfully connected with database");

    // Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });

    // Handle systemcalls
    process.on("SIGTERM", shutdownGracefully);
    process.on("SIGINT", shutdownGracefully);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

// Obsługa nieobsłużonych wyjątków i odrzuceń promise
process.on("uncaughtException", (error) => {
  console.error("Nieobsłużony wyjątek:", error);
  shutdownGracefully();
});

process.on("unhandledRejection", (reason) => {
  console.error("Nieobsłużone odrzucenie promise:", reason);
  shutdownGracefully();
});

module.exports = {
  prisma,
  startServer,
};

if (require.main === module) {
  startServer();
}
