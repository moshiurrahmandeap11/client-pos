import { LoginForm } from "@/components/LoginForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/10 p-4">
      <LoginForm />
    </main>
  );
}
