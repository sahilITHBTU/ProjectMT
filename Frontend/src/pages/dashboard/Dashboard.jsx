import { Link } from "react-router-dom";
import {
  FolderKanban,
  ShieldCheck,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ROLES, ROLE_LABELS } from "../../constants/roles";
import { formatDate } from "../../utils/formatters";

export default function Dashboard() {
  const { projects, isLoading } = useProjects();

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban },
    {
      label: "Total Members",
      value: projects.reduce((sum, p) => sum + (p.membersCount || 0), 0),
      icon: Users,
    },
    {
      label: "You Admin",
      value: projects.filter((p) => p.role === ROLES.ADMIN).length,
      icon: ShieldCheck,
    },
  ];

  if (isLoading) return <Loader full />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of your workspace activity.
          </p>
        </div>
        <Link to="/projects">
          <Button icon={Plus}>New Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-950 text-white">
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-slate-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            Recent Projects
          </h2>
          <Link
            to="/projects"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            View all <ArrowUpRight size={13} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-14">
            <p className="text-sm text-slate-400">
              No projects yet. Create your first one to get started.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-800 truncate">
                      {project.name}
                    </h3>
                    {project.role && (
                      <Badge variant={project.role} className="shrink-0">
                        {ROLE_LABELS[project.role]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                    {project.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Users size={12} /> {project.membersCount || 0} members
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
