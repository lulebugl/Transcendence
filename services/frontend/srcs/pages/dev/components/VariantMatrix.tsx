import * as React from "react";

interface VariantMatrixProps<T extends Record<string, any>> {
  component: React.ComponentType<T>;
  variants: string[];
  sizes?: string[];
  baseProps?: Omit<T, "variant" | "size">;
  variantPropName?: string;
  sizePropName?: string;
}

export function VariantMatrix<T extends Record<string, any>>({
  component: Component,
  variants,
  sizes = [],
  baseProps = {} as Omit<T, "variant" | "size">,
  variantPropName = "variant",
  sizePropName = "size",
}: VariantMatrixProps<T>) {
  const hasSizes = sizes.length > 0;

  if (!hasSizes) {
    // Simple variant list when no sizes
    return (
      <div className="flex flex-wrap gap-4">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {variant}
            </div>
            <div className="border border-dashed border-border rounded-lg p-4">
              <Component
                {...(baseProps as T)}
                {...{ [variantPropName]: variant } as Partial<T>}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid layout for variant x size combinations
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="text-xs text-muted-foreground uppercase tracking-wider p-2 text-left">
              Variant / Size
            </th>
            {sizes.map((size) => (
              <th
                key={size}
                className="text-xs text-muted-foreground uppercase tracking-wider p-2 text-center"
              >
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant}>
              <td className="text-xs text-muted-foreground uppercase tracking-wider p-2 font-medium">
                {variant}
              </td>
              {sizes.map((size) => (
                <td key={`${variant}-${size}`} className="p-2">
                  <div className="border border-dashed border-border rounded-lg p-4 flex items-center justify-center min-w-[120px]">
                    <Component
                      {...(baseProps as T)}
                      {...{
                        [variantPropName]: variant,
                        [sizePropName]: size,
                      } as Partial<T>}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

