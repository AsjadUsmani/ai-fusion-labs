"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

/**
 * Accesses the sidebar context value for the nearest SidebarProvider.
 *
 * Provides the shared sidebar state and actions (open state, setters, isMobile, toggle, etc.).
 * @returns {import('./sidebar').SidebarContextValue} The Sidebar context value object.
 * @throws {Error} If called outside of a SidebarProvider.
 */
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

/**
 * Provides Sidebar context to children and manages desktop/mobile open state, persistence, and keyboard shortcut.
 *
 * Persists desktop open state to a cookie (SIDEBAR_COOKIE_NAME) with max age SIDEBAR_COOKIE_MAX_AGE and registers a global
 * Cmd/Ctrl+B keyboard shortcut to toggle the sidebar. Exposes context values: { state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultOpen=true] - Initial uncontrolled open state used when `open` is not provided.
 * @param {boolean} [props.open] - Controlled open state. If provided, the provider becomes controlled and internal state is not used.
 * @param {(boolean) => void} [props.onOpenChange] - Callback invoked when the open state changes; receives the new open value.
 * @param {string} [props.className] - Additional className applied to the outer wrapper.
 * @param {Object} [props.style] - Inline styles applied to the outer wrapper; CSS custom properties for sidebar widths are merged.
 * @param {import('react').ReactNode} props.children - Child elements that consume the Sidebar context.
 * @returns {import('react').ReactElement} A SidebarProvider element that supplies sidebar state and renders its children.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [setOpenProp, open])

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style
            }
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * Renders a responsive sidebar that adapts between desktop and mobile layouts and supports collapsible/variant modes.
 *
 * @param {Object} props - Component props.
 * @param {"left"|"right"} [props.side="left"] - Which side of the viewport the sidebar is anchored to.
 * @param {"sidebar"|"floating"|"inset"} [props.variant="sidebar"] - Visual variant that adjusts padding, borders, and shadow.
 * @param {"offcanvas"|"icon"|"none"} [props.collapsible="offcanvas"] - Collapsible behavior: `offcanvas` hides the panel, `icon` collapses to icons, `none` disables collapsibility.
 * @param {string} [props.className] - Additional classes applied to the top-level container(s).
 * @param {import('react').ReactNode} [props.children] - Sidebar content.
 * @returns {import('react').ReactElement} The rendered sidebar element suitable for desktop and mobile contexts.
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE
            }
          }
          side={side}>
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar">
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )} />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}>
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a small ghost icon button that toggles the sidebar when activated.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names applied to the button.
 * @param {function} [props.onClick] - Optional click handler invoked (if provided) before the sidebar toggle.
 * @param {...any} [props.props] - Additional props forwarded to the underlying Button element.
 * @returns {JSX.Element} The sidebar trigger button element.
 */
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Render a decorative sidebar rail button that toggles the sidebar when activated.
 *
 * @param {string} [className] - Additional CSS classes to apply to the button.
 * @param {...any} props - Additional props forwarded to the underlying button element.
 * @returns {JSX.Element} The rail toggle button element.
 */
function SidebarRail({
  className,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props} />
  );
}

/**
 * Render the page's primary inset content area used when the sidebar is embedded or inset.
 *
 * Renders a <main> element with the `data-slot="sidebar-inset"` attribute and layout classes
 * that adapt spacing, rounding, and shadowing for inset variants and collapsed states.
 *
 * @param {string} [className] - Additional CSS classes to append to the default inset classes.
 * @param {Object} [props] - Additional props are spread onto the rendered <main> element.
 * @returns {JSX.Element} The rendered main element for the inset content area.
 */
function SidebarInset({
  className,
  ...props
}) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props} />
  );
}

/**
 * Renders an input element pre-styled for use inside a sidebar.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to apply to the input.
 * @returns {JSX.Element} A React input element styled for sidebar layouts.
 */
function SidebarInput({
  className,
  ...props
}) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props} />
  );
}

/**
 * Renders a header area inside the sidebar.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names applied to the header container.
 * @returns {JSX.Element} The sidebar header container div.
 */
function SidebarHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />
  );
}

/**
 * Renders the sidebar's footer area.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Optional additional class names applied to the footer container.
 * @returns {JSX.Element} A div element styled and attributed as the sidebar footer which forwards extra props to the container.
 */
function SidebarFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props} />
  );
}

/**
 * Render a separator styled for use inside the sidebar.
 *
 * Renders a Separator element with sidebar-specific data attributes and classes.
 * @returns {JSX.Element} The styled sidebar separator element.
 */
function SidebarSeparator({
  className,
  ...props
}) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props} />
  );
}

/**
 * Render the scrollable main content area for a sidebar.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the content container.
 * @returns {JSX.Element} The sidebar content container element with overflow and layout styles; additional props are forwarded to the container.
 */
function SidebarContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Render a container that groups related sidebar items and applies sidebar-specific layout and spacing.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the group container.
 * @returns {JSX.Element} A div element serving as a sidebar group container.
 */
function SidebarGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props} />
  );
}

/**
 * Render a label for a grouped sidebar section.
 *
 * When `asChild` is true, the label is rendered using a Slot; otherwise it renders a div.
 *
 * @param {string} [className] - Additional class names to apply to the label container.
 * @param {boolean} [asChild=false] - If true, render the label using a Slot to inherit parent element semantics.
 * @param {object} [props] - Additional props are spread onto the rendered element.
 * @returns {import('react').ReactElement} The rendered label element.
 */
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props} />
  );
}

/**
 * Render an action control positioned inside a sidebar group.
 *
 * @param {string} [className] - Additional CSS classes applied to the action element.
 * @param {boolean} [asChild=false] - When true, render a Slot as the underlying element instead of a native button.
 * @param {object} [props] - Additional props passed through to the underlying element (e.g., event handlers, aria attributes).
 * @returns {JSX.Element} The rendered action element for a sidebar group.
 */
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Renders the content area for a sidebar group used as the group's main body.
 *
 * The element is a full-width container that includes data attributes for sidebar theming and composition.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes applied to the container.
 * @returns {JSX.Element} The rendered group content container (<div data-slot="sidebar-group-content" data-sidebar="group-content">).
 */
function SidebarGroupContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props} />
  );
}

/**
 * Renders a vertical list container for sidebar menu items.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names applied to the root <ul>.
 * @param {...any} [props] - Additional attributes are spread onto the underlying <ul> element.
 * @returns {HTMLElement} The rendered <ul> element serving as the sidebar menu container.
 */
function SidebarMenu({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props} />
  );
}

/**
 * Renders a sidebar menu list item wrapper with sidebar-specific data attributes and base classes.
 * @param {Object} props - Props forwarded to the underlying <li> element.
 * @param {string} [props.className] - Additional class names to apply to the list item.
 * @returns {JSX.Element} The rendered <li> element for a sidebar menu item.
 */
function SidebarMenuItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props} />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Renders a sidebar menu button with configurable visual variants, size, and optional tooltip.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.asChild=false] - If true, renders a Slot instead of a native button to allow custom child elements.
 * @param {boolean} [props.isActive=false] - Marks the button as active for styling via data-active.
 * @param {"default"|"outline"} [props.variant="default"] - Visual variant of the button.
 * @param {"default"|"sm"|"lg"} [props.size="default"] - Size variant applied to the button.
 * @param {string|Object} [props.tooltip] - If provided, shows a tooltip. Can be a string (tooltip text) or an object of props forwarded to TooltipContent.
 * @param {string} [props.className] - Additional class names to apply to the button.
 * @returns {JSX.Element} A configured button element; if `tooltip` is provided, the button is wrapped with a Tooltip and TooltipContent.
 */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props} />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip} />
    </Tooltip>
  );
}

/**
 * Render an absolute-positioned action control inside a sidebar menu item.
 *
 * Renders a square, icon-sized action element aligned to the top-right of a menu item. When `asChild` is true, the provided child element is used instead of a native button; when `showOnHover` is true, the control is visually hidden by default and revealed on hover/active/focus states to reduce visual clutter.
 *
 * @param {string} [className] - Additional class names applied to the action element.
 * @param {boolean} [asChild=false] - If true, use the provided child element (via Slot) as the rendered component instead of a `button`.
 * @param {boolean} [showOnHover=false] - If true, hide the control by default and show it when the parent menu item is hovered, focused, active, or open.
 * @param {...any} [props] - Extra props forwarded to the rendered element (e.g., onClick, aria attributes).
 * @returns {JSX.Element} The rendered sidebar menu action element.
 */
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props} />
  );
}

/**
 * Renders a small positioned badge for a sidebar menu item.
 *
 * The badge is absolutely positioned at the right edge of a menu item, non-interactive, and adapts its vertical placement based on the menu item size and active state. It sets `data-slot="sidebar-menu-badge"` and `data-sidebar="menu-badge"` on the wrapper and accepts any standard HTML div props.
 *
 * @param {Object} props - Props forwarded to the badge container.
 * @param {string} [props.className] - Additional class names to apply to the badge container.
 * @returns {JSX.Element} The badge element to display alongside a sidebar menu item.
 */
function SidebarMenuBadge({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Render a skeleton placeholder for a sidebar menu item.
 *
 * The text placeholder width is randomized between 50% and 90% on each render to
 * provide varied loading visuals. Optionally renders an icon placeholder when requested.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names applied to the container.
 * @param {boolean} [props.showIcon=false] - If `true`, render a square icon skeleton to the left of the text.
 * @returns {JSX.Element} The sidebar menu skeleton element.
 */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}>
      {showIcon && (
        <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width
          }
        } />
    </div>
  );
}

/**
 * Renders a nested sidebar sub-menu as an unordered list.
 *
 * This component produces a <ul> element with data-slot="sidebar-menu-sub" and
 * data-sidebar="menu-sub", styled for sidebar sub-menus and hidden when the
 * sidebar is in icon-collapsible mode.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes to apply to the <ul>.
 * @returns {JSX.Element} A <ul> element representing a nested sidebar sub-menu.
 */
function SidebarMenuSub({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

/**
 * Render a list item configured as a sidebar submenu item.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the list item.
 * @returns {JSX.Element} A <li> element with sidebar submenu-specific data attributes and classes.
 */
function SidebarMenuSubItem({
  className,
  ...props
}) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props} />
  );
}

/**
 * Renders a sub-menu button for a sidebar menu, optionally rendering a provided child element instead of an anchor.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.asChild=false] - If true, render the provided child element via Slot instead of an anchor.
 * @param {"sm"|"md"} [props.size="md"] - Visual size of the button; adjusts typography and spacing.
 * @param {boolean} [props.isActive=false] - Marks the button as active; sets an active state attribute used for styling.
 * @param {string} [props.className] - Additional CSS classes applied to the root element.
 * @param {...any} [props.props] - Additional props are forwarded to the rendered root element (anchor or Slot).
 * @returns {import('react').ReactElement} A React element representing the sidebar sub-menu button.
 */
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props} />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}