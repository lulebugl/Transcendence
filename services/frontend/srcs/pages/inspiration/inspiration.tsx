import { Link } from "react-router";
import MainLayout from "../../components/old-layout";
import Sandbox from "../../components/sandbox";
import { ButtonLink } from "@/components/button";

const InspirationHome = () => {
  return (
    <MainLayout>
      <Sandbox>
        <h1 className="text-3xl font-bold">Welcome to Transcendence</h1>
        <p className="text-gray-600 mt-2">Your 3D Pong game awaits!</p>
        <a
          href="https://local.drizzle.studio"
          className="text-blue-500 hover:text-blue-700"
        >
          Drizzle Studio
        </a>
		<div className="flex flex-row gap-4 pt-8">
			<ButtonLink to="/inspiration/test-design" variant="default" size="lg">Test Design</ButtonLink>
			<ButtonLink to="/inspiration/codex-design" variant="default" size="lg">Codex Design</ButtonLink>
			<ButtonLink to="/inspiration/gemini-design" variant="default" size="lg">Gemini Design</ButtonLink>
		</div>
      </Sandbox>
    </MainLayout>	
  );
};

export default InspirationHome;
