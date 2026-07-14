interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
}

function ModuleCard({ title, description, icon }: ModuleCardProps) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          <div className="module-icon mb-3">{icon}</div>
          <h2 className="h5 text-primary">{title}</h2>
          <p className="text-secondary mb-0">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ModuleCard;