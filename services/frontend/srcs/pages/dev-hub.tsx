import MainLayout from "@/components/old-layout";

export default function DevHub() {
  return (
    <MainLayout>
      <h1>Dev Hub</h1>
      <a
        href="https://local.drizzle.studio"
        className="text-blue-500 hover:text-blue-700"
      >
        Drizzle Studio
      </a>
    </MainLayout>
  );
}
