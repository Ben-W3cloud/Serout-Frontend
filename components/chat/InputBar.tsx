import type { KeyboardEvent } from "react";
import { useChat } from "@/components/chat/ChatContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function InputBar() {
  const { draft, sendMessage, setDraft } = useChat();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className= "pointer-events-none fixed right-0 bottom-0 left-0 z-30 flex flex-col items-center justify-end px-3 pt-12 pb-8 sm:px-8">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl">
        <div className="pointer-events-none absolute -inset-2 rounded-[2.5rem] " />

        <div className="relative flex items-end rounded-[2rem] border border-outline-variant/20 bg-surface-variant/60 p-2 backdrop-blur-[32px] transition-colors focus-within:border-primary/50">
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
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              className="m-0 h-full w-full border-none bg-transparent p-0 font-body text-[15px] text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0"
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
              onClick={sendMessage}
              className="ml-1 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-gradient-to-tr from-primary to-primary-container text-on-primary transition-all hover:scale-[1.02] active:scale-95"
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
        Verify all transaction parameters and destination addresses prior to final
        authorization. 
      </div>
    </div>
  );
}
//bg-gradient-to-r from-primary/20 via-tertiary/10 to-secondary/20 opacity-30 blur-xl transition duration-700