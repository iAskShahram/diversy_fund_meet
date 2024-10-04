import { redirect, RedirectType } from "next/navigation";

const Page = () => {
  redirect("/admin/settings/profile", RedirectType.replace);
};

export default Page;
