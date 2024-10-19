import { redirect, RedirectType } from "next/navigation";

const Page = () => {
  redirect("/settings/profile", RedirectType.replace);
};

export default Page;
