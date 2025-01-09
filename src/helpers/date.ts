import { compareDesc, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const parseDateDistance = (date: Date | string | null) => {
  if (!date) {
    return null;
  }

  const parseIsoStringDate = typeof date === "string" ? parseISO(date) : date;

  return formatDistanceToNow(parseIsoStringDate, {
    locale: ptBR,
    addSuffix: true,
  });
};

export type DateInput = Date | string | number | null;

export const dateParser = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  string: (date: any) => parseISO(date),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  number: (date: any) => new Date(date),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  date: (date: any) => date,
};

type KeyofParser = keyof typeof dateParser;

export const sortDateByDesc = (date1: DateInput, date2: DateInput) => {
  const parsedDate1 = dateParser[typeof date1 as KeyofParser](date1);
  const parsedDate2 = dateParser[typeof date2 as KeyofParser](date2);

  return compareDesc(parsedDate1, parsedDate2);
};
