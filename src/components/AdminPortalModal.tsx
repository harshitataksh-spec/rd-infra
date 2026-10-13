import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Building2,
  CalendarClock,
  MessageSquareQuote,
  Users,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
  MessageCircle,
  Star,
} from 'lucide-react';
import {
  ProjectRecord,
  ProjectCategory,
  UpcomingProjectRecord,
  TestimonialRecord,
  EnquiryRecord,
  ContactMessageRecord,
  SiteSettingsRecord,
} from '../types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectRecord[];
  upcomingProjects: UpcomingProjectRecord[];
  testimonials: TestimonialRecord[];
  settings: SiteSettingsRecord;
  onStateSynced: (updated: {
    projects?: ProjectRecord[];
    upcomingProjects?: UpcomingProjectRecord[];
    testimonials?: TestimonialRecord[];
    settings?: SiteSettingsRecord;
  }) => void;
}

type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'upcoming'
  | 'testimonials'
  | 'enquiries'
  | 'messages'
  | 'settings';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  projects,
  upcomingProjects,
  testimonials,
  settings,
  onStateSynced,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem('rd_infra_admin_token')
  );
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [allProjects, setAllProjects] = useState<ProjectRecord[]>(projects);
  const [allUpcoming, setAllUpcoming] = useState<UpcomingProjectRecord[]>(upcomingProjects);
  const [allTestimonials, setAllTestimonials] = useState<TestimonialRecord[]>(testimonials);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([]);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettingsRecord>(settings);
  const [toast, setToast] = useState<string | null>(null);

  // Editors
  const [editingProject, setEditingProject] = useState<Partial<ProjectRecord> | null>(null);
  const [highlightsText, setHighlightsText] = useState('');

  const [editingUpcoming, setEditingUpcoming] = useState<Partial<UpcomingProjectRecord> | null>(
    null
  );
  const [connHighlightsText, setConnHighlightsText] = useState('');

  const [editingTestimonial, setEditingTestimonial] =
    useState<Partial<TestimonialRecord> | null>(null);

  useEffect(() => {
    setSettingsDraft(settings);
  }, [settings]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdminData = async (activeToken: string) => {
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (!res.ok) {
        sessionStorage.removeItem('rd_infra_admin_token');
        setToken(null);
        return;
      }
      const data = await res.json();
      setAllProjects(data.projects || []);
      setAllUpcoming(data.upcomingProjects || []);
      setAllTestimonials(data.testimonials || []);
      setEnquiries(data.enquiries || []);
      setContactMessages(data.contactMessages || []);
      if (data.settings) setSettingsDraft(data.settings);

      onStateSynced({
        projects: (data.projects || []).filter((p: ProjectRecord) => p.status !== 'Draft'),
        upcomingProjects: data.upcomingProjects || [],
        testimonials: (data.testimonials || []).filter(
          (t: TestimonialRecord) => t.status === 'Active'
        ),
        settings: data.settings,
      });
    } catch {
      // ignore offline
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminData(token);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        setAuthError(data.error || 'Invalid credentials');
      } else {
        sessionStorage.setItem('rd_infra_admin_token', data.token);
        setToken(data.token);
        setPasswordInput('');
        fetchAdminData(data.token);
      }
    } catch {
      setAuthError('Server connection error');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    sessionStorage.removeItem('rd_infra_admin_token');
    setToken(null);
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;
    const isUpdate = Boolean(editingProject.id);
    const url = isUpdate ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
    const method = isUpdate ? 'PUT' : 'POST';

    const payload = {
      ...editingProject,
      highlights: highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingProject(null);
      showNotice(isUpdate ? 'Project updated successfully.' : 'Project added to rd_infra database.');
      fetchAdminData(token);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!token) return;
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showNotice('Project deleted.');
      fetchAdminData(token);
    }
  };

  // Save Upcoming Project
  const handleSaveUpcoming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingUpcoming) return;
    const isUpdate = Boolean(editingUpcoming.id);
    const url = isUpdate
      ? `/api/admin/upcoming-projects/${editingUpcoming.id}`
      : '/api/admin/upcoming-projects';
    const method = isUpdate ? 'PUT' : 'POST';

    const payload = {
      ...editingUpcoming,
      connectivity_highlights: connHighlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingUpcoming(null);
      showNotice(isUpdate ? 'Upcoming project updated.' : 'Upcoming project added.');
      fetchAdminData(token);
    }
  };

  const handleDeleteUpcoming = async (id: number) => {
    if (!token) return;
    const res = await fetch(`/api/admin/upcoming-projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showNotice('Upcoming project deleted.');
      fetchAdminData(token);
    }
  };

  // Save Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTestimonial) return;
    const isUpdate = Boolean(editingTestimonial.id);
    const url = isUpdate
      ? `/api/admin/testimonials/${editingTestimonial.id}`
      : '/api/admin/testimonials';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingTestimonial),
    });
    if (res.ok) {
      setEditingTestimonial(null);
      showNotice(isUpdate ? 'Testimonial updated.' : 'Customer testimonial added.');
      fetchAdminData(token);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!token) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showNotice('Testimonial deleted.');
      fetchAdminData(token);
    }
  };

  // Update Enquiry Status
  const handleEnquiryStatus = async (id: number, status: EnquiryRecord['status']) => {
    if (!token) return;
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showNotice(`Enquiry #${id} marked as ${status}.`);
      fetchAdminData(token);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!token) return;
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showNotice('Enquiry removed.');
      fetchAdminData(token);
    }
  };

  // Save Website Content & Contact Information
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settingsDraft),
    });
    if (res.ok) {
      showNotice('Website Content & Contact Information updated!');
      fetchAdminData(token);
    }
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      {!token ? (
        /* SECURE ADMIN LOGIN MODAL */
        <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-6 py-5 bg-[#0A4D92] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base">RD INFRA Admin Login</h3>
                <p className="text-[11px] text-blue-100">
                  Secure Backend Dashboard (`rd_infra` DB)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 cursor-pointer"
              aria-label="Close login modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Administrator Credentials:</div>
              <div>
                Username: <code className="font-mono-tabular text-[#0A4D92]">admin</code> (or{' '}
                <code className="font-mono-tabular">rdinfra.98@gmail.com</code>)
              </div>
              <div>
                Password: <code className="font-mono-tabular text-[#0A4D92]">rdinfra2026</code>{' '}
                (Verified via SHA-512 / Bcrypt Hash)
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 text-xs font-semibold">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4D92]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin');
                  setPasswordInput('rdinfra2026');
                }}
                className="px-3 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
              >
                Fill Credentials
              </button>
              <button
                type="submit"
                disabled={loggingIn}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                {loggingIn ? 'Authenticating...' : 'Login to Dashboard'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* SECURE ADMIN DASHBOARD */
        <div className="relative w-full max-w-6xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
          {/* Top Bar */}
          <div className="px-6 py-4 bg-[#0A4D92] text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
                <img
                  src="/rd-infra-logo.svg"
                  alt="RD INFRA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base">
                  RD INFRA — Backend Admin Dashboard
                </h3>
                <p className="text-xs text-blue-100">
                  Database: `rd_infra` · Password Hashed & XSS/SQLi Protected Session
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {toast && (
                <span className="px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {toast}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 cursor-pointer"
                aria-label="Close admin panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: ShieldCheck },
              { id: 'projects', label: `Projects (${allProjects.length})`, icon: Building2 },
              {
                id: 'upcoming',
                label: `Upcoming Projects (${allUpcoming.length})`,
                icon: CalendarClock,
              },
              {
                id: 'testimonials',
                label: `Testimonials (${allTestimonials.length})`,
                icon: MessageSquareQuote,
              },
              {
                id: 'enquiries',
                label: `Customer Enquiries (${enquiries.length})`,
                icon: Users,
              },
              {
                id: 'messages',
                label: `Contact Messages (${contactMessages.length})`,
                icon: Mail,
              },
              { id: 'settings', label: 'Content & Contact Info', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#0A4D92] text-[#0A4D92] bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: DASHBOARD KPIs (Exact 5 Required Metrics) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Total Projects</div>
                    <div className="font-heading font-bold text-3xl text-[#0A4D92] mt-1 tabular-nums">
                      {allProjects.length}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">In `projects` table</div>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Upcoming Projects</div>
                    <div className="font-heading font-bold text-3xl text-[#0A4D92] mt-1 tabular-nums">
                      {allUpcoming.length}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      In `upcoming_projects` table
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Total Enquiries</div>
                    <div className="font-heading font-bold text-3xl text-[#1E293B] mt-1 tabular-nums">
                      {enquiries.length}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">In `enquiries` table</div>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">New Enquiries</div>
                    <div className="font-heading font-bold text-3xl text-[#0A4D92] mt-1 tabular-nums">
                      {newEnquiriesCount}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Awaiting response</div>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Total Testimonials</div>
                    <div className="font-heading font-bold text-3xl text-[#1E293B] mt-1 tabular-nums">
                      {allTestimonials.length}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">In `testimonials` table</div>
                  </div>
                </div>

                {/* Recent Enquiries Table */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                      Latest Customer Enquiries
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-semibold text-[#0A4D92] hover:underline cursor-pointer"
                    >
                      Manage All Enquiries
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2.5 px-3">ID</th>
                          <th className="py-2.5 px-3">Name & Phone</th>
                          <th className="py-2.5 px-3">Project & Requirement</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Created At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enquiries.slice(0, 5).map((enq) => (
                          <tr key={enq.id}>
                            <td className="py-2.5 px-3 font-mono-tabular">#{enq.id}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-900">{enq.name}</div>
                              <div className="text-slate-500 font-mono-tabular">{enq.phone}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-[#0A4D92]">{enq.project}</div>
                              <div className="text-slate-500">{enq.requirement}</div>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-700">
                              {enq.status}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono-tabular">
                              {enq.created_at}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROJECTS MANAGER (`projects` table fields) */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#1E293B]">
                      Manage Projects (`projects` Table)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fields: `id`, `project_name`, `location`, `project_type`, `description`,
                      `highlights`, `image`, `status`, `created_at`
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject({
                        project_name: '',
                        location: 'NH-48 Delhi–Jaipur Highway',
                        project_type: 'Farmhouse Projects',
                        description: '',
                        image: '/src/assets/images/project_aravalli_farms_1791631645495.jpg',
                        status: 'Featured',
                      });
                      setHighlightsText(
                        'Strategic location connectivity\nThoughtfully planned layout\nContact RD INFRA for verified details'
                      );
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {editingProject && (
                  <form
                    onSubmit={handleSaveProject}
                    className="p-6 rounded-xl bg-slate-50 border border-slate-300 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h5 className="font-heading font-bold text-sm text-[#1E293B]">
                        {editingProject.id
                          ? `Edit Project #${editingProject.id}`
                          : 'Add New Project'}
                      </h5>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Project Name (`project_name`) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.project_name || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, project_name: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Location (`location`) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.location || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, location: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Project Type (`project_type`)
                        </label>
                        <select
                          value={editingProject.project_type || 'Farmhouse Projects'}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              project_type: e.target.value as ProjectCategory,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="Farmhouse Projects">Farmhouse Projects</option>
                          <option value="Land Investment Projects">Land Investment Projects</option>
                          <option value="Residential Projects">Residential Projects</option>
                          <option value="Commercial Projects">Commercial Projects</option>
                          <option value="Plotted Developments">Plotted Developments</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Status (`status`)
                        </label>
                        <select
                          value={editingProject.status || 'Featured'}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              status: e.target.value as ProjectRecord['status'],
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="Featured">Featured</option>
                          <option value="Active">Active</option>
                          <option value="Draft">Draft (Hidden)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Project Image URL (`image`)
                        </label>
                        <input
                          type="text"
                          value={editingProject.image || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, image: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Short Description (`description`)
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.description || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, description: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Key Highlights (`highlights` — one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={highlightsText}
                          onChange={(e) => setHighlightsText(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#0A4D92] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Project
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {allProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={proj.image}
                          alt={proj.project_name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs text-slate-500">
                            #{proj.id} · {proj.project_type} · {proj.status}
                          </div>
                          <div className="font-heading font-bold text-sm text-[#1E293B] truncate">
                            {proj.project_name}
                          </div>
                          <div className="text-xs text-[#0A4D92]">{proj.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(proj);
                            setHighlightsText((proj.highlights || []).join('\n'));
                          }}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: UPCOMING PROJECTS MANAGER */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#1E293B]">
                      Manage Upcoming Projects (`upcoming_projects` Table)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Corridors: NH-48 Delhi–Jaipur Highway, Sohna / Western Peripheral, Delhi–Mumbai
                      Expressway, Vrindavan
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUpcoming({
                        project_name: '',
                        location: 'NH-48 Delhi–Jaipur Highway',
                        project_category: 'Farmhouse Projects',
                        description: '',
                        badge: 'Coming Soon',
                        image: '/src/assets/images/project_aravalli_farms_1791631645495.jpg',
                        status: 'Upcoming',
                      });
                      setConnHighlightsText(
                        'Direct highway connectivity\nPlanned community infrastructure'
                      );
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Upcoming Project
                  </button>
                </div>

                {editingUpcoming && (
                  <form
                    onSubmit={handleSaveUpcoming}
                    className="p-6 rounded-xl bg-slate-50 border border-slate-300 space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUpcoming.project_name || ''}
                          onChange={(e) =>
                            setEditingUpcoming({
                              ...editingUpcoming,
                              project_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Corridor / Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUpcoming.location || ''}
                          onChange={(e) =>
                            setEditingUpcoming({ ...editingUpcoming, location: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Project Category
                        </label>
                        <select
                          value={editingUpcoming.project_category || 'Farmhouse Projects'}
                          onChange={(e) =>
                            setEditingUpcoming({
                              ...editingUpcoming,
                              project_category: e.target.value as ProjectCategory,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="Farmhouse Projects">Farmhouse Projects</option>
                          <option value="Land Investment Projects">Land Investment Projects</option>
                          <option value="Plotted Developments">Plotted Developments</option>
                          <option value="Residential Projects">Residential Projects</option>
                          <option value="Commercial Projects">Commercial Projects</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Status Label
                        </label>
                        <select
                          value={editingUpcoming.badge || 'Coming Soon'}
                          onChange={(e) =>
                            setEditingUpcoming({
                              ...editingUpcoming,
                              badge: e.target.value as 'Coming Soon' | 'Upcoming',
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingUpcoming.description || ''}
                          onChange={(e) =>
                            setEditingUpcoming({
                              ...editingUpcoming,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Connectivity Highlights (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={connHighlightsText}
                          onChange={(e) => setConnHighlightsText(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingUpcoming(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#0A4D92] text-white font-semibold cursor-pointer"
                      >
                        Save Upcoming Project
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {allUpcoming.map((up) => (
                    <div
                      key={up.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs text-[#0A4D92] font-semibold">
                          {up.badge} · {up.project_category}
                        </div>
                        <div className="font-heading font-bold text-sm text-[#1E293B]">
                          {up.project_name}
                        </div>
                        <div className="text-xs text-slate-500">{up.location}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUpcoming(up);
                            setConnHighlightsText((up.connectivity_highlights || []).join('\n'));
                          }}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUpcoming(up.id)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TESTIMONIALS MANAGER (`testimonials` table fields) */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#1E293B]">
                      Manage Customer Testimonials (`testimonials` Table)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fields: `id`, `customer_name`, `testimonial`, `rating`, `image`, `status`,
                      `created_at`
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTestimonial({
                        customer_name: '',
                        testimonial: '',
                        rating: 5,
                        image: '',
                        status: 'Active',
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Testimonial
                  </button>
                </div>

                {editingTestimonial && (
                  <form
                    onSubmit={handleSaveTestimonial}
                    className="p-6 rounded-xl bg-slate-50 border border-slate-300 space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Customer Name (`customer_name`) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.customer_name || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              customer_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Star Rating (`rating` 1–5)
                        </label>
                        <select
                          value={editingTestimonial.rating || 5}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              rating: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Status (`status`)
                        </label>
                        <select
                          value={editingTestimonial.status || 'Active'}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              status: e.target.value as 'Active' | 'Hidden',
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="Active">Active</option>
                          <option value="Hidden">Hidden</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Testimonial Quote (`testimonial`) *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingTestimonial.testimonial || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              testimonial: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#0A4D92] text-white font-semibold cursor-pointer"
                      >
                        Save Testimonial
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-sm text-[#0A4D92]">
                            {t.customer_name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {t.rating}/5 · {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">"{t.testimonial}"</p>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(t)}
                          className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER ENQUIRIES (`enquiries` table) */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-[#1E293B]">
                    Customer Enquiries (`enquiries` Table)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Fields: `id`, `name`, `phone`, `email`, `project`, `requirement`, `message`,
                    `status`, `created_at`
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Project & Requirement</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {enquiries.map((enq) => (
                        <tr key={enq.id}>
                          <td className="py-3 px-4 font-mono-tabular">#{enq.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{enq.name}</div>
                            <div className="font-mono-tabular text-slate-600">{enq.phone}</div>
                            <div className="text-slate-400">{enq.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#0A4D92]">{enq.project}</div>
                            <div className="text-slate-600">{enq.requirement}</div>
                          </td>
                          <td className="py-3 px-4 max-w-xs text-slate-600">{enq.message}</td>
                          <td className="py-3 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                handleEnquiryStatus(
                                  enq.id,
                                  e.target.value as EnquiryRecord['status']
                                )
                              }
                              className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            <a
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded bg-[#0A4D92] text-white font-medium flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: CONTACT MESSAGES (`contact_messages` table) */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-base text-[#1E293B]">
                  Contact Messages (`contact_messages` Table)
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900">
                          {msg.name} · <span className="text-[#0A4D92]">{msg.phone}</span> ·{' '}
                          {msg.email}
                        </div>
                        <div className="font-medium text-slate-700">{msg.subject}</div>
                        <p className="text-slate-600">{msg.message}</p>
                      </div>
                      <span className="text-slate-400 font-mono-tabular">{msg.created_at}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: MANAGE WEBSITE CONTENT & CONTACT INFORMATION (`site_settings` table) */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#1E293B]">
                      Manage Website Content & Contact Information
                    </h4>
                    <p className="text-slate-500">
                      Update company contact info, hero headline, map placeholder, and real estate
                      disclaimer
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#0A4D92] hover:bg-[#083D75] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settingsDraft.company_name}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, company_name: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsDraft.tagline}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, tagline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={settingsDraft.email}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.phone}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hero Main Headline
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.hero_headline}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, hero_headline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Office Map / Location Placeholder Note
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.map_placeholder_note}
                      onChange={(e) =>
                        setSettingsDraft({
                          ...settingsDraft,
                          map_placeholder_note: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Real Estate Disclaimer
                    </label>
                    <textarea
                      rows={3}
                      value={settingsDraft.disclaimer_text}
                      onChange={(e) =>
                        setSettingsDraft({ ...settingsDraft, disclaimer_text: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* MEET OUR DIRECTOR (MR. RAVINDER DESHWAL) — UNEDITED PHOTO & BIO EDITOR */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#1E293B]">
                      Meet Our Director — Mr. Ravinder Deshwal (Original Unedited Photo & Profile)
                    </h4>
                    <p className="text-slate-500">
                      Upload or link the Director’s portrait photo. The website renders the exact original image with zero cropping, filters, or AI enhancement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Director Name
                      </label>
                      <input
                        type="text"
                        value={settingsDraft.director?.name || 'Mr. Ravinder Deshwal'}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            director: {
                              ...settingsDraft.director,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Director Title & Designation
                      </label>
                      <input
                        type="text"
                        value={
                          settingsDraft.director?.title ||
                          'Founder & Director | Visionary Entrepreneur'
                        }
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            director: {
                              ...settingsDraft.director,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Upload Director Photo (Original Unedited File — No Compression or Filter Applied)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setSettingsDraft({
                                  ...settingsDraft,
                                  director: {
                                    ...settingsDraft.director,
                                    photo_url: reader.result,
                                  },
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0A4D92] file:text-white hover:file:bg-[#083D75] cursor-pointer"
                        />
                        {settingsDraft.director?.photo_url && (
                          <button
                            type="button"
                            onClick={() =>
                              setSettingsDraft({
                                ...settingsDraft,
                                director: {
                                  ...settingsDraft.director,
                                  photo_url: '',
                                },
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs cursor-pointer"
                          >
                            Clear Photo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Or Direct Image URL / Path (Rendered as-is without modification)
                      </label>
                      <input
                        type="text"
                        placeholder="/director.jpg or https://..."
                        value={settingsDraft.director?.photo_url || ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            director: {
                              ...settingsDraft.director,
                              photo_url: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        His Vision Statement
                      </label>
                      <input
                        type="text"
                        value={
                          settingsDraft.director?.vision_statement ||
                          'To redefine real estate consultancy through trust, transparency, strategic guidance, and long-term value creation.'
                        }
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            director: {
                              ...settingsDraft.director,
                              vision_statement: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
