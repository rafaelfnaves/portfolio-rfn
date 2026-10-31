export function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-14 text-center">
      <h2 className="text-strong text-[28px] leading-[1.2] font-medium sm:text-[32px]">
        {title}
      </h2>
      <p className="text-muted mt-3 text-sm leading-[1.43] sm:text-base">
        {intro}
      </p>
    </div>
  );
}
