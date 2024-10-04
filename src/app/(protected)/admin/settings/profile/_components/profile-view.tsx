"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, FilePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProfileView = () => {
  const [form, setForm] = useState({
    name: "",
  });

  const session = useSession();

  const handleSubmit = () => {
    console.log("submit");
  };

  useEffect(() => {
    if (session.data) {
      setForm({
        name: session.data.user.name ?? "",
      });
    }

    return () => {
      setForm({
        name: "",
      });
    };
  }, [session.data]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-between">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center">
          <Button variant="outline">
            <FilePen className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Full name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="font-semibold">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="johndoe@diversyfund.com"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="affiliate_link" className="font-semibold">
          Affiliate Link
        </Label>
        <Input
          id="affiliate_link"
          name="affiliate_link"
          placeholder="https://diversyfund.com/signup?affiliate=123456"
          disabled
        />
        <div>
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={async () => {
              await navigator.clipboard.writeText(
                session.data?.user.affiliate_link ?? "",
              );
              toast.success("Link copied to clipboard");
            }}
          >
            Copy Link
            <Copy className="ml-2 h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={handleSubmit}>
          Update Profile
        </Button>
      </div>
    </div>
  );
};
