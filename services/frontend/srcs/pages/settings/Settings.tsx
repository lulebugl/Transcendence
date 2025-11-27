import { useState } from "react";
import { User, Shield } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { useAuth } from "@/context/auth-context";
import { ProfileSettings } from "@/features/settings/ProfileSettings";
import { SecuritySettings } from "@/features/settings/SecuritySettings";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
  const { user } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto pb-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 mt-12">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <h2 className="text-xl font-bold px-4 mb-4">Account Settings</h2>
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 mt-12">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in-up space-y-8">
            {activeTab === "profile" && <ProfileSettings user={user} />}
            {activeTab === "security" && <SecuritySettings user={user} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};
