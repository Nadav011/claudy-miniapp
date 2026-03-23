interface PlaceholderPageProps {
  title: string;
  icon: string;
}

export function PlaceholderPage({ title, icon }: PlaceholderPageProps) {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[60dvh]">
      <span className="text-5xl mb-4">{icon}</span>
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-tg-hint text-center">הדף הזה בפיתוח — בקרוב!</p>
    </div>
  );
}
