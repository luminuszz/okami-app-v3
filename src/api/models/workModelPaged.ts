/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */
import type { WorkHttp } from "./workHttp";

export interface WorkModelPaged {
  nextPage: number | null;
  totalOfPages: number;
  works: WorkHttp[];
}