import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, BriefcaseBusiness, Building2, Check, ChevronDown,
  CircleHelp, LayoutDashboard, LoaderCircle, MapPin, Menu, MoreHorizontal,
  Pencil, Plus, Search, ShieldCheck, Trash2, Users, X, Mail, UserRound, SlidersHorizontal
} from "lucide-react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const initialForm = { name: "", email: "", department: "Engineering", position: "", status: "Active", location: "" };
const departments = ["All departments", "Engineering", "Design", "Marketing", "Human Resources", "Finance", "Operations"];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Request failed. Please try again.");
  return body;
}
const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase() || "?";
const colors = ["violet", "blue", "mint", "orange", "pink", "cyan"];

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [menuId, setMenuId] = useState("");

  async function loadEmployees() {
    setLoading(true); setError("");
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (department !== "All departments") query.set("department", department);
      const result = await request(`/employees?${query.toString()}`);
      setEmployees(result.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadEmployees(); }, [search, department]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeCount = employees.filter(e => e.status === "Active").length;
  const departmentCount = new Set(employees.map(e => e.department)).size;
  const onLeaveCount = employees.filter(e => e.status === "On Leave").length;

  function openCreate() { setForm(initialForm); setModal({ type: "create" }); }
  function openEdit(employee) {
    setForm({ ...initialForm, ...employee, id: employee._id });
    setModal({ type: "edit", employee });
    setMenuId("");
  }
  async function saveEmployee(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal.type === "edit";
      await request(isEdit ? `/employees/${modal.employee._id}` : "/employees", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify({
          name: form.name.trim(), email: form.email.trim(),
          department: form.department, position: form.position.trim(),
          status: form.status, location: form.location.trim() || "Not specified"
        })
      });
      setModal(null); setToast(isEdit ? "Employee details updated" : "Employee added successfully");
      await loadEmployees();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }
  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.name} from the directory? This cannot be undone.`)) return;
    try {
      await request(`/employees/${employee._id}`, { method: "DELETE" });
      setToast("Employee removed from directory"); setMenuId(""); await loadEmployees();
    } catch (e) { setError(e.message); }
  }
  function exportCsv() {
    const rows = [["Name", "Email", "Department", "Position", "Status", "Location"],
      ...employees.map(e => [e.name, e.email, e.department, e.position, e.status, e.location])];
    const csv = rows.map(row => row.map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "employeehub-directory.csv"; a.click();
    URL.revokeObjectURL(url);
    setToast("Directory export downloaded");
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Users size={22}/></div><div><strong>employee<span>hub</span></strong><small>PEOPLE OPERATIONS</small></div><button className="icon-btn nav-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="nav-item active"><LayoutDashboard size={18}/> Overview</button>
      <button className="nav-item" onClick={() => document.getElementById("employee-table")?.scrollIntoView({ behavior: "smooth" })}><Users size={18}/> Employees <span className="nav-count">{employees.length}</span></button>
      <button className="nav-item" onClick={() => { setDepartment("All departments"); setSearch(""); }}><Building2 size={18}/> Departments</button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Your people directory, all in one place.</p><a href="https://react.dev/" target="_blank" rel="noreferrer">Explore React docs <span>↗</span></a></div>
        <div className="profile"><div className="profile-avatar">VS</div><div className="profile-info"><strong>Vishnu Sugesh</strong><span>Project owner</span></div><MoreHorizontal size={19} className="profile-more"/></div>
      </div>
    </aside>
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="topbar-right"><span className="secure-label"><ShieldCheck size={15}/> People workspace</span><div className="top-avatar">VS</div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><span className="live-dot"/> PEOPLE DIRECTORY</div><h1>Employee overview<span>.</span></h1><p className="subtitle">A clearer view of your team, all in one place.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={18}/> Add employee</button></section>

        <section className="stats-grid">
          <StatCard label="Total employees" value={loading ? "—" : employees.length} note="In your directory" icon={<Users size={19}/>} tone="purple" />
          <StatCard label="Active employees" value={loading ? "—" : activeCount} note="Currently active" icon={<Activity size={19}/>} tone="green" />
          <StatCard label="Departments" value={loading ? "—" : departmentCount} note="Across your team" icon={<Building2 size={19}/>} tone="blue" />
          <StatCard label="On leave" value={loading ? "—" : onLeaveCount} note="Currently away" icon={<BriefcaseBusiness size={19}/>} tone="amber" />
        </section>

        <section className="directory-panel" id="employee-table">
          <div className="panel-heading"><div><div className="section-title">Team directory <span className="count-pill">{employees.length}</span></div><p>Manage your people and their information.</p></div><button className="secondary-btn export-btn" onClick={exportCsv}><ArrowDownToLine size={16}/> Export CSV</button></div>
          <div className="toolbar"><div className="search-box"><Search size={17}/><input aria-label="Search employees" placeholder="Search name, role, email..." value={search} onChange={e => setSearch(e.target.value)}/>{search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={15}/></button>}</div><label className="filter-box"><SlidersHorizontal size={16}/><select aria-label="Filter by department" value={department} onChange={e => setDepartment(e.target.value)}>{departments.map(d => <option key={d}>{d}</option>)}</select><ChevronDown size={14}/></label></div>
          {error && <div className="error-banner" role="alert"><span>{error}</span><button onClick={() => { setError(""); loadEmployees(); }}>Try again</button></div>}
          <div className="table-wrap">
            <table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>POSITION</th><th>STATUS</th><th>LOCATION</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="6"><div className="loading-state"><LoaderCircle className="spin" size={22}/> Loading your directory...</div></td></tr>
                : employees.length === 0 ? <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Users size={25}/></div><strong>{search || department !== "All departments" ? "No matching employees" : "Your directory is ready"}</strong><p>{search || department !== "All departments" ? "Try another search or change the department filter." : "Add your first employee to get started."}</p>{!search && department === "All departments" && <button className="primary-btn small" onClick={openCreate}><Plus size={16}/> Add first employee</button>}</div></td></tr>
                : employees.map((employee, index) => <tr key={employee._id}>
                  <td><div className="person-cell"><div className={`person-avatar ${colors[index % colors.length]}`}>{initials(employee.name)}</div><div className="person-details"><strong>{employee.name}</strong><span><Mail size={12}/>{employee.email}</span></div></div></td>
                  <td><span className="department-tag">{employee.department}</span></td><td className="position-cell">{employee.position}</td>
                  <td><span className={`status ${employee.status === "Active" ? "status-active" : "status-leave"}`}><span/>{employee.status}</span></td>
                  <td className="location-cell"><MapPin size={13}/>{employee.location || "Not specified"}</td>
                  <td className="actions-cell"><div className="action-wrap"><button className="icon-btn row-menu" aria-label={`Actions for ${employee.name}`} onClick={() => setMenuId(menuId === employee._id ? "" : employee._id)}><MoreHorizontal size={19}/></button>{menuId === employee._id && <div className="action-menu"><button onClick={() => openEdit(employee)}><Pencil size={14}/> Edit details</button><button className="delete-action" onClick={() => deleteEmployee(employee)}><Trash2 size={14}/> Delete employee</button></div>}</div></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Showing <strong>{employees.length}</strong> employee{employees.length === 1 ? "" : "s"}</span><span className="footer-status"><span/> Live directory</span></div>
        </section>
        <footer className="page-footer"><span>© 2026 EmployeeHub · Built by <strong>Vishnu Sugesh</strong></span><span>Thoughtful tools for better teams <span className="footer-heart">✳</span></span></footer>
      </div>
    </main>
    {modal && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !saving) setModal(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><div className="modal-kicker">{modal.type === "edit" ? "UPDATE DIRECTORY" : "NEW TEAM MEMBER"}</div><h2 id="modal-title">{modal.type === "edit" ? "Edit employee" : "Add an employee"}</h2><p>Enter the details below to keep your directory up to date.</p></div><button className="icon-btn" onClick={() => setModal(null)} disabled={saving} aria-label="Close dialog"><X size={19}/></button></div>
      <form onSubmit={saveEmployee} className="employee-form"><label>Full name <span>*</span><div className="field-wrap"><UserRound size={16}/><input required minLength="2" maxLength="80" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Alex Morgan"/></div></label>
      <label>Work email <span>*</span><div className="field-wrap"><Mail size={16}/><input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="alex@company.com"/></div></label>
      <div className="form-two"><label>Department <span>*</span><select required value={form.department} onChange={e => setForm({...form, department:e.target.value})}>{departments.filter(d => d !== "All departments").map(d => <option key={d}>{d}</option>)}</select></label><label>Employment status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Active</option><option>On Leave</option></select></label></div>
      <label>Job title <span>*</span><div className="field-wrap"><BriefcaseBusiness size={16}/><input required maxLength="80" value={form.position} onChange={e => setForm({...form, position:e.target.value})} placeholder="e.g. Product Designer"/></div></label>
      <label>Location<div className="field-wrap"><MapPin size={16}/><input maxLength="80" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="e.g. Kochi, India"/></div></label>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(null)} disabled={saving}>Cancel</button><button type="submit" className="primary-btn" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16}/> : <Check size={16}/>} {saving ? "Saving..." : modal.type === "edit" ? "Save changes" : "Create employee"}</button></div>
      </form></section></div>}
    {toast && <div className="toast"><span><Check size={16}/></span>{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
  </div>;
}

function StatCard({ label, value, note, icon, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note"><span className="note-dot"/> {note}</div><div className={`stat-watermark ${tone}`}>{icon}</div></article>;
}

export default App;
