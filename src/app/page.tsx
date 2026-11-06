import { LoginForm } from "@/components/LoginForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4 md:p-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
