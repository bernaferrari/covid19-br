import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingProps = ComponentProps<"h2"> & {
  children: ReactNode;
};

export const SectionTitle = ({ className, children, ...props }: HeadingProps) => (
  <h2 className={cn("mx-1 text-center text-base font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const SectionTitleAbout = ({ className, children, ...props }: HeadingProps) => (
  <h2 className={cn("mx-1 text-center text-lg font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const SectionSubtitle = ({ className, children, ...props }: HeadingProps) => (
  <h3 className={cn("mx-1 text-center text-sm font-medium text-gray-500", className)} {...props}>
    {children}
  </h3>
);
