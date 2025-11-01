import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Determine whether the current viewport width is considered mobile.
 *
 * Uses MOBILE_BREAKPOINT as the width threshold.
 * @returns {boolean} `true` if the viewport width is less than MOBILE_BREAKPOINT (mobile), `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}