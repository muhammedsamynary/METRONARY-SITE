import { redirect } from "next/navigation";

/**
 * /shop route — redirects directly to the unified spatial storefront on /
 */
export default function ShopRedirectPage() {
  redirect("/");
}
