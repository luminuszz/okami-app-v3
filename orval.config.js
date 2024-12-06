require("dotenv").config();

module.exports = {
  okami: {
    input: {
      target: "./swagger.json",
      filers: {
        mode: "exclude",
        tags: [/health/],
      },
    },

    output: {
      target: "api/okami.ts",
      schemas: "api/models",
      client: "react-query",
      override: {
        mutator: {
          path: "./lib/axios.ts",
          name: "customInstance",
        },
        query: {
          useInfinite: true,
          useInfiniteQueryParam: "page",
        },
      },
    },
  },
};
