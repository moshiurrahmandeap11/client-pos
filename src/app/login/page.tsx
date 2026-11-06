import { LoginForm } from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Operator Sign In | Apex Retail POS",
  description: "Secure terminal operator authentication",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4 md:p-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
