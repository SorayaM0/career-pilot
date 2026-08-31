type StatCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: string;
  tone:
    | "sage"
    | "blue"
    | "lavender"
    | "butter";
};

function StatCard({
  label,
  value,
  helper,
  icon,
  tone,
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${tone}`}>

      <div className="stat-card-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-label">
          {label}
        </span>

      </div>

      <strong>{value}</strong>

      <span className="stat-helper">
        {helper}
      </span>

    </div>
  );
}

export default StatCard;