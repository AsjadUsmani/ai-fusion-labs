"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render the Sheet root element and forward all props to the underlying root primitive.
 *
 * Adds data-slot="sheet" to the rendered element.
 * @param {Object} props - Props passed through to the sheet root element (e.g., children, open, onOpenChange, className).
 * @returns {JSX.Element} The rendered sheet root element with data-slot="sheet".
 */
function Sheet({
  ...props
}) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Renders a sheet trigger element that forwards all props to the underlying Radix Trigger and sets a data-slot attribute.
 * @param {Object} props - Props forwarded to the Radix Trigger (e.g., children, event handlers, className).
 * @returns {JSX.Element} The underlying trigger element with data-slot="sheet-trigger".
 */
function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

/**
 * Render a sheet close control that forwards all props to the underlying Radix Close element.
 * @param {Object} props - Props passed through to the underlying element (e.g., event handlers, className, aria attributes).
 * @returns {import('react').ReactElement} The rendered sheet close element with data-slot="sheet-close".
 */
function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Render a sheet portal that hosts sheet content outside the current DOM hierarchy.
 * @param {Object} props - Props forwarded to the underlying portal element.
 * @returns {JSX.Element} The sheet portal element.
 */
function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Renders the sheet overlay element with backdrop styling and open/close animation hooks.
 * @param {string} [className] - Additional class names appended to the overlay.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix Overlay component.
 * @returns {JSX.Element} The sheet overlay element.
 */
function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Render the sheet's content inside a portal with an overlay and a built-in close button; placement and entrance/exit animations vary by `side`.
 *
 * @param {string} [className] - Additional class names appended to the content container.
 * @param {import('react').ReactNode} [children] - Elements rendered inside the sheet content.
 * @param {"right"|"left"|"top"|"bottom"} [side="right"] - Side from which the sheet appears; controls placement, size, and slide-in/out animations.
 * @returns {JSX.Element} The sheet content element including portal, overlay, and close control.
 */
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}>
        {children}
        <SheetPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * Renders the sheet header container with base vertical layout, gap, and padding.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes appended to the header's base styles.
 * @param {Object} [props.props] - Additional props are forwarded to the underlying div.
 * @returns {JSX.Element} The header container element with data-slot="sheet-header".
 */
function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} />
  );
}

/**
 * Renders the sheet footer container.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to append to the footer container.
 * @returns {JSX.Element} A div element used as the sheet's footer with base spacing and padding classes applied.
 */
function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

/**
 * Renders a styled sheet title element.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the title.
 * @returns {JSX.Element} A React element representing the sheet's title.
 */
function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

/**
 * Renders the sheet description element with base muted, small-text styling and a data-slot attribute for composition.
 *
 * @param {string} [className] - Additional CSS classes to append to the base styles.
 * @returns {JSX.Element} The rendered sheet description element.
 */
function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}