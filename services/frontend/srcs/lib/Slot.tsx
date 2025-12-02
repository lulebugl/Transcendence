import * as React from "react";

/**
 * Merges props from Slot onto the child element.
 * - className: concatenated
 * - style: shallow merged
 * - event handlers (onClick, etc.): both are called
 * - other props: child value wins if defined
 */
function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...slotProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === "className") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else if (
      /^on[A-Z]/.test(key) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      // Merge event handlers - call both
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
    } else {
      merged[key] = childValue ?? slotValue;
    }
  }

  return merged;
}

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Slot renders its child directly, merging all props onto it.
 * Used to implement the `asChild` pattern for polymorphic components.
 *
 * @example
 * const Comp = asChild ? Slot : "button";
 * <Comp className="btn" onClick={...}>
 *   {asChild ? <Link to="/">Home</Link> : "Click me"}
 * </Comp>
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      console.warn("Slot requires a single valid React element as child");
      return null;
    }

    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props as Record<string, unknown>),
      ref: forwardedRef,
    } as React.Attributes);
  }
);

Slot.displayName = "Slot";

