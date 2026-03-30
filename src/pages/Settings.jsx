import React from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input, 
  Avatar, 
  Switch, 
  Divider, 
  Tabs, 
  Tab, 
  Select, 
  SelectItem,
  Textarea
} from "@heroui/react";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Cpu, 
  Palette, 
  Mail, 
  Smartphone, 
  Save, 
  Trash2, 
  Camera,
  ExternalLink
} from "lucide-react";

export const Settings = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['settings_profile'],
    queryFn: async () => {
      const res = await api.get('/settings/profile');
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Console Settings</h2>
            <p className="text-white/40 mt-1">Configure your personal workspace and platform preferences.</p>
         </div>
         <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-600/20" startContent={<Save size={18} />}>
           Save Changes
         </Button>
      </div>

      <Tabs 
        aria-label="Settings Categories" 
        variant="underlined"
        classNames={{
          base: "w-full",
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/5",
          cursor: "w-full bg-blue-500",
          tab: "max-w-fit px-0 h-12 text-white/50 hover:text-white",
          tabContent: "group-data-[selected=true]:text-white font-semibold"
        }}
      >
        <Tab key="profile" title="My Profile">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <Card className="lg:col-span-2 glass border-none bg-black/40 p-8 space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="relative group">
                       <Avatar 
                          src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                          className="w-24 h-24 ring-4 ring-white/5 group-hover:ring-blue-500/50 transition-all cursor-pointer" 
                       />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                          <Camera size={24} className="text-white" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold text-white">{profile?.fullName || "Loading..."}</h3>
                       <p className="text-sm text-white/40">{profile?.jobTitle || "Loading..."}</p>
                       <p className="text-xs text-blue-400">{profile?.email || "Loading..."}</p>
                    </div>
                 </div>

                 <Divider className="bg-white/5" />

                 {isLoading ? (
                    <p className="text-white/40">Loading settings...</p>
                 ) : (
                    <>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Full Name" placeholder="Your full name" defaultValue={profile?.fullName} classNames={inputStyles} />
                          <Input label="Job Title" placeholder="Your job title" defaultValue={profile?.jobTitle} classNames={inputStyles} />
                          <Input label="Email Address" placeholder="Your email" defaultValue={profile?.email} classNames={inputStyles} />
                          <Input label="Timezone" placeholder="UTC-05:00" defaultValue={profile?.timezone} classNames={inputStyles} />
                       </div>

                       <Textarea label="Professional Bio" placeholder="Tell us about yourself..." defaultValue={profile?.bio} classNames={inputStyles} minRows={3} />
                    </>
                 )}
              </Card>

              <Card className="glass border-none bg-black/40 p-8 space-y-6">
                 <h4 className="text-lg font-bold text-white">Publicity & Privacy</h4>
                 <div className="space-y-4">
                    <ToggleOption title="Public Profile" description="Allow other team members to see your bio." enabled={true} />
                    <ToggleOption title="Show Stats" description="Display your system metrics on the dashboard." enabled={true} />
                    <ToggleOption title="Online Status" description="Show when you are active on the console." enabled={false} />
                 </div>
                 <Button variant="flat" className="w-full text-rose-500 hover:bg-rose-500/10 border-rose-500/10">Delete Account</Button>
              </Card>
           </div>
        </Tab>

        <Tab key="notifications" title="Notifications">
           <Card className="glass border-none bg-black/40 p-8 mt-8 space-y-8 max-w-3xl">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Bell size={20} className="text-blue-400" />
                    <h3 className="text-xl font-bold text-white">System Alerts</h3>
                 </div>
                 <div className="space-y-4">
                    <ToggleOption title="Email Alerts" description="Receive critical system failure notifications via email." enabled={true} />
                    <ToggleOption title="Push Notifications" description="Allow browser notifications for real-time sensor triggers." enabled={true} />
                    <ToggleOption title="SMS Alerts" description="Get urgent security breach notifications on your phone." enabled={false} />
                    <ToggleOption title="Weekly Reports" description="Auto-generate and email the system performance report." enabled={true} />
                 </div>
              </div>

              <Divider className="bg-white/5" />

              <div className="space-y-4">
                 <Select label="Alert Sensitivity" defaultSelectedKeys={["medium"]} classNames={selectStyles}>
                    <SelectItem key="high">High (Notify on every minor event)</SelectItem>
                    <SelectItem key="medium">Medium (Notify on significant changes)</SelectItem>
                    <SelectItem key="low">Low (Notify only on critical failures)</SelectItem>
                 </Select>
                 <Input label="Phone Number" placeholder="+1 (555) 000-0000" defaultValue="+91 9876543210" classNames={inputStyles} />
              </div>
           </Card>
        </Tab>

        <Tab key="integrations" title="Integrations">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <IntegrationCard name="Slack" icon="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" connected={true} description="Send alerts to your team channels." />
              <IntegrationCard name="Discord" icon="https://upload.wikimedia.org/wikipedia/commons/7/73/Discord_Color_Custom.svg" connected={true} description="Webhook integration for server logs." />
              <IntegrationCard name="GitHub" icon="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" connected={false} description="Auto-deploy firmware from repos." />
              <IntegrationCard name="PagerDuty" icon="https://upload.wikimedia.org/wikipedia/commons/d/df/PagerDuty_Logo.svg" connected={false} description="Advanced incident response management." />
              <IntegrationCard name="Grafana" icon="https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg?20230531102947" connected={true} description="External dashboard data streaming." />
           </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const inputStyles = {
  inputWrapper: "bg-white/5 border border-white/10 group-data-[focus=true]:bg-white/10 text-white/50",
  label: "text-white/60",
  input: "text-white/90"
};

const selectStyles = {
  trigger: "bg-white/5 border border-white/10",
  value: "text-white/90",
  label: "text-white/60"
};

const ToggleOption = ({ title, description, enabled }) => (
  <div className="flex items-center justify-between">
     <div className="space-y-1">
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="text-xs text-white/40">{description}</p>
     </div>
     <Switch defaultSelected={enabled} size="sm" color="primary" />
  </div>
);

const IntegrationCard = ({ name, icon, connected, description }) => (
  <Card className="glass border-none bg-black/40 p-6 flex flex-col items-center text-center gap-4 group hover:bg-white/[0.05] transition-all">
     <div className="w-16 h-16 rounded-2xl bg-white/5 p-3 flex items-center justify-center">
        <img src={icon} alt={name} className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" />
     </div>
     <div>
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <p className="text-xs text-white/40 mt-1 leading-relaxed md:h-12 flex items-center justify-center">{description}</p>
     </div>
     <div className="flex w-full gap-2 mt-2">
        {connected ? (
           <Button className="flex-1 bg-white/5 border border-white/10 text-white/60 hover:text-white" size="sm">Manage</Button>
        ) : (
           <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" size="sm">Connect</Button>
        )}
        <Button isIconOnly variant="light" size="sm" className="text-white/20 hover:text-white"><ExternalLink size={16} /></Button>
     </div>
  </Card>
);
