import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

//swagger options

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "BROKER PORTAL API",
      version: "1.0.0",
      description: "REST API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["**/*.ts"],
};
const specs = swaggerJsdoc(options);

export function setupSwagger(app: Application): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
