import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const NewsAndAnnouncements = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>News and Announcements</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">{/* <Overview /> */}</CardContent>
    </Card>
  );
};
