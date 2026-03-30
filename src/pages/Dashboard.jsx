import React from "react";
import { Card, CardBody, CardHeader, Button, Progress, Chip, Avatar, Spinner } from "@heroui/react";
import { TrendingUp, Users, Smartphone, Signal, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "../lib/utils";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const Dashboard = () => {
  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard_sparkline'],
    queryFn: async () => {
      const res = await api.get('/dashboard/sparkline');
      return res.data;
    }
  });

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    }
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard_alerts'],
    queryFn: async () => {
      const res = await api.get('/dashboard/alerts');
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-white/40 mt-1">Real-time monitoring and analytics for your IoT network.</p>
        </div>
        <Button color="primary" variant="flat" className="w-full md:w-auto" startContent={<Activity size={18} />}>
          Run Diagnostics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading && <p className="text-white/40 text-sm">Loading stats...</p>}
        {stats.map(s => {
           let IconComponent = Smartphone;
           if (s.icon === "signal") IconComponent = Signal;
           if (s.icon === "users") IconComponent = Users;
           if (s.icon === "trendingup") IconComponent = TrendingUp;

           return (
             <StatCard 
               key={s.id}
               title={s.title} 
               value={s.value} 
               change={s.change} 
               trend={s.trend} 
               icon={<IconComponent className={`text-[${s.chartColor}]`} />} 
               chartColor={s.chartColor}
             />
           )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-none bg-black/40 p-6">
          <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-0 mb-6">
            <h3 className="text-xl font-bold text-white">Network Activity</h3>
            <div className="flex flex-wrap gap-4 items-center mt-2 sm:mt-0">
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
          <div className="w-full relative min-h-[300px]">
            {chartLoading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20 backdrop-blur-sm rounded-xl">
                  <Spinner color="primary" />
               </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
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
             {alertsLoading && <p className="text-white/40 text-sm">Loading alerts...</p>}
             {alerts.map(a => (
                <AlertItem key={a.id} title={a.title} description={a.description} time={a.time} severity={a.severity} />
             ))}
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
