import {
  Button,
  variantClasses,
  sizeClasses,
  DottedBadge,
  colorSchemes,
  type BadgeColor,
  StatusDot,
  LiveIndicator,
  Separator,
  Input,
  Label,
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui";
import { VariantMatrix } from "../components/VariantMatrix";
import { User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, SubSection, Variant } from "./utils";

export const PrimitivesPlayground = () => {
  if (import.meta.env.PROD) return null;

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">UI Primitives</h1>
        <p className="text-muted-foreground">
          Base UI components and their variants
        </p>
      </div>

      <Section title="Button" className="border-none!">
        <SubSection title="Variants & Sizes" className="border-none">
          <VariantMatrix
            component={Button}
            variants={Object.keys(variantClasses)}
            sizes={Object.keys(sizeClasses)}
            baseProps={{ children: "Button" }}
          />
        </SubSection>

        <SubSection title="States">
          <div className="flex flex-wrap gap-4">
            <Variant label="Default">
              <Button>Default</Button>
            </Variant>
            <Variant label="Loading">
              <Button loading>Loading</Button>
            </Variant>
            <Variant label="Disabled">
              <Button disabled>Disabled</Button>
            </Variant>
            <Variant label="With Icon">
              <Button>
                <User className="w-4 h-4" />
                With Icon
              </Button>
            </Variant>
          </div>
        </SubSection>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-4">
          {Object.keys(colorSchemes).map((color) => (
            <Variant key={color} label={color}>
              <DottedBadge color={color as BadgeColor}>{color}</DottedBadge>
            </Variant>
          ))}
        </div>
      </Section>

      <Section title="StatusDot">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Status Variants</h4>
            <div className="flex flex-wrap gap-4">
              {(["success", "error", "warning", "neutral"] as const).map(
                (status) => (
                  <Variant key={status} label={status}>
                    <StatusDot status={status} />
                  </Variant>
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Sizes</h4>
            <div className="flex flex-wrap gap-4 items-center">
              {(["sm", "md", "lg"] as const).map((size) => (
                <Variant key={size} label={size}>
                  <StatusDot size={size} status="success" />
                </Variant>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Effects</h4>
            <div className="flex flex-wrap gap-4">
              <Variant label="With Pulse">
                <StatusDot status="success" pulse />
              </Variant>
              <Variant label="With Glow">
                <StatusDot status="success" glow />
              </Variant>
              <Variant label="Live Indicator">
                <LiveIndicator />
              </Variant>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Input">
        <div className="space-y-4 max-w-md">
          <Variant label="Default">
            <Input placeholder="Enter text..." />
          </Variant>
          <Variant label="With Icon">
            <Input icon={Mail} placeholder="Enter email..." />
          </Variant>
          <Variant label="Disabled">
            <Input placeholder="Disabled input" disabled />
          </Variant>
          <Variant label="With Value">
            <Input value="Sample text" readOnly />
          </Variant>
        </div>
      </Section>

      <Section title="Label">
        <div className="space-y-4">
          <Variant label="Default">
            <Label>Form Label</Label>
          </Variant>
          <Variant label="With HTML For">
            <Label htmlFor="input-id">Label for Input</Label>
          </Variant>
        </div>
      </Section>

      <Section title="Field">
        <div className="space-y-4 max-w-md">
          <Variant label="Default">
            <Field>
              <FieldLabel>Field Label</FieldLabel>
              <FieldContent>
                <Input placeholder="Field content" />
              </FieldContent>
            </Field>
          </Variant>
          <Variant label="With Description">
            <Field>
              <FieldLabel>Field Label</FieldLabel>
              <FieldContent>
                <Input placeholder="Field content" />
              </FieldContent>
              <FieldDescription>This is a helpful description</FieldDescription>
            </Field>
          </Variant>
          <Variant label="With Error">
            <Field invalid>
              <FieldLabel>Field Label</FieldLabel>
              <FieldContent>
                <Input placeholder="Field content" />
              </FieldContent>
              <FieldError>This field has an error</FieldError>
            </Field>
          </Variant>
        </div>
      </Section>
    </div>
  );
};
