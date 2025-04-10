import { unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

import orval from "orval";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const OKAMI_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
const SWAGGER_PATH = path.resolve(__dirname, "../swagger.json");
const ORVAL_CONFIG_PATH = path.resolve(__dirname, "../orval.config.js");

(async () => {
  try {
    if (!OKAMI_URL) {
      console.error("EXPO_PUBLIC_API_URL is not defined in .env");
      return;
    }

    console.log("Fetching Swagger API from Okami API");

    const response = await axios.get(`${OKAMI_URL}/static/swagger`, {
      responseType: "json",
    });

    console.log("Writing Swagger API to file");

    writeFileSync(SWAGGER_PATH, JSON.stringify(response.data, null, 2));

    await orval(ORVAL_CONFIG_PATH);

    console.log("API generation completed");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error fetching Swagger API from Okami API");
    }

    console.error(error);
  } finally {
    console.log("Finished script");
    console.log("Exiting...");

    unlinkSync(SWAGGER_PATH);
  }
})();
