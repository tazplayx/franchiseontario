'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ListChecks, MessageSquare, Shield, LogOut, Building2,
  BarChart3, Users, Pencil, Trash2, X, Save, AlertTriangle, Plus,
  KeyRound, Search, Crown, Zap,
} from 'lucide-react'
import {
  getAccounts, updateAccount, resetAccountPassword, deleteAccount, registerAccount,
  type FranchisorAccount,
} from '@/lib/leads'

function AdminNav({ active }: { active: string }) {
  const router = useRouter()
  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings', href: '/admin/listings', icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'Claim Requests', href: '/admin/claims', icon: <Shield size={16} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <MessageSquare size={16} /> },
    { label: 'User Accounts', href: '/admin/users', icon: <Users size={16} /> },
    { label: 'SEO Dashboard', href: '/admin/seo', icon: <BarChart3 size={16} /> },
  ]
  const logout = () => { sessionStorage.removeItem('fo_admin'); router.push('/admin') }
  return (
    <aside className="bg-gray-900 text-white w-60 shrink-0 min-h-screen flex-col hidden md:flex">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm">🍁</div>
          <div><div className="text-sm font-bold">FranchiseOntario</div><div className="text-xs text-gray-500 mt-0.5">Admin Portal</div></div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active === item.label ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            {item.icon}{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-2 px-3">cdeneire@proton.me</div>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 w-full"><LogOut size={15} />Sign Out</button>
      </div>
    </aside>
  )
}

const TIERS = ['basic', 'premium', 'enterprise'] as const

type EditForm = {
  name: string
  email: string
  title: string
  franchiseId: string
  franchiseName: string
  tier: FranchisorAccount['tier']
}

type CreateForm = EditForm & { password: string }

export default function AdminUsersPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('fo_admin') !== 'authenticated') {
      router.replace('/admin')
    }
  }, [router])

  const [accounts, setAccounts] = useState<FranchisorAccount[]>([])
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<'all' | FranchisorAccount['tier']>('all')
  const [editing, setEditing] = useState<FranchisorAccount | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FranchisorAccount | null>(null)
  const [resetTarget, setResetTarget] = useState<FranchisorAccount | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<CreateForm>({
    name: '', email: '', title: '', franchiseId: '', franchiseName: '', tier: 'basic', password: '',
  })
  const [saved, setSaved] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const reload = () => setAccounts(getAccounts())

  useEffect(() => { reload() }, [])

  const flash = (msg: string) => {
    setSaveMsg(msg); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const filtered = accounts.filter((a) => {
    const matchesTier = tierFilter === 'all' || a.tier === tierFilter
    const q = search.toLowerCase()
    const matchesSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.franchiseName.toLowerCase().includes(q)
    return matchesTier && matchesSearch
  })

  const openEdit = (account: FranchisorAccount) => {
    setEditing(account)
    setEditForm({
      name: account.name,
      email: account.email,
      title: account.title,
      franchiseId: account.franchiseId,
      franchiseName: account.franchiseName,
      tier: account.tier,
    })
  }

  const saveEdit = () => {
    if (!editing || !editForm) return
    updateAccount(editing.id, editForm)
    reload()
    setEditing(null)
    setEditForm(null)
    flash('Account updated')
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteAccount(deleteTarget.id)
    reload()
    setDeleteTarget(null)
    flash('Account deleted')
  }

  const confirmReset = () => {
    if (!resetTarget || !newPassword.trim()) return
    resetAccountPassword(resetTarget.id, newPassword.trim())
    setResetTarget(null)
    setNewPassword('')
    flash('Password reset')
  }

  const handleCreate = () => {
    const { password, ...rest } = createForm
    if (!rest.name || !rest.email || !rest.franchiseId || !password) return
    registerAccount({ ...rest, password })
    reload()
    setCreating(false)
    setCreateForm({ name: '', email: '', title: '', franchiseId: '', franchiseName: '', tier: 'basic', password: '' })
    flash('Account created')
  }

  const tierBadge = (tier: FranchisorAccount['tier']) => {
    if (tier === 'enterprise') return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><Crown size={10} />Enterprise</span>
    if (tier === 'premium') return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full"><Zap size={10} />Premium</span>
    return <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Basic</span>
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="User Accounts" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-gray-900">User Accounts</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage franchisor accounts — edit, reset passwords, or delete.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl">
                <Save size={14} /> {saveMsg}
              </div>
            )}
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition-colors"
            >
              <Plus size={15} /> New Account
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, or franchise…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 w-72"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'enterprise', 'premium', 'basic'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${tierFilter === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {t} ({t === 'all' ? accounts.length : accounts.filter(a => a.tier === t).length})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {accounts.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm font-medium">No user accounts yet</p>
              <p className="text-gray-300 text-xs mt-1">Accounts are created when franchisors register or claim a listing.</p>
              <button onClick={() => setCreating(true)} className="mt-4 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition-colors">
                Create First Account
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Franchise</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tier</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registered</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{account.name}</div>
                        <div className="text-xs text-gray-400">{account.email}</div>
                        {account.title && <div className="text-[10px] text-gray-400 mt-0.5 italic">{account.title}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-700 font-medium">{account.franchiseName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{account.franchiseId}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">{tierBadge(account.tier)}</td>
                    <td className="px-4 py-4 text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(account.registeredAt).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setResetTarget(account); setNewPassword('') }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold rounded-lg transition-colors"
                          title="Reset password"
                        >
                          <KeyRound size={12} />
                        </button>
                        <button
                          onClick={() => openEdit(account)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(account)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {accounts.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No accounts match your search</div>
          )}
        </div>

        {/* ── Edit Modal ── */}
        {editing && editForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900">Edit Account — {editing.name}</h3>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title / Role</label>
                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="e.g. Franchise Owner"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Name</label>
                    <input value={editForm.franchiseName} onChange={(e) => setEditForm({ ...editForm, franchiseName: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise ID</label>
                    <input value={editForm.franchiseId} onChange={(e) => setEditForm({ ...editForm, franchiseId: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Tier</label>
                  <select value={editForm.tier} onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as FranchisorAccount['tier'] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
                    {TIERS.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 flex items-center justify-center gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Reset Password Modal ── */}
        {resetTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setResetTarget(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-2xl mx-auto mb-4">
                <KeyRound size={22} className="text-amber-600" />
              </div>
              <h3 className="font-black text-gray-900 text-center text-lg mb-1">Reset Password</h3>
              <p className="text-sm text-gray-500 text-center mb-5">Set a new password for <span className="font-semibold text-gray-700">{resetTarget.name}</span></p>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setResetTarget(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={confirmReset} disabled={!newPassword.trim()} className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
                  <KeyRound size={14} /> Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation ── */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="font-black text-gray-900 text-center text-lg mb-1">Delete Account</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Permanently delete the account for <span className="font-semibold text-gray-700">{deleteTarget.name}</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 flex items-center justify-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Create Account Modal ── */}
        {creating && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setCreating(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900">Create Account</h3>
                <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                    <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title / Role</label>
                    <input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="e.g. Franchise Owner"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address *</label>
                  <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Name *</label>
                    <input value={createForm.franchiseName} onChange={(e) => setCreateForm({ ...createForm, franchiseName: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise ID *</label>
                    <input value={createForm.franchiseId} onChange={(e) => setCreateForm({ ...createForm, franchiseId: e.target.value })}
                      placeholder="e.g. chucks-roadhouse"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tier</label>
                    <select value={createForm.tier} onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value as FranchisorAccount['tier'] })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
                      {TIERS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Password *</label>
                    <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button onClick={() => setCreating(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                <button
                  onClick={handleCreate}
                  disabled={!createForm.name || !createForm.email || !createForm.franchiseId || !createForm.password}
                  className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
