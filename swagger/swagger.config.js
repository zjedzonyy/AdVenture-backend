const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdVenture API",
      version: "1.0.0",
      description:
        "This is a simplified API documentation for the AdVenture project. Only selected endpoints are included for demonstration and testing purposes. Authentication is required for all routes — please log in using the provided example credentials.",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Session cookie for authentication",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
