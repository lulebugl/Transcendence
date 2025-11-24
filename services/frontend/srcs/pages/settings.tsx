import { useState } from "react";
import { User, Shield, Save } from "lucide-react";
import { Layout } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import ProfileSettings from "@/features/settings/ProfileSettings";
import SecuritySettings from "@/features/settings/SecuritySettings";
import { Button } from "@/lib/ui/button";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto pb-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 mt-12">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <h2 className="text-xl font-bold px-4 mb-4">Settings</h2>
            <nav className="space-y-1">
              {tabs.map((tab) => (
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

            {/* Save Button for all tabs */}
            {/* <div className="pt-8 mt-8 border-t border-border flex justify-end gap-3">
              <Button className="px-6 py-2 border border-destructive/60! bg-destructive/60! text-white rounded-lg text-sm hover:bg-destructive/20 transition-colors">
                Cancel
              </Button>
              <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                Save Changes
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
