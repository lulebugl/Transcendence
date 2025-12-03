import { FormInput } from "@/components/forms/FormInput";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { OtpCodeInput } from "@/components/forms/OtpInput";
import { OtpStatusCard } from "@/routes/settings/otp/OtpStatusCard";
import { ChangePassword } from "@/routes/settings/ChangePassword";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Section, SubSection, Variant } from "./utils";
import { GameMockCard } from "@/routes/lobby";
import { Layout } from "@/components/layout/Layout";

export const ComponentsPlayground = () => {
  const [otpValue, setOtpValue] = useState("");

  if (import.meta.env.PROD) return null;

  return (
	<Layout>
    <div className="min-h-screen flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-xl space-y-16">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold mb-2">Components</h1>
          <p className="text-muted-foreground">
            Composite components built from primitives
          </p>
        </header>

        {/* Form Components */}
        <Section title="Form Components">
          <SubSection title="FormInput">
            <Variant label="Default">
              <FormInput label="Email" placeholder="Enter your email" />
            </Variant>
            <Variant label="With Icon">
              <FormInput
                label="Email"
                icon={Mail}
                placeholder="Enter your email"
              />
            </Variant>
            <Variant label="With Description">
              <FormInput
                label="Password"
                description="Must be at least 8 characters"
                type="password"
                placeholder="Enter password"
              />
            </Variant>
            <Variant label="With Error">
              <FormInput
                label="Email"
                error="Please enter a valid email address"
                placeholder="Enter your email"
              />
            </Variant>
            <Variant label="With Success">
              <FormInput
                label="Email"
                isSuccess
                value="user@example.com"
                readOnly
              />
            </Variant>
            <Variant label="With Label Right">
              <FormInput
                label="Password"
                labelRight={
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot?
                  </a>
                }
                type="password"
                placeholder="Enter password"
              />
            </Variant>
          </SubSection>

          <SubSection title="PasswordInput">
            <Variant label="Default">
              <PasswordInput label="Password" placeholder="Enter password" />
            </Variant>
            <Variant label="With Description">
              <PasswordInput
                label="Password"
                description="Must be at least 8 characters"
                placeholder="Enter password"
              />
            </Variant>
            <Variant label="With Error">
              <PasswordInput
                label="Password"
                error="Password is too short"
                placeholder="Enter password"
              />
            </Variant>
          </SubSection>

          <SubSection title="OtpInput">
            <Variant label="Default">
              <OtpCodeInput value={otpValue} onChange={setOtpValue} />
            </Variant>
            <Variant label="With Icon">
              <OtpCodeInput value={otpValue} onChange={setOtpValue} icon />
            </Variant>
            <Variant label="Without Icon">
              <OtpCodeInput
                value={otpValue}
                onChange={setOtpValue}
                icon={false}
              />
            </Variant>
          </SubSection>
        </Section>

        {/* Feature Components */}
        <Section title="Feature Components">
          <SubSection title="OtpStatusCard">
            <Variant label="Disabled State">
              <OtpStatusCard
                isEnabled={false}
                onEnable={() => console.log("Enable OTP")}
                onDisable={() => console.log("Disable OTP")}
              />
            </Variant>
            <Variant label="Enabled State">
              <OtpStatusCard
                isEnabled={true}
                onEnable={() => console.log("Enable OTP")}
                onDisable={() => console.log("Disable OTP")}
              />
            </Variant>
            <Variant label="Loading State">
              <OtpStatusCard
                isEnabled={false}
                isLoading={true}
                onEnable={() => console.log("Enable OTP")}
                onDisable={() => console.log("Disable OTP")}
              />
            </Variant>
          </SubSection>

          <SubSection title="ChangePassword">
            <ChangePassword onCancel={() => console.log("Cancel")} />
          </SubSection>
        </Section>
		<Section title="Game Components">
			<SubSection title="GameMockCard">
				<Variant label="Default" className="w-full h-64">
					<GameMockCard selectedMode="ranked" />
				</Variant>
			</SubSection>
		</Section>
      </div>
    </div>
	</Layout>
  );
};

