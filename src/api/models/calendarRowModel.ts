/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Okami API
 * The Okami rest api
 * OpenAPI spec version: 1.0
 */
import type { CalendarRowModelDayOfWeek } from './calendarRowModelDayOfWeek';
import type { WorkCalendarRowModel } from './workCalendarRowModel';

export interface CalendarRowModel {
  createdAt: string;
  dayOfWeek: CalendarRowModelDayOfWeek;
  id: string;
  Work: WorkCalendarRowModel;
}
