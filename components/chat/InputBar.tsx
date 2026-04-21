import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function InputBar() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/90 to-transparent px-4 pt-12 pb-8 md:left-72 sm:px-8">
      <div className="pointer-events-auto relative w-full max-w-3xl">
        <div className="pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-tertiary/10 to-secondary/20 opacity-30 blur-xl transition duration-700" />

        <div className="relative flex items-end rounded-[2rem] border border-outline-variant/20 bg-surface-variant/60 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-[32px] transition-colors focus-within:border-primary/50">
          <button
            type="button"
            className="mb-0 flex-shrink-0 rounded-full p-3 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary"
          >
            <MaterialIcon name="add_circle" className="text-[32px]" />
          </button>

          <div className="mb-1 flex min-h-[50px] flex-1 items-center px-2 py-1">
            <input
              type="text"
              placeholder="Command Serout..."
              className="h-full w-full border-none bg-transparent p-0 m-0 font-body text-[15px] text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0"
            />
          </div>

          <div className="mb-0 flex flex-shrink-0 items-center gap-1 pr-1">
            <button
              type="button"
              className="hidden rounded-full p-2.5 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-primary sm:block"
            >
              <MaterialIcon name="mic" className="text-[20px]" />
            </button>
            <button
              type="button"
              className="ml-1 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-gradient-to-tr from-primary to-primary-container text-on-primary shadow-[0_0_20px_rgba(0,238,252,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,238,252,0.5)] active:scale-95"
            >
              <MaterialIcon
                name="arrow_upward"
                className="ml-0.5 text-[22px]"
                filled
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto mt-4 max-w-md text-center text-[11px] text-on-surface-variant/50">
        Neural routing algorithms execute across live mainnets. Verify all
        transaction parameters and destination addresses prior to final
        authorization.
      </div>
    </div>
  );
}
