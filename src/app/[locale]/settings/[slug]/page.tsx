import { TerminalApp } from "@/components/TerminalApp";

export default async function SettingsSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TerminalApp initialView="settings" settingsTab={slug} />;
}
