/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */
import type { LoggerControllerHealthCheck503Details } from './loggerControllerHealthCheck503Details';
import type { LoggerControllerHealthCheck503Error } from './loggerControllerHealthCheck503Error';
import type { LoggerControllerHealthCheck503Info } from './loggerControllerHealthCheck503Info';

export type LoggerControllerHealthCheck503 = {
  details?: LoggerControllerHealthCheck503Details;
  /** @nullable */
  error?: LoggerControllerHealthCheck503Error;
  /** @nullable */
  info?: LoggerControllerHealthCheck503Info;
  status?: string;
};
