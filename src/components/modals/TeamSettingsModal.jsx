import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Select, SelectItem, Avatar, Chip, Divider, Spinner
} from "@heroui/react";
import { Users, Plus, Trash2, Shield, Edit3, Crown, Eye } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ROLES = [
  { key: "owner",  label: "Owner",     icon: <Crown  size={12} />, color: "warning" },
  { key: "admin",  label: "Admin",     icon: <Shield size={12} />, color: "primary" },
  { key: "editor", label: "Editor",    icon: <Edit3  size={12} />, color: "secondary" },
  { key: "viewer", label: "Viewer",    icon: <Eye    size={12} />, color: "default"   },
];

// Initial members moved to api.js

let nextId = 10;

export const TeamSettingsModal = ({ isOpen, onClose }) => {
  const [members, setMembers]     = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState("viewer");
  const [inviteError, setInviteError] = useState("");
  const toast = useToast();

  const { data: teamData = [], isLoading } = useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const res = await api.get('/team');
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (teamData.length > 0 && members.length === 0) {
      setMembers(teamData);
    }
  }, [teamData, isOpen]);

  const roleFor  = (key) => ROLES.find(r => r.key === key) ?? ROLES[3];

  const invite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      setInviteError("Enter a valid email address.");
      return;
    }
    if (members.find(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      setInviteError("This email is already on the team.");
      return;
    }
    setMembers(prev => [...prev, {
      id: ++nextId,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    }]);
    setInviteEmail("");
    setInviteError("");
    toast({ title: "Invitation sent", description: `Invite sent to ${inviteEmail}`, type: "success" });
  };

  const changeRole = (id, newRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    toast({ title: "Role updated", type: "info" });
  };

  const removeMember = (id) => {
    const m = members.find(m => m.id === id);
    if (m?.role === "owner") {
      toast({ title: "Cannot remove the owner", type: "error" });
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    toast({ title: "Member removed", type: "warning" });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base:   "glass bg-zinc-900/95 border border-white/10 text-white",
        header: "border-b border-white/10 p-6",
        body:   "p-6",
        footer: "border-t border-white/10 p-4",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Team Settings</p>
                  <p className="text-xs text-white/40 font-normal mt-0.5">
                    {members.length} members · Manage access and roles
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              {/* Invite row */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <p className="text-sm font-semibold text-white/80">Invite a new member</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onValueChange={(v) => { setInviteEmail(v); setInviteError(""); }}
                    size="sm"
                    isInvalid={!!inviteError}
                    errorMessage={inviteError}
                    classNames={{
                      inputWrapper: "bg-white/5 border border-white/10",
                      input: "text-white/90 text-sm",
                    }}
                    aria-label="Invite email address"
                  />
                  <Select
                    size="sm"
                    selectedKeys={[inviteRole]}
                    onSelectionChange={(keys) => setInviteRole([...keys][0])}
                    classNames={{ trigger: "bg-white/5 border border-white/10 w-28 shrink-0" }}
                    aria-label="Select role"
                  >
                    {ROLES.filter(r => r.key !== "owner").map(r => (
                      <SelectItem key={r.key}>{r.label}</SelectItem>
                    ))}
                  </Select>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0 px-4"
                    startContent={<Plus size={14} />}
                    onPress={invite}
                    aria-label="Send invitation"
                  >
                    Invite
                  </Button>
                </div>
              </div>

              <Divider className="bg-white/5" />

              {/* Member list */}
              {isLoading ? <Spinner size="sm" color="white" /> : (
                 <ul className="space-y-2" role="list" aria-label="Team members">
                   {members.map(m => {
                  const r = roleFor(m.role);
                  return (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group"
                    >
                      <Avatar src={m.avatar} size="sm" isBordered color={r.color} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">{m.name}</p>
                        <p className="text-xs text-white/30 truncate">{m.email}</p>
                      </div>
                      <Select
                        size="sm"
                        selectedKeys={[m.role]}
                        onSelectionChange={(keys) => changeRole(m.id, [...keys][0])}
                        isDisabled={m.role === "owner"}
                        classNames={{
                          trigger: "bg-white/5 border border-white/5 h-7 min-w-[90px]",
                          value: "text-xs",
                        }}
                        aria-label={`${m.name}'s role`}
                      >
                        {ROLES.map(r => (
                          <SelectItem key={r.key}>{r.label}</SelectItem>
                        ))}
                      </Select>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={r.color}
                        startContent={<span className="ml-1">{r.icon}</span>}
                        className="border-none text-[10px] h-5 hidden sm:flex"
                      >
                        {r.label}
                      </Chip>
                      <button
                        onClick={() => removeMember(m.id)}
                        disabled={m.role === "owner"}
                        className="text-white/20 hover:text-rose-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                        aria-label={`Remove ${m.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={close} className="text-white/50 hover:text-white">
                Close
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
                onPress={() => { toast({ title: "Team settings saved", type: "success" }); close(); }}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
