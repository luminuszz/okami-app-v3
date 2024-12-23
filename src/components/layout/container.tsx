import { twMerge } from "tailwind-merge";
import { Box } from "../ui/box";

export interface ContainerProps {
  children: React.ReactNode;
  classname?: string;
}

export function Container({ children, classname }: ContainerProps) {
  return <Box className={twMerge("mt-5 h-full w-full flex-1 bg-[#031318]", classname)}>{children}</Box>;
}
