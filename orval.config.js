require("dotenv").config();

module.exports = {
  okami: {
    output: {
      target: "api/okami.ts",
      schemas: "api/models",
      client: "react-query",
      override: {
        mutator: {
          path: "./lib/axios.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "swagger.json",
    },
  },
};
