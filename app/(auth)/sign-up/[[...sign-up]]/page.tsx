import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { withLocale } from "@/lib/locale-path";

/** Stara putanja bez locale prefiksa → default jezik. */
export default function SignUpRedirect() {
  redirect(withLocale(routing.defaultLocale, "/sign-up"));
}
