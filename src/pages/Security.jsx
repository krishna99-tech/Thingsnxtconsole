import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Badge, 
  Chip, 
  Switch, 
  Divider, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Tooltip,
  Link
} from "@heroui/react";
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Key, 
  Fingerprint, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  Plus, 
  Terminal,
  ShieldIcon,
  ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils.js";

export const Security = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Security & Governance</h2>
            <p className="text-white/40 mt-1">Manage infrastructure encryption, firewall rules, and authentication.</p>
         </div>
         <Button className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 shadow-lg shadow-rose-600/20" startContent={<ShieldAlert size={18} />}>
           Lock All Endpoints
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card className="glass border-none bg-black/40 p-6 space-y-4">
            <div className="flex justify-between items-start">
               <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Fingerprint size={24} />
               </div>
               <Badge color="success" variant="flat" size="sm">ACTIVE</Badge>
            </div>
            <div>
               <p className="text-sm font-semibold text-white/90 uppercase tracking-widest">Two-Factor Auth</p>
               <p className="text-[11px] text-white/30 mt-1 leading-relaxed">Multi-factor authentication is required for all administrative sessions across the IoT fleet.</p>
            </div>
            <Switch defaultSelected color="primary" />
         </Card>

         <Card className="glass border-none bg-black/40 p-6 space-y-4">
            <div className="flex justify-between items-start">
               <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Terminal size={24} />
               </div>
               <Badge color="warning" variant="flat" size="sm">AUDIT REQUIRED</Badge>
            </div>
            <div>
               <p className="text-sm font-semibold text-white/90 uppercase tracking-widest">SSH Session Proxy</p>
               <p className="text-[11px] text-white/30 mt-1 leading-relaxed">All outbound console connections are proxied through the secure bastion host.</p>
            </div>
            <Switch defaultSelected color="secondary" />
         </Card>

         <Card className="glass border-none bg-black/40 p-6 space-y-4">
            <div className="flex justify-between items-start">
               <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <ShieldCheck size={24} />
               </div>
               <Badge className="bg-white/5 text-white/40 border-none" size="sm">OPTIONAL</Badge>
            </div>
            <div>
               <p className="text-sm font-semibold text-white/90 uppercase tracking-widest">Deep Packet Inspection</p>
               <p className="text-[11px] text-white/30 mt-1 leading-relaxed">Analyze network traffic for potential malware injection into sensor data streams.</p>
            </div>
            <Switch color="warning" />
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="glass border-none bg-black/40 flex flex-col p-6">
            <CardHeader className="p-0 flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <Key size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Active API Keys</h3>
               </div>
               <Button size="sm" variant="flat" className="bg-blue-500/10 text-blue-400" startContent={<Plus size={16} />}>Generate New</Button>
            </CardHeader>
            <div className="space-y-4">
               {[1, 2, 3].map(id => (
                  <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white/40">
                           <Lock size={18} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white tracking-wide">PROD-READER-KEY-{id}</p>
                           <p className="text-[10px] text-white/30 truncate max-w-[150px]">**************A2B{id}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat" color="success" className="text-[10px]">Active</Chip>
                        <Button isIconOnly variant="light" size="sm" className="text-white/20 hover:text-white"><Eye size={16} /></Button>
                        <Button isIconOnly variant="light" size="sm" className="text-white/11 hover:text-rose-500 transition-colors"><Trash2 size={16} /></Button>
                     </div>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="glass border-none bg-black/40 p-6 flex flex-col">
            <CardHeader className="p-0 flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <ShieldIcon size={20} className="text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Security Firewall Rules</h3>
               </div>
               <Chip color="success" variant="flat" className="bg-emerald-500/10">Stable</Chip>
            </CardHeader>
            <div className="space-y-4">
               <FirewallRule title="Block External DB Access" port="5432" action="DENY" protocol="TCP" status="active" />
               <FirewallRule title="Allow MQTT Ingress" port="1883" action="ALLOW" protocol="TCP/UDP" status="active" />
               <FirewallRule title="Rate Limit API Endpoints" port="ANY" action="THROTTLE" protocol="HTTP" status="active" />
               <FirewallRule title="Geo-Fencing APAC" port="*" action="ALLOW" protocol="ALL" status="inactive" />
            </div>
            <Button variant="flat" className="mt-6 border border-white/10 text-white/40 hover:text-white">View Advanced Rules Editor</Button>
         </Card>
      </div>

      <Card className="glass border-none bg-black/40 p-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <AlertTriangle size={20} className="text-amber-500" /> Critical Security Events
            </h3>
            <Link color="primary" className="text-sm cursor-pointer underline-offset-4 decoration-current transition-all hover:underline">Full Audit Log</Link>
         </div>
         <div className="space-y-3">
            <EventItem severity="high" timestamp="2026-03-30 22:45:12" message="Unauthorized access attempt detected from 192.168.1.105 (Berlin Hub)" />
            <EventItem severity="medium" timestamp="2026-03-30 21:30:05" message="SSH root login enabled by user admin@iot.com" />
            <EventItem severity="low" timestamp="2026-03-30 19:12:33" message="Automatic firewall rule 'ST-923' modified by system" />
         </div>
      </Card>
    </div>
  );
};

const FirewallRule = ({ title, port, action, protocol, status }) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 group hover:bg-white/10 transition-colors">
     <div className="flex items-center gap-3">
        <div className={cn("w-1 h-8 rounded-full", action === 'DENY' ? "bg-rose-500" : action === 'ALLOW' ? "bg-emerald-500" : "bg-amber-500")}></div>
        <div>
           <p className="text-sm font-semibold text-white tracking-wide">{title}</p>
           <p className="text-[10px] text-white/40 uppercase font-mono">Port {port} | {protocol}</p>
        </div>
     </div>
     <div className="flex items-center gap-3">
        <Badge content={action} color={action === 'DENY' ? "danger" : action === 'ALLOW' ? "success" : "warning"} variant="flat" className="text-[8px]" />
        <Switch size="sm" defaultSelected={status === 'active'} />
     </div>
  </div>
);

const EventItem = ({ severity, timestamp, message }) => (
  <div className="flex gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
     <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1", 
        severity === 'high' ? "bg-rose-500/20 text-rose-400" : 
        severity === 'medium' ? "bg-amber-500/20 text-amber-400" : 
        "bg-blue-500/20 text-blue-400"
     )}>
        {severity}
     </div>
     <div className="flex-1">
        <p className="text-xs font-semibold text-white/90">{message}</p>
        <p className="text-[10px] text-white/30 mt-0.5">{timestamp}</p>
     </div>
  </div>
);

// Using global cn
