import { Layout } from "@/components/layout/Layout";
import { ButtonLink } from "@/components/ui/Button";

export default function DevHub() {
  return (
    <Layout>
      <div className="container pt-24 mx-auto flex flex-col items-center justify-center gap-4 max-w-2xl">
        <ButtonLink
          to="https://local.drizzle.studio"
        >
          Drizzle Studio
        </ButtonLink>
        <ButtonLink to="/dev/component-playground" >
          Component Playground
        </ButtonLink>
      </div>
    </Layout>
  );
}
