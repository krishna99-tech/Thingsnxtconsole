import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Progress,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
} from "@heroui/react";
import {
  Send,
  Mail,
  Users,
  Smartphone,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart2,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Inbox,
  Radio,
  Star,
  Filter,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const sentBroadcasts = [
  {
    id: 1,
    subject: "IMPORTANT: Infrastructure Maintenance Schedule",
    audience: "All Users",
    audienceType: "all",
    sentAt: "Mar 30, 2026 · 10:42 AM",
    status: "delivered",
    recipients: 4500,
    opened: 3820,
    templateKey: "system_update",
  },
  {
    id: 2,
    subject: "Security Compliance Request — Action Required",
    audience: "Admins",
    audienceType: "role",
    sentAt: "Mar 29, 2026 · 2:15 PM",
    status: "delivered",
    recipients: 280,
    opened: 265,
    templateKey: "security_alert",
  },
  {
    id: 3,
    subject: "New Feature Announcement: Fleet OTA v2.4",
    audience: "All Devices",
    audienceType: "device",
    sentAt: "Mar 28, 2026 · 9:00 AM",
    status: "delivered",
    recipients: 1280,
    opened: 1100,
    templateKey: "feature_announcement",
  },
  {
    id: 4,
    subject: "User Onboarding Welcome — Singapore Hub",
    audience: "New Users",
    audienceType: "role",
    sentAt: "Mar 27, 2026 · 11:30 AM",
    status: "failed",
    recipients: 12,
    opened: 0,
    templateKey: "onboarding",
  },
  {
    id: 5,
    subject: "Monthly IoT Infra Report — March 2026",
    audience: "All Users",
    audienceType: "all",
    sentAt: "Mar 25, 2026 · 8:00 AM",
    status: "scheduled",
    recipients: 4500,
    opened: 0,
    templateKey: "system_update",
  },
];

const templates = [
  { key: "system_update", label: "System Maintenance Update", icon: <RefreshCw size={16} /> },
  { key: "security_alert", label: "Security Compliance Request", icon: <Star size={16} /> },
  { key: "feature_announcement", label: "New Feature Announcement", icon: <Radio size={16} /> },
  { key: "onboarding", label: "User Onboarding Welcome", icon: <Users size={16} /> },
];

const templateBodies = {
  system_update:
    "Dear Team,\n\nWe are scheduling critical infrastructure maintenance on our IoT fleet. Please ensure all devices are in standby mode during the maintenance window.\n\nMaintenance Window: April 2, 2026 · 02:00–04:00 UTC\n\nSystems affected:\n- Singapore Gateway Hub\n- Tokyo Primary Nodes (D003, D004)\n- Mumbai Edge Cluster\n\nPlease acknowledge this notification.\n\nBest regards,\nIOT Console Platform",
  security_alert:
    "URGENT SECURITY NOTICE\n\nA compliance review is required for your account and associated devices.\n\nAction Required: Complete MFA setup by April 5, 2026.\n\nFailure to comply will result in temporary access suspension.\n\nFor assistance, visit the Security & Governance settings page.\n\nIOT Console Security Team",
  feature_announcement:
    "We're excited to announce the release of Firmware v2.4.5 for your IoT fleet!\n\nWhat's New:\n- 40% improvement in edge processing latency\n- AES-256 encryption for all MQTT channels\n- Automatic failover for offline gateways\n- New web console for remote diagnostics\n\nThe update will be pushed automatically within 72 hours.\n\nThe IOT Console Team",
  onboarding:
    "Welcome to IOT Console!\n\nYour account has been successfully provisioned. Here's how to get started:\n\n1. Log in at console.iot-platform.com\n2. Connect your first device via the Device Fleet tab\n3. Explore the Analytics dashboard\n4. Set up alerts in Notification Settings\n\nYour support team is available 24/7.\n\nWelcome aboard,\nThe IOT Console Team",
};

const audienceOptions = [
  { key: "all_users", label: "All Users (4,500)", icon: <Users size={14} /> },
  { key: "admins", label: "Admins Only (280)", icon: <Star size={14} /> },
  { key: "all_devices", label: "All Device Agents (1,280)", icon: <Smartphone size={14} /> },
  { key: "new_users", label: "New Users (Last 30 Days)", icon: <Inbox size={14} /> },
];

const statusConfig = {
  delivered: { color: "success", icon: <CheckCircle2 size={14} />, label: "Delivered" },
  failed:    { color: "danger",  icon: <XCircle size={14} />,      label: "Failed"    },
  scheduled: { color: "warning", icon: <Clock size={14} />,         label: "Scheduled" },
};

export const Broadcasts = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("system_update");
  const [subject, setSubject] = useState("IMPORTANT: Infrastructure Maintenance Schedule");
  const [bodyText, setBodyText] = useState(templateBodies["system_update"]);
  const [sendStatus, setSendStatus] = useState(null); // null | 'sending' | 'sent'
  const [searchQuery, setSearchQuery] = useState("");

  const handleTemplateChange = (key) => {
    setSelectedTemplate(key);
    setBodyText(templateBodies[key] ?? "");
    const t = templates.find((t) => t.key === key);
    if (t) setSubject(t.label);
  };

  const handleSend = (onClose) => {
    setSendStatus("sending");
    setTimeout(() => {
      setSendStatus("sent");
      setTimeout(() => {
        setSendStatus(null);
        onClose();
      }, 1500);
    }, 1800);
  };

  const filtered = sentBroadcasts.filter((b) =>
    b.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSent = sentBroadcasts.filter((b) => b.status === "delivered").reduce((a, b) => a + b.recipients, 0);
  const totalOpened = sentBroadcasts.filter((b) => b.status === "delivered").reduce((a, b) => a + b.opened, 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Broadcast Center</h2>
          <p className="text-white/40 mt-1">Compose and manage system-wide email communications.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 shadow-lg shadow-blue-600/20"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          New Broadcast
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Broadcasts" value={sentBroadcasts.length} icon={<Mail size={20} />} color="text-blue-400" />
        <StatCard label="Delivered" value={sentBroadcasts.filter(b => b.status === "delivered").length} icon={<CheckCircle2 size={20} />} color="text-emerald-400" />
        <StatCard label="Total Recipients" value={totalSent.toLocaleString()} icon={<Users size={20} />} color="text-purple-400" />
        <StatCard label="Avg Open Rate" value={`${avgOpenRate}%`} icon={<BarChart2 size={20} />} color="text-amber-400" />
      </div>

      {/* Broadcast Log Table */}
      <Card className="glass border-none bg-black/40">
        <CardHeader className="px-6 pt-6 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Inbox size={18} className="text-blue-400" /> Sent History
          </h3>
          <Input
            size="sm"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Search size={16} className="text-white/40" />}
            classNames={{
              base: "max-w-xs",
              inputWrapper: "bg-white/5 border border-white/10 h-9",
              input: "text-white/80 text-sm",
            }}
          />
        </CardHeader>
        <CardBody className="px-6 pb-6 space-y-3">
          <AnimatePresence>
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-default"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={cn(
                    "p-2.5 rounded-lg shrink-0 mt-0.5",
                    b.audienceType === "all" ? "bg-blue-500/10 text-blue-400" :
                    b.audienceType === "device" ? "bg-purple-500/10 text-purple-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  )}>
                    {b.audienceType === "device" ? <Smartphone size={16} /> : <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">{b.subject}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                      <span className="text-[11px] text-white/30">{b.sentAt}</span>
                      <span className="text-white/10">·</span>
                      <span className="text-[11px] text-white/40">{b.audience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {b.status === "delivered" && (
                    <div className="text-right hidden md:block">
                      <p className="text-[11px] text-white/30 uppercase tracking-wider">Open Rate</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          size="sm"
                          value={Math.round((b.opened / b.recipients) * 100)}
                          color="primary"
                          classNames={{ base: "w-20", track: "bg-white/5" }}
                        />
                        <span className="text-xs text-white/60 font-semibold">
                          {Math.round((b.opened / b.recipients) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusConfig[b.status].color}
                    startContent={statusConfig[b.status].icon}
                    className="capitalize border-none"
                  >
                    {statusConfig[b.status].label}
                  </Chip>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    onPress={() => setSelectedBroadcast(b)}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/20 text-sm">No broadcasts match your search.</div>
          )}
        </CardBody>
      </Card>

      {/* Compose Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        backdrop="blur"
        scrollBehavior="inside"
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Send size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">New Broadcast</p>
                    <p className="text-xs text-white/40 font-normal mt-0.5">Compose and send a system-wide email</p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {sendStatus === "sent" ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 size={36} className="text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold text-white">Broadcast Sent!</p>
                    <p className="text-sm text-white/40">Your message is being delivered to recipients.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    <Select
                      label="Message Template"
                      selectedKeys={[selectedTemplate]}
                      onSelectionChange={(keys) => handleTemplateChange([...keys][0])}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      {templates.map((t) => (
                        <SelectItem key={t.key} startContent={t.icon}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Audience"
                      defaultSelectedKeys={["all_users"]}
                      classNames={{ trigger: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    >
                      {audienceOptions.map((a) => (
                        <SelectItem key={a.key} startContent={a.icon}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Subject Line"
                      value={subject}
                      onValueChange={setSubject}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60" }}
                    />

                    <Textarea
                      label="Message Body"
                      value={bodyText}
                      onValueChange={setBodyText}
                      minRows={10}
                      classNames={{ inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60", input: "font-mono text-sm" }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div>
                          <p className="text-sm font-medium text-white/80">Schedule Later</p>
                          <p className="text-xs text-white/30 mt-0.5">Send at a specific time</p>
                        </div>
                        <Switch size="sm" color="primary" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div>
                          <p className="text-sm font-medium text-white/80">Track Opens</p>
                          <p className="text-xs text-white/30 mt-0.5">Collect read receipts</p>
                        </div>
                        <Switch size="sm" color="primary" defaultSelected />
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>

              {sendStatus !== "sent" && (
                <ModalFooter>
                  <Button variant="light" onPress={onClose} className="text-white/50 hover:text-white">
                    Discard
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
                    startContent={sendStatus === "sending" ? null : <Send size={16} />}
                    isLoading={sendStatus === "sending"}
                    onPress={() => handleSend(onClose)}
                  >
                    {sendStatus === "sending" ? "Sending..." : "Send Broadcast"}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!selectedBroadcast}
        onOpenChange={() => setSelectedBroadcast(null)}
        size="lg"
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
                <div className="flex items-center gap-3">
                  <Eye size={18} className="text-blue-400" />
                  <span>Broadcast Preview</span>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedBroadcast && (
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-white/40 w-20 shrink-0">Subject</span>
                        <span className="text-white font-semibold">{selectedBroadcast.subject}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/40 w-20 shrink-0">Audience</span>
                        <span className="text-white/80">{selectedBroadcast.audience}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/40 w-20 shrink-0">Sent</span>
                        <span className="text-white/80">{selectedBroadcast.sentAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/40 w-20 shrink-0">Status</span>
                        <Chip size="sm" variant="flat" color={statusConfig[selectedBroadcast.status].color} className="border-none h-5">
                          {statusConfig[selectedBroadcast.status].label}
                        </Chip>
                      </div>
                    </div>
                    <Divider className="bg-white/5" />
                    {selectedBroadcast.status === "delivered" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 text-center">
                          <p className="text-2xl font-bold text-white">{selectedBroadcast.recipients.toLocaleString()}</p>
                          <p className="text-xs text-white/40 mt-1">Recipients</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
                          <p className="text-2xl font-bold text-emerald-400">
                            {Math.round((selectedBroadcast.opened / selectedBroadcast.recipients) * 100)}%
                          </p>
                          <p className="text-xs text-white/40 mt-1">Open Rate</p>
                        </div>
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Message Preview</p>
                      <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                        {templateBodies[selectedBroadcast.templateKey]}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-white/50 hover:text-white">Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="glass bg-black/40 border border-white/5 rounded-xl p-5 flex items-center gap-4 group hover:bg-white/[0.05] transition-all">
    <div className={cn("p-3 rounded-xl bg-white/5", color)}>{icon}</div>
    <div>
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
    </div>
  </div>
);
