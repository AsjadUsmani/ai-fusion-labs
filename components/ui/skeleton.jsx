import { cn } from "@/lib/utils"

/**
 * Render a skeleton placeholder div used for loading states.
 * @param {string} className - Optional additional CSS classes to merge with the component's base classes.
 * @param {object} props - Additional attributes and event handlers forwarded to the root div.
 * @returns {JSX.Element} The rendered div element with base skeleton styles and any provided props.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }