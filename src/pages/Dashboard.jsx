import React from "react";
import { Card, CardBody, CardHeader, Button, Progress, Chip, Avatar } from "@heroui/react";
import { TrendingUp, Users, Smartphone, Signal, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "../lib/utils";

const data = [
  { name: 'Mon', active: 400, requests: 240 },
  { name: 'Tue', active: 300, requests: 139 },
  { name: 'Wed', active: 2000, requests: 980 },
  { name: 'Thu', active: 2780, requests: 390 },
  { name: 'Fri', active: 1890, requests: 480 },
  { name: 'Sat', active: 2390, requests: 380 },
  { name: 'Sun', active: 3490, requests: 430 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-white/40 mt-1">Real-time monitoring and analytics for your IoT network.</p>
        </div>
        <Button color="primary" variant="flat" startContent={<Activity size={18} />}>
          Run Diagnostics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Devices" 
          value="1,280" 
          change="+12.5%" 
          trend="up" 
          icon={<Smartphone className="text-blue-400" />} 
          chartColor="#3b82f6"
        />
        <StatCard 
          title="Daily Traffic" 
          value="45.2 GB" 
          change="-2.3%" 
          trend="down" 
          icon={<Signal className="text-purple-400" />} 
          chartColor="#a855f7"
        />
        <StatCard 
          title="Connected Users" 
          value="4,500" 
          change="+8.4%" 
          trend="up" 
          icon={<Users className="text-emerald-400" />} 
          chartColor="#10b981"
        />
        <StatCard 
          title="Server Uptime" 
          value="99.99%" 
          change="Stable" 
          trend="neutral" 
          icon={<TrendingUp className="text-amber-400" />} 
          chartColor="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-none bg-black/40 p-6">
          <CardHeader className="flex justify-between p-0 mb-6">
            <h3 className="text-xl font-bold text-white">Network Activity</h3>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-white/40">Active Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/30"></div>
                <span className="text-sm text-white/40">Requests</span>
              </div>
            </div>
          </CardHeader>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} 
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="requests" stroke="rgba(59, 130, 246, 0.3)" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-none bg-black/40 p-6 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Critical Notifications</h3>
          <div className="space-y-4">
             <AlertItem title="Device Overheating" description="Node-A12 in Singapore Data Center" time="2m ago" severity="error" />
             <AlertItem title="API Rate Limit" description="Approaching limit for Billing API" time="45m ago" severity="warning" />
             <AlertItem title="New Firmware" description="Version 2.4.5 ready for deployment" time="1h ago" severity="success" />
             <AlertItem title="User Action" description="Admin changed security rules" time="3h ago" severity="info" />
          </div>
          <Button className="mt-auto w-full glass border-white/10 text-white/80 hover:bg-white/5">View All Logs</Button>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, trend, icon, chartColor }) => (
  <Card className="glass border-none bg-black/40 overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
    <CardBody className="p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
          trend === "up" ? "text-emerald-400 bg-emerald-400/10" : 
          trend === "down" ? "text-rose-400 bg-rose-400/10" : 
          "text-amber-400 bg-amber-400/10"
        )}>
          {trend === "up" ? <ArrowUpRight size={14} /> : trend === "down" ? <ArrowDownRight size={14} /> : null}
          {change}
        </div>
      </div>
      <div>
        <h4 className="text-white/40 text-sm font-medium">{title}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
    </CardBody>
  </Card>
);

const AlertItem = ({ title, description, time, severity }) => {
  const colors = {
    error: "bg-rose-500/20 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/20",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/20"
  };

  return (
    <div className="flex gap-4 p-3 rounded-xl border border-white/5 bg-white/5 group hover:bg-white/10 transition-colors">
      <div className={cn("w-1.5 h-auto rounded-full", severity === "error" ? "bg-rose-500" : severity === "warning" ? "bg-amber-500" : "bg-emerald-500")}></div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-white/90">{title}</p>
          <span className="text-[10px] text-white/30">{time}</span>
        </div>
        <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{description}</p>
      </div>
    </div>
  );
};
