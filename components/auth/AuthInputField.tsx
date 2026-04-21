import { MaterialIcon } from "@/components/ui/MaterialIcon";

type AuthInputFieldProps = {
  id: string;
  label: string;
  type: "email" | "password";
  placeholder: string;
  icon: string;
};

export function AuthInputField({
  id,
  label,
  type,
  placeholder,
  icon,
}: AuthInputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-label text-sm font-medium text-on-surface-variant"
      >
        {label}
      </label>
      <div className="group relative rounded-lg border border-outline-variant/15 bg-surface-container-highest transition-all duration-300 focus-within:border-transparent focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_10px_rgba(143,245,255,0.3)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MaterialIcon name={icon} className="text-[20px] text-on-surface-variant" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className="block w-full border-none bg-transparent py-3 pr-3 pl-10 font-body text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 sm:text-sm"
        />
      </div>
    </div>
  );
}
