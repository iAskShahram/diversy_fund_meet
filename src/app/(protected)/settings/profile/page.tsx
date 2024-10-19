import { Separator } from "@/components/ui/separator";
import { ProfileView } from "./_components/profile-view";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">My Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileView />
    </div>
  );
}
