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
      target: "src/api/okami.ts",
      schemas: "api/models",
      client: "react-query",
      override: {
        mutator: {
          path: "src/lib/axios.ts",
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
