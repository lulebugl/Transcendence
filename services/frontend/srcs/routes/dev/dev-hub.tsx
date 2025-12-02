import { Layout } from "@/components/layout/Layout";
import { ButtonLink } from "@/components/ui/Button";

export function DevHub() {
  return (
    <Layout>
      <div className="container pt-24 mx-auto flex flex-col items-center justify-center gap-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Dev Hub</h1>
        <div className="flex flex-col gap-4 w-full">
          <ButtonLink to="https://local.drizzle.studio">
            Drizzle Studio
          </ButtonLink>
          <ButtonLink to="/dev/playground/ui">
            UI Playground
          </ButtonLink>
          <ButtonLink to="/dev/playground/components">
            Components Playground
          </ButtonLink>
        </div>
      </div>
    </Layout>
  );
}
