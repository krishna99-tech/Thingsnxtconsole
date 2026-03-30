import React from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Badge, 
  Chip,
  Link, 
  Input, 
  Switch, 
  Divider,
  Progress
} from "@heroui/react";
import { 
  CreditCard, 
  ShieldCheck, 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Plus, 
  ArrowRight,
  ExternalLink,
  Lock,
  Globe
} from "lucide-react";

export const Payments = () => {
  const { data: paymentGateways = [], isLoading: isLoadingGateways } = useQuery({
    queryKey: ['payments_gateways'],
    queryFn: async () => {
      const res = await api.get('/payments/gateways');
      return res.data;
    }
  });

  const { data: balances = [], isLoading: isLoadingBalances } = useQuery({
    queryKey: ['payments_balances'],
    queryFn: async () => {
      const res = await api.get('/payments/balances');
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Financial Services</h2>
            <p className="text-white/40 mt-1">Manage payment gateways and IoT monetization.</p>
         </div>
         <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-600/20" startContent={<Plus size={18} />}>
           Withdraw Funds
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingBalances && <p className="text-white/40 text-sm">Loading balances...</p>}
        {balances.map(b => {
           let IconComponent = Wallet;
           let iconColor = "text-emerald-400";
           if (b.icon === "clock") { IconComponent = Clock; iconColor = "text-amber-400"; }
           if (b.icon === "trendingup") { IconComponent = TrendingUp; iconColor = "text-blue-400"; }

           return (
             <BalanceCard 
               key={b.id}
               title={b.title} 
               amount={b.amount} 
               trend={b.trend} 
               icon={<IconComponent className={iconColor} />} 
             />
           )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-none bg-black/40 p-6 flex flex-col gap-6">
          <CardHeader className="p-0 flex flex-col items-start gap-1">
             <h3 className="text-xl font-bold text-white">Payment Gateways</h3>
             <p className="text-sm text-white/40">Connected providers for device billing.</p>
          </CardHeader>
          <div className="space-y-4">
             {isLoadingGateways && <p className="text-white/40 text-sm">Loading gateways...</p>}
             {paymentGateways.map(gateway => (
                <GatewayItem key={gateway.id} {...gateway} />
             ))}
          </div>
          <Button variant="flat" className="mt-4 border border-white/10 text-white/60 hover:text-white transition-all">Add New Gateway</Button>
        </Card>

        <Card className="glass border-none bg-black/40 p-6 space-y-6">
          <CardHeader className="p-0 flex flex-col items-start gap-1">
             <h3 className="text-xl font-bold text-white">Advanced Security & Accessibility</h3>
             <p className="text-sm text-white/40">Rules and accessibility for payment methods.</p>
          </CardHeader>
          <div className="space-y-5">
             <SecurityOption 
               title="3D Secure V2" 
               description="Mandatory SCA check for all transactions." 
               enabled={true}
               icon={<ShieldCheck size={18} className="text-blue-400" />}
             />
             <SecurityOption 
               title="Geographic Blocking" 
               description="Restrict payments from high-risk regions." 
               enabled={true}
               icon={<Globe size={18} className="text-purple-400" />}
             />
             <SecurityOption 
               title="Subscription Retries" 
               description="Automatic retry for failed IoT recurring billing." 
               enabled={false}
               icon={<RefreshCw size={18} className="text-amber-400" />}
             />
             <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
                <Lock size={20} className="text-blue-400 shrink-0" />
                <div className="space-y-2">
                   <p className="text-sm font-semibold text-white">Compliance Status: Level 1 PCI-DSS</p>
                   <p className="text-xs text-white/40 leading-relaxed">Your account is fully compliant with the latest payment security standards as of Q1 2026.</p>
                   <Progress size="sm" value={100} color="primary" className="max-w-md" />
                </div>
             </div>
          </div>
        </Card>
      </div>

      <Card className="glass border-none bg-black/40 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
        <div className="space-y-4">
           {[1, 2, 3].map(id => (
              <div key={id} className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                       <DollarSign size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-semibold text-white">Purchase - Device Token #A231</p>
                       <p className="text-[10px] text-white/30 uppercase tracking-widest">TRX-9823412-ID</p>
                    </div>
                 </div>
                 <div className="flex gap-8 items-center">
                    <div className="text-right">
                       <p className="text-sm font-bold text-white">$45.00</p>
                       <p className="text-[10px] text-emerald-400">Success</p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-xs text-white/40">Mar 28, 2026</p>
                       <p className="text-[10px] text-white/20">14:23 UTC</p>
                    </div>
                    <Button isIconOnly variant="light" size="sm" className="text-white/30 hover:text-white">
                       <ArrowRight size={18} />
                    </Button>
                 </div>
              </div>
           ))}
        </div>
      </Card>
    </div>
  );
};

const BalanceCard = ({ title, amount, trend, icon }) => (
  <Card className="glass border-none bg-black/40 p-6 overflow-hidden relative group hover:bg-white/[0.05] transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-xl bg-white/5 text-white/60">
        {icon}
      </div>
      <Badge color="primary" variant="flat" className="px-3">LIVE</Badge>
    </div>
    <div>
      <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{amount}</h3>
      </div>
      <p className="text-xs text-white/30 mt-2 italic">{trend}</p>
    </div>
    {/* Subtle decoration */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
  </Card>
);

const GatewayItem = ({ name, status, type, logo }) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 group hover:bg-white/10 transition-colors">
     <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/5 p-2 flex items-center justify-center shrink-0">
           <img src={logo} alt={name} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
        </div>
        <div className="min-w-0">
           <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{name}</p>
           <p className="text-[10px] text-white/30 uppercase tracking-widest truncate">{type}</p>
        </div>
     </div>
     <div className="flex items-center gap-3 self-end sm:self-auto">
        <Chip 
          variant="dot" 
          color={status === "online" ? "success" : status === "warning" ? "warning" : "danger"} 
          className="text-xs"
          classNames={{base: "border-none"}}
        >
          {status}
        </Chip>
        <Button isIconOnly variant="light" size="sm" className="text-white/20 hover:text-white shrink-0">
           <ExternalLink size={14} />
        </Button>
     </div>
  </div>
);

const SecurityOption = ({ title, description, enabled, icon }) => (
  <div className="flex items-center justify-between p-3">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
           {icon}
        </div>
        <div>
           <p className="text-sm font-semibold text-white">{title}</p>
           <p className="text-[11px] text-white/30 mt-0.5">{description}</p>
        </div>
     </div>
     <Switch defaultSelected={enabled} color="primary" size="sm" />
  </div>
);

const RefreshCw = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>;
