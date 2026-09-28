const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Authentication & Product CRUD API",
    description:
      "API documentation for User Authentication and Product CRUD operations",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(
    "Swagger documentation generated successfully at src/swagger-output.json",
  );
});
