import type { ComponentProps } from "react";

export function PageFrame({ className, ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full min-w-0 max-w-5xl ${className ?? ""}`} {...props} />;
}
