import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const StyledFlex = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("flex flex-row flex-wrap items-center justify-center", className)}
    {...props}
  />
);

export default StyledFlex;
