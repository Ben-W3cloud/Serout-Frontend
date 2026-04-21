import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

const signupFields = [
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
  {
    id: "confirm-password",
    label: "Verify Cipher",
    type: "password" as const,
    placeholder: "••••••••••••",
    icon: "enhanced_encryption",
  },
];

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Initialize Link"
        description="Establish a new neural connection to Serout AI."
        fields={signupFields}
        ctaLabel="Engage Connection"
        secondaryLabel="Already interfaced? Access Terminal"
        secondaryHref="/login"
        terms
      />
    </AuthShell>
  );
}
