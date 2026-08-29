import { NavLink, Link } from "react-router-dom";
import { ArrowLeft, LayoutGrid, CheckSquare, StickyNote, Users, Terminal } from "lucide-react";
import Badge from "../ui/Badge";

export default function ProjectTabs({ project, projectId }) {
  const tabs = [
    { label: "Overview", path: `/projects/${projectId}`, icon: LayoutGrid, end: true },
    { label: "Tasks", path: `/projects/${projectId}/tasks`, icon: CheckSquare },
    { label: "Notes", path: `/projects/${projectId}/notes`, icon: StickyNote },
    { label: "Members", path: `/projects/${projectId}/members`, icon: Users },
    { label: "Console", path: `/projects/${projectId}/console`, icon: Terminal },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Link
          to="/projects"
          className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight truncate max-w-md">
            {project?.name || "Loading..."}
          </h1>
          {project?.role && <Badge variant={project.role}>{project.role.replace("_", " ")}</Badge>}
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-slate-950 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`
            }
          >
            <tab.icon size={15} />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
