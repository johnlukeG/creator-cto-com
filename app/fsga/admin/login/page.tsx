import type { Metadata } from "next";
import { Section } from "@/components/section";
import { BtnButton, Field, TextInput } from "@/components/fsga/atoms";
import { isAdminConfigured } from "../auth";
import { loginAction } from "./actions";

// Deliberately OUTSIDE the (guarded) route group/layout — this page must
// render without ever calling requireAdmin(), or logging in would redirect
// to itself.
export const metadata: Metadata = {
  title: "FSGA Admin — Log in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <Section pad="tight">
        <div className="max-w-[420px] mx-auto text-center bg-bg-card border border-line rounded-[18px] p-7">
          <h1 className="text-[18px] font-bold tracking-[-0.02em]">Admin disabled</h1>
          <p className="text-[13px] text-ink-muted mt-2.5 leading-[1.6]">
            FSGA_ADMIN_PASSWORD isn&rsquo;t set for this environment. Use Supabase Studio instead.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section pad="tight">
      <form
        action={loginAction}
        className="max-w-[360px] mx-auto flex flex-col gap-4 bg-bg-card border border-line rounded-[18px] p-7"
      >
        <h1 className="text-[18px] font-bold tracking-[-0.02em]">Admin login</h1>
        <Field label="Password">
          <TextInput type="password" name="password" autoFocus required />
        </Field>
        {error ? <p className="text-[12px] text-ink-faint">Wrong password — try again.</p> : null}
        <BtnButton type="submit">Log in</BtnButton>
      </form>
    </Section>
  );
}
