import { Separator } from "@/components/ui/separator";
import { ChangePasswordView } from "./_components/change-password-view";

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          Secure your account by updating your password
        </p>
      </div>
      <Separator />
      <ChangePasswordView />
    </div>
  );
}
