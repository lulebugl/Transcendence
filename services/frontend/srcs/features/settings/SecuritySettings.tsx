import { Mail, Lock, Smartphone } from "lucide-react";
import { User as UserType } from "@/types";

export const SecuritySettings = ({ user }: { user: UserType }) => {
  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h3 className="text-lg font-bold mb-1">Account Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account access and security settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <span className="flex items-center text-xs text-emerald-500 bg-emerald-500/10 px-3 rounded-lg font-medium border border-emerald-500/20">
              Verified
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-border space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="w-fit text-left px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors flex justify-between items-center group">
              <span className="text-sm">Change Password</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-border space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Two-Factor Authentication
          </h4>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
            <div>
              <div className="font-medium text-sm">Authenticator App</div>
              <div className="text-xs text-muted-foreground mt-1">
                Use an app like Google Authenticator to protect your account.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
