import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Input, 
  Progress,
  Switch,
  Select,
  SelectItem
} from "@heroui/react";
import { 
  BarChart2, 
  Activity, 
  Cpu, 
  Database, 
  Signal, 
  Globe, 
  Zap, 
  Clock, 
  Search,
  ArrowUpRight,
  TrendingDown,
  Server
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { cn } from "../lib/utils";

const barData = [
  { name: 'Jan', revenue: 4000, nodes: 2400 },
  { name: 'Feb', revenue: 3000, nodes: 1398 },
  { name: 'Mar', revenue: 2000, nodes: 9800 },
  { name: 'Apr', revenue: 2780, nodes: 3908 },
  { name: 'May', revenue: 1890, nodes: 4800 },
  { name: 'Jun', revenue: 2390, nodes: 3800 },
];

const pieData = [
  { name: 'Sensor Data', value: 400 },
  { name: 'Media Stream', value: 300 },
  { name: 'OTA Updates', value: 300 },
  { name: 'System Logs', value: 200 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export const Analytics = () => {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">System Analytics</h2>
            <p className="text-white/40 mt-1">Deep inspection of IoT network performance and trends.</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select 
              size="sm" 
              className="w-full sm:w-[150px]" 
              classNames={{trigger: "bg-white/5 border border-white/10"}}
              defaultSelectedKeys={["30days"]}
            >
               <SelectItem key="7days">Last 7 Days</SelectItem>
               <SelectItem key="30days">Last 30 Days</SelectItem>
               <SelectItem key="90days">Last Quarter</SelectItem>
            </Select>
            <Button color="primary" variant="flat" className="w-full sm:w-auto shadow-lg shadow-blue-600/20" startContent={<Search size={18} />}>Generate Report</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 glass border-none bg-black/40 p-6">
           <CardHeader className="p-0 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <h3 className="text-xl font-bold text-white">Resource Allocation</h3>
              <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-white/40 text-sm">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-white/40 text-sm">Node Count</span>
                 </div>
              </div>
           </CardHeader>
           <div className="w-full">
             <ResponsiveContainer width="100%" height={400}>
               <BarChart data={barData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                 <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                 />
                 <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                 <Bar dataKey="nodes" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="glass border-none bg-black/40 p-6 flex flex-col items-center">
           <h3 className="text-xl font-bold text-white mb-8 self-start text-left">Traffic Distribution</h3>
           <div className="w-full">
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full mt-6">
              {pieData.map((item, index) => (
                 <div key={item.name} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                       <span className="text-xs text-white/40">{item.name}</span>
                    </div>
                    <p className="text-sm font-bold text-white">{item.value} GB</p>
                 </div>
              ))}
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricItem label="Compute Latency" value="12ms" trend="-2ms" icon={<Cpu size={20} />} />
         <MetricItem label="DB Throughput" value="1.2k" trend="+15%" icon={<Database size={20} />} />
         <MetricItem label="Error Rate" value="0.02%" trend="Stable" icon={<Activity size={20} />} />
         <MetricItem label="Global Reach" value="42 Sites" trend="+1" icon={<Globe size={20} />} />
      </div>

      <Card className="glass border-none bg-black/40 p-6 overflow-hidden relative">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Server size={20} className="text-blue-400" /> System Health Over Time
             </h3>
             <Chip color="success" variant="flat" size="sm" className="bg-emerald-500/10">Active Monitoring</Chip>
          </div>
          <div className="w-full">
             <ResponsiveContainer width="100%" height={200}>
                <LineChart data={barData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                   <XAxis hide dataKey="name" />
                   <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                   />
                   <Line type="monotone" dataKey="nodes" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
             </ResponsiveContainer>
          </div>
          <div className="absolute bottom-0 right-0 p-8 opacity-10 blur-sm pointer-events-none">
             <Zap size={150} className="text-white" />
          </div>
      </Card>
    </div>
  );
};

const MetricItem = ({ label, value, trend, icon }) => (
  <div className="glass bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:bg-white/10 transition-all duration-300">
     <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <div>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2">
           <p className="text-xl font-bold text-white">{value}</p>
           <span className={cn("text-[10px] font-semibold", trend.includes('-') ? "text-emerald-400" : trend.includes('+') ? "text-emerald-400" : "text-white/20")}>
              {trend}
           </span>
        </div>
     </div>
  </div>
);

// Using global cn
