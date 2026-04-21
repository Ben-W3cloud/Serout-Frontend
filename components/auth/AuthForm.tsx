import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInputField } from "@/components/auth/AuthInputField";

type AuthField = {
  id: string;
  label: string;
  type: "email" | "password";
  placeholder: string;
  icon: string;
};

type AuthFormProps = {
  title: string;
  description: string;
  fields: AuthField[];
  ctaLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  terms?: boolean;
};

export function AuthForm({
  title,
  description,
  fields,
  ctaLabel,
  secondaryLabel,
  secondaryHref,
  terms = false,
}: AuthFormProps) {
  return (
    <AuthCard title={title} description={description}>
      <form className="space-y-6">
        {fields.map((field) => (
          <AuthInputField key={field.id} {...field} />
        ))}

        {terms ? (
          <div className="mt-4 flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary focus:ring-offset-background"
            />
            <label
              htmlFor="terms"
              className="ml-2 block font-body text-xs text-on-surface-variant"
            >
              I align with the{" "}
              <Link
                href="#"
                className="text-primary transition-colors hover:text-primary-container"
              >
                Core Directives
              </Link>{" "}
              &{" "}
              <Link
                href="#"
                className="text-primary transition-colors hover:text-primary-container"
              >
                Privacy Subroutines
              </Link>
              .
            </label>
          </div>
        ) : null}

        <div className="space-y-4 pt-4">
          <button
            type="button"
            className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-primary to-primary-container px-4 py-3 font-headline text-sm font-medium text-on-primary shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(143,245,255,0.4)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            {ctaLabel}
          </button>

          <div className="text-center">
            <Link
              href={secondaryHref}
              className="font-body text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}
