import { Layout } from "@/components/layout/Layout";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalPage = ({ title, lastUpdated, children }: LegalPageProps) => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: {lastUpdated}
        </p>
        <div className="prose prose-invert max-w-none space-y-6">
          {children}
        </div>
      </div>
    </Layout>
  );
};
