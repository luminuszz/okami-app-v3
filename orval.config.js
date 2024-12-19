module.exports = {
  okami: {
    input: {
      target: "./swagger.json",
    },

    output: {
      target: "src/api/okami.ts",
      schemas: "src/api/models",
      client: "react-query",
      override: {
        mutator: {
          path: "src/lib/axios/index.ts",
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
