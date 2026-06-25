import { EmployeeSelect } from "@/components/EmployeeSelect";
import { Plus, Trash2, Calendar, Users, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DepartmentTab({
  title,
  departmentKey,
  data,
  onChange,
  onEmployeeClick,
}) {
  const addTeam = () => {
    const newTeam = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      lead: null,
      members: [
        { id: Math.random().toString(36).substr(2, 9), employee: null },
      ],
    };
    onChange({ ...data, teams: [...data.teams, newTeam] });
  };

  const removeTeam = (teamId) => {
    onChange({ ...data, teams: data.teams.filter((t) => t.id !== teamId) });
  };

  const updateTeam = (teamId, updates) => {
    onChange({
      ...data,
      teams: data.teams.map((t) =>
        t.id === teamId ? { ...t, ...updates } : t,
      ),
    });
  };

  const addMember = (teamId) => {
    const team = data.teams.find((t) => t.id === teamId);
    if (team) {
      updateTeam(teamId, {
        members: [
          ...team.members,
          { id: Math.random().toString(36).substr(2, 9), employee: null },
        ],
      });
    }
  };

  const removeMember = (teamId, memberId) => {
    const team = data.teams.find((t) => t.id === teamId);
    if (team) {
      updateTeam(teamId, {
        members: team.members.filter((m) => m.id !== memberId),
      });
    }
  };

  const updateMember = (teamId, memberId, employee) => {
    const team = data.teams.find((t) => t.id === teamId);
    if (team) {
      updateTeam(teamId, {
        members: team.members.map((m) =>
          m.id === memberId ? { ...m, employee } : m,
        ),
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">
          Configure the {title.toLowerCase()} department assignments and
          deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-2xl border border-border/50">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Expected Deadline
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            value={data.deadline}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase size={16} className="text-primary" />
            Reporting Manager
          </label>
          <EmployeeSelect
            value={data.reportingManager}
            onChange={(emp) => onChange({ ...data, reportingManager: emp })}
            onEmployeeClick={onEmployeeClick}
            placeholder={`Assign ${title} Manager...`}
            departmentFilter={title}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-primary" /> Teams
          </h3>
          <button
            onClick={addTeam}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all font-semibold text-sm"
          >
            <Plus size={16} /> Add Team
          </button>
        </div>

        <AnimatePresence>
          {data.teams.map((team, tIdx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border border-border rounded-2xl p-6 relative overflow-visible"
            >
              <button
                onClick={() => removeTeam(team.id)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="space-y-6">
                <div className="w-full md:w-3/4 space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Team {tIdx + 1} Name/Objective
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder={`e.g., Creating the ${title} for Log in Page`}
                    value={team.name}
                    onChange={(e) =>
                      updateTeam(team.id, { name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground text-primary">
                      Team Lead
                    </label>
                    <EmployeeSelect
                      value={team.lead}
                      onChange={(emp) => updateTeam(team.id, { lead: emp })}
                      onEmployeeClick={onEmployeeClick}
                      placeholder="Assign Team Lead..."
                      departmentFilter={title}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-foreground">
                        Members
                      </label>
                      <button
                        onClick={() => addMember(team.id)}
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus size={12} /> Add Member
                      </button>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {team.members.map((member, mIdx) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3"
                          >
                            <span className="text-sm font-bold text-muted-foreground w-6">
                              #{mIdx + 1}
                            </span>
                            <div className="flex-1">
                              <EmployeeSelect
                                value={member.employee}
                                onChange={(emp) =>
                                  updateMember(team.id, member.id, emp)
                                }
                                onEmployeeClick={onEmployeeClick}
                                placeholder="Assign Member..."
                                departmentFilter={title}
                              />
                            </div>
                            {team.members.length > 1 && (
                              <button
                                onClick={() => removeMember(team.id, member.id)}
                                className="p-2 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data.teams.length === 0 && (
          <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground">
            No teams created yet. Click "Add Team" to start organizing this
            department.
          </div>
        )}
      </div>
    </div>
  );
}
