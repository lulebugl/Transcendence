import { Layout } from "@/components/layout/Layout";

export default function DevHub() {
  return (
    <Layout>
      <h1>Dev Hub</h1>
      <a
        href="https://local.drizzle.studio"
        className="text-blue-500 hover:text-blue-700"
      >
        Drizzle Studio
      </a>
    </Layout>
  );
}
