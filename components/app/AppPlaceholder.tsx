type AppPlaceholderProps = {
  description: string;
  title: string;
};

export function AppPlaceholder({ description, title }: AppPlaceholderProps) {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>
    </div>
  );
}
