import Sandbox from "@/components/sandbox";
import MainLayout from "@/components/old-layout";
import { ButtonLink, Button } from "@/components/ui/button";
import { useState } from "react";

const TestSandbox = () => {
  return (
    <MainLayout>
      <Sandbox>
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">Sandbox</h1>
          <p className="text-gray-600 mt-2">This is a sandbox page.</p>
        </div>
			<Button
				variant="default"
				size="lg"
			>
				Button
			</Button>
			<ButtonLink
				to="/"
				variant="default"
				size="lg"
				className="absolute right-10"
			>
				ButtonLink to Home
			</ButtonLink>
      </Sandbox>
    </MainLayout>
  );
};

export default TestSandbox;
