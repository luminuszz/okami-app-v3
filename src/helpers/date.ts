import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const parseDateDistance = (date: Date | string) => {
  const parseIsoStringDate = typeof date == "string" ? parseISO(date) : date;

  const formattedDate = formatDistanceToNow(parseIsoStringDate, {
    locale: ptBR,
    addSuffix: true,
  });

  return formattedDate;
};
