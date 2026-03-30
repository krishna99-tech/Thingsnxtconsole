import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Chip, 
  Tooltip, 
  Button, 
  Input,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Textarea,
  Select,
  Avatar,
  Divider,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  Card
} from "@heroui/react";

import { 
  Search, 
  Mail, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Edit, 
  MoreVertical,
  Radio,
  History,
  CheckCircle2,
  XCircle,
  Users as UsersIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useToast } from "../context/ToastContext";

const columns = [
  {name: "USER", uid: "name"},
  {name: "ROLE", uid: "role"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

// The initial format was migrated to the server.

const statusColorMap = {
  active: "success",
  suspended: "danger",
};

export const UsersPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    }
  });

  const addUserMutation = useMutation({
    mutationFn: (newUserData) => api.post('/users', newUserData),
    onSuccess: (response) => {
      queryClient.setQueryData(['users'], (old) => [response.data, ...old]);
      toast({ title: "User created", description: `${response.data.name} has been added.`, type: "success" });
    }
  });

  const editUserMutation = useMutation({
    mutationFn: (updatedUser) => api.put(`/users/${updatedUser.id}`, updatedUser),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(['users'], (old) => old.map(u => u.id === variables.id ? variables : u));
      toast({ title: "User updated", description: `${variables.name}'s profile has been saved.`, type: "success" });
    }
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const [broadcastType, setBroadcastType] = useState("all");
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "User", team: "", status: "active", age: "" });

  const toast = useToast();

  const openEditModal = (user) => {
    setEditForm({ ...user });
    onEditOpen();
  };

  const saveEdit = (onClose) => {
    editUserMutation.mutate(editForm);
    onClose();
  };

  const saveNewUser = (onClose) => {
    if (!newUserForm.name || !newUserForm.email) {
      toast({ title: "Validation Error", description: "Name and Email are required.", type: "error" });
      return;
    }
    const newUser = {
      ...newUserForm,
      id: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    addUserMutation.mutate(newUser);
    setNewUserForm({ name: "", email: "", role: "User", team: "", status: "active", age: "" });
    onClose();
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: user.avatar, className: "w-10 h-10 ring-2 ring-white/5"}}
            description={user.email}
            name={cellValue}
            className="text-white font-medium"
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-white/90">{cellValue}</p>
            <p className="text-bold text-xs capitalize text-white/40">{user.team}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize bg-opacity-10 border border-current" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content="Edit user">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-white/40 hover:text-white transition-colors"
                onPress={() => openEditModal(user)}
              >
                <Edit size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Broadcast Email">
              <Button 
                isIconOnly 
                variant="light" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onPress={() => {
                  setSelectedUser(user);
                  setBroadcastType("individual");
                  onOpen();
                }}
              >
                 <Send size={18} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Suspend user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Switch 
                  size="sm" 
                  isSelected={user.status === 'active'} 
                  onValueChange={(val) => {
                    editUserMutation.mutate({ ...user, status: val ? 'active' : 'suspended' });
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [users, onOpen, onEditOpen]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">User Directory</h2>
          <p className="text-white/40 mt-1">Manage infrastructure access and system roles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 px-6 w-full sm:w-auto" 
            startContent={<Plus size={18} />}
            onPress={onAddOpen}
          >
            Add New User
          </Button>
          <Button 
            variant="flat" 
            className="bg-white/5 border border-white/10 text-white/80 w-full sm:w-auto" 
            startContent={<Radio size={18} />}
            onPress={() => {
              setBroadcastType("all");
              onOpen();
            }}
          >
            Broadcast to All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserStatCard title="Active Accounts" count={users.filter(u => u.status === 'active').length} color="text-emerald-400" />
        <UserStatCard title="Suspended" count={users.filter(u => u.status === 'suspended').length} color="text-rose-400" />
        <UserStatCard title="Administrator" count={users.filter(u => u.role === 'Admin').length} color="text-blue-400" />
      </div>

      <Table 
        aria-label="User Management Table" 
        classNames={{
          base: "glass border-none bg-black/40 p-4 rounded-xl",
          table: "min-h-[400px]",
          thead: "bg-white/5 text-white/60 font-semibold",
          headerCell: "py-4",
          tbody: "divide-y divide-white/5",
          row: "hover:bg-white/5 transition-all cursor-default"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        backdrop="blur"
        classNames={{
          base: "glass bg-zinc-900/90 border border-white/10 text-white",
          header: "border-b border-white/10 p-6",
          body: "p-6",
          footer: "border-t border-white/10 p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Mail size={20} />
                  </div>
                  <span>{broadcastType === "all" ? "Email Broadcast (Global)" : `Send Email to ${selectedUser?.name}`}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select 
                    label="Choose Template" 
                    placeholder="Select a message template"
                    classNames={{trigger: "bg-white/5 border border-white/10", label: "text-white/60"}}
                    defaultSelectedKeys={["system_update"]}
                  >
                    <SelectItem key="system_update" value="system_update">System Maintenance Update</SelectItem>
                    <SelectItem key="security_alert" value="security_alert">Security Compliance Request</SelectItem>
                    <SelectItem key="feature_announcement" value="feature_announcement">New Feature Announcement</SelectItem>
                    <SelectItem key="onboarding" value="onboarding">User Onboarding Welcome</SelectItem>
                  </Select>
                  <Input 
                    label="Subject" 
                    placeholder="Email subject line" 
                    defaultValue={broadcastType === "all" ? "IMPORTANT: Infrastructure Maintenance Schedule" : "Regarding your account access"}
                    classNames={{inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60"}} 
                  />
                  <Textarea 
                    label="Message Body" 
                    placeholder="Type your message here..." 
                    minRows={6}
                    classNames={{inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60"}} 
                  />
                  <div className="flex items-center gap-2 text-xs text-white/30 p-2 bg-white/5 rounded-lg border border-white/10">
                    <AlertCircle size={14} className="text-amber-500" />
                    <span>Calculated audience: <b>{broadcastType === "all" ? users.length : 1}</b> recipients</span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="hover:bg-white/5">
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={() => {
                     alert(`Broadcasting emails successfully to ${broadcastType === "all" ? "all users" : selectedUser?.name}`);
                     onClose();
                  }}
                  className="bg-blue-600 shadow-lg shadow-blue-600/20"
                  startContent={<Send size={18} />}
                >
                  Send Emails
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ─── Edit User Modal ─── */}
      <Modal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        size="2xl"
        backdrop="blur"
        classNames={{
          base: "glass bg-zinc-900/95 border border-white/10 text-white",
          header: "border-b border-white/10 p-6",
          body: "p-6",
          footer: "border-t border-white/10 p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-4">
                  <Avatar
                    src={editForm.avatar}
                    isBordered
                    color="primary"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-lg font-bold text-white">{editForm.name}</p>
                    <p className="text-xs text-white/40 font-normal mt-0.5">{editForm.email}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={editForm.name ?? ""}
                      onValueChange={(v) => setEditForm(f => ({ ...f, name: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                    <Input
                      label="Email Address"
                      value={editForm.email ?? ""}
                      onValueChange={(v) => setEditForm(f => ({ ...f, email: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Role"
                      selectedKeys={editForm.role ? [editForm.role] : []}
                      onSelectionChange={(keys) => setEditForm(f => ({ ...f, role: [...keys][0] }))}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      <SelectItem key="Admin">Admin</SelectItem>
                      <SelectItem key="User">User</SelectItem>
                      <SelectItem key="Viewer">Viewer</SelectItem>
                    </Select>
                    <Input
                      label="Team / Department"
                      value={editForm.team ?? ""}
                      onValueChange={(v) => setEditForm(f => ({ ...f, team: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Account Status"
                      selectedKeys={editForm.status ? [editForm.status] : []}
                      onSelectionChange={(keys) => setEditForm(f => ({ ...f, status: [...keys][0] }))}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      <SelectItem key="active">Active</SelectItem>
                      <SelectItem key="suspended">Suspended</SelectItem>
                    </Select>
                    <Input
                      label="Age"
                      value={editForm.age ?? ""}
                      onValueChange={(v) => setEditForm(f => ({ ...f, age: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                  <Divider className="bg-white/5" />
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white/80">Avatar URL</p>
                      <p className="text-xs text-white/30 mt-0.5 truncate max-w-xs">{editForm.avatar}</p>
                    </div>
                    <Avatar src={editForm.avatar} size="sm" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-white/50 hover:text-white">
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
                  onPress={() => saveEdit(onClose)}
                  startContent={<CheckCircle2 size={16} />}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ─── Add User Modal ─── */}
      <Modal
        isOpen={isAddOpen}
        onOpenChange={onAddOpenChange}
        size="2xl"
        backdrop="blur"
        classNames={{
          base: "glass bg-zinc-900/95 border border-white/10 text-white",
          header: "border-b border-white/10 p-6",
          body: "p-6",
          footer: "border-t border-white/10 p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <UsersIcon size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Add New User</p>
                    <p className="text-xs text-white/40 font-normal mt-0.5">Provision a new account for the dashboard</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      value={newUserForm.name}
                      onValueChange={(v) => setNewUserForm(f => ({ ...f, name: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                    <Input
                      label="Email Address"
                      placeholder="john@example.com"
                      value={newUserForm.email}
                      onValueChange={(v) => setNewUserForm(f => ({ ...f, email: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Role"
                      selectedKeys={[newUserForm.role]}
                      onSelectionChange={(keys) => setNewUserForm(f => ({ ...f, role: [...keys][0] }))}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      <SelectItem key="Admin">Admin</SelectItem>
                      <SelectItem key="User">User</SelectItem>
                      <SelectItem key="Viewer">Viewer</SelectItem>
                    </Select>
                    <Input
                      label="Team / Department"
                      placeholder="e.g. Engineering"
                      value={newUserForm.team}
                      onValueChange={(v) => setNewUserForm(f => ({ ...f, team: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Account Status"
                      selectedKeys={[newUserForm.status]}
                      onSelectionChange={(keys) => setNewUserForm(f => ({ ...f, status: [...keys][0] }))}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      <SelectItem key="active">Active</SelectItem>
                      <SelectItem key="suspended">Suspended</SelectItem>
                    </Select>
                    <Input
                      label="Age"
                      placeholder="28"
                      value={newUserForm.age}
                      onValueChange={(v) => setNewUserForm(f => ({ ...f, age: v }))}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-white/50 hover:text-white">
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20"
                  onPress={() => saveNewUser(onClose)}
                  startContent={<CheckCircle2 size={16} />}
                >
                  Create User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const UserStatCard = ({ title, count, color }) => (
  <Card className="glass border-none bg-black/40 p-5 group hover:bg-white/[0.05] transition-all">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-white/40 uppercase tracking-wider">{title}</p>
        <p className={cn("text-3xl font-bold mt-1", color)}>{count}</p>
      </div>
      <div className="opacity-10 group-hover:opacity-20 transition-opacity">
        <UsersIcon size={48} className="text-white" />
      </div>
    </div>
  </Card>
);

const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
