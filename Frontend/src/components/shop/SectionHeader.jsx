const SectionHeader = ({ eyebrow, title, description, action }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-2xl text-ink md:text-3xl">{title}</h3>
        {description && <p className="text-sm text-inkLight md:text-base">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
