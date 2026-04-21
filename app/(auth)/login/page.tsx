import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

const loginFields = [
  {
    id: "email",
    label: "Email Horizon",
    type: "email" as const,
    placeholder: "operator@nexus.node",
    icon: "alternate_email",
  },
  {
    id: "password",
    label: "Security Cipher",
    type: "password" as const,
    placeholder: "••••••••••••",
    icon: "lock",
  },
];

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Access Terminal"
        description="Re-establish your neural link to Serout AI."
        fields={loginFields}
        ctaLabel="Enter Terminal"
        secondaryLabel="Need a new interface? Initialize Link"
        secondaryHref="/signup"
      />
    </AuthShell>
  );
}
