import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  LogOut,
  Search,
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  X,
  Save,
  DollarSign,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, auth, functions } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";

type MessageItem = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  status?: "unread" | "replied";
  timestamp?: any;
};

type UserItem = {
  id: string;
  fullName?: string;
  email?: string;
  balance?: number;
  createdAt?: any;
  updatedAt?: any;
};

type AdminView = "messages" | "users";

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<AdminView>("users");

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "unread" | "replied"
  >("all");
  const [isExporting, setIsExporting] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedBalance, setEditedBalance] = useState("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as MessageItem[];
      setMessages(data);
    });

    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as UserItem[];
      setUsers(data);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [user, isAdmin]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin");
  };

  const toggleStatus = async (id: string, currentStatus: string = "unread") => {
    try {
      const newStatus = currentStatus === "unread" ? "replied" : "unread";
      await updateDoc(doc(db, "messages", id), { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await deleteDoc(doc(db, "messages", id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportContacts = httpsCallable(functions, "exportContacts");
      const result = await exportContacts();
      const csvContent = result.data as string;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `contacts_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Contacts exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export contacts");
    } finally {
      setIsExporting(false);
    }
  };

  const startEditBalance = (userItem: UserItem) => {
    setEditingUserId(userItem.id);
    setEditedBalance(String(Number(userItem.balance || 0)));
  };

  const cancelEditBalance = () => {
    setEditingUserId(null);
    setEditedBalance("");
  };

  const saveBalance = async (userId: string) => {
    const value = Number(editedBalance);

    if (Number.isNaN(value) || value < 0) {
      toast.error("Enter a valid balance");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        balance: value,
        updatedAt: serverTimestamp(),
      });

      toast.success("Balance updated");
      setEditingUserId(null);
      setEditedBalance("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update balance");
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === "all" || m.status === filterStatus;
      return !!matchesSearch && matchesFilter;
    });
  }, [messages, searchTerm, filterStatus]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  const messageStats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900">RetireSafe Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView("users")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors",
              activeView === "users"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setActiveView("messages")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors",
              activeView === "messages"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            <Inbox className="w-5 h-5" />
            Messages
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeView === "users" ? "User Balances" : "Contact Inbox"}
            </h1>
            <p className="text-sm text-slate-500">
              {activeView === "users"
                ? "View users and update balances"
                : "Manage incoming contact messages"}
            </p>
          </div>

          {activeView === "messages" && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export CSV
            </button>
          )}
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeView === "messages" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-1">
                    Total Leads
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {messageStats.total}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-1">
                    Unread
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {messageStats.unread}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-1">
                    Followed Up
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {messageStats.replied}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl w-full sm:w-fit">
                    {(["all", "unread", "replied"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                          filterStatus === s
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMessages.map((msg) => (
                        <tr
                          key={msg.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">
                              {msg.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {msg.email}
                            </div>
                            <div className="text-xs text-slate-500">
                              {msg.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600 line-clamp-2 max-w-md">
                              {msg.message}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleStatus(msg.id, msg.status)}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                msg.status === "unread"
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "bg-emerald-50 text-emerald-700",
                              )}
                            >
                              {msg.status === "unread" ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {msg.status || "unread"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {msg.timestamp?.toDate
                              ? msg.timestamp.toDate().toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredMessages.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-slate-400"
                          >
                            No messages found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeView === "users" && (
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Balance</th>
                      <th className="px-6 py-4">Updated</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {u.fullName || "No name"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {u.email || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {editingUserId === u.id ? (
                            <div className="flex items-center gap-2">
                              <div className="relative w-36">
                                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editedBalance}
                                  onChange={(e) =>
                                    setEditedBalance(e.target.value)
                                  }
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="font-bold text-indigo-600">
                              ${Number(u.balance || 0).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {u.updatedAt?.toDate
                            ? u.updatedAt.toDate().toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingUserId === u.id ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => saveBalance(u.id)}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={cancelEditBalance}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditBalance(u)}
                              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
                            >
                              Edit Balance
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
