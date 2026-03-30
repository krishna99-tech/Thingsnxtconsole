import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Chip, 
  Button, 
  Input,
  Progress,
  Tooltip,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Card,
  Spinner
} from "@heroui/react";
import { Smartphone, Signal, Cpu, Activity, LayoutDashboard, Database, HardDrive, RefreshCw, Radio, Send, Mail } from "lucide-react";
import { cn } from "../lib/utils.js";

// Initial devices moved to backend api.js

const statusColorMap = {
  online: "success",
  offline: "danger",
  warning: "warning"
};

export const Devices = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [broadcastType, setBroadcastType] = useState("all");

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await api.get('/devices');
      return res.data;
    }
  });

  const renderCell = (device, columnKey) => {
    const cellValue = device[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-blue-400">
               <Cpu size={18} />
             </div>
             <div>
                <p className="text-white font-medium">{device.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{device.id}</p>
             </div>
          </div>
        );
      case "status":
        return (
          <div className="flex flex-col gap-1">
             <Chip className="capitalize border-none bg-opacity-10" color={statusColorMap[device.status]} size="sm" variant="flat">
               {device.status}
             </Chip>
             <span className="text-[10px] text-white/30 pl-1">{device.lastSeen}</span>
          </div>
        );
      case "health":
        return (
          <div className="w-[120px]">
            <Progress 
                size="sm" 
                value={device.health} 
                className="max-w-md"
                color={device.health > 80 ? "success" : device.health > 50 ? "warning" : "danger"}
                classNames={{track: "bg-white/5", value: "text-white/40"}}
            />
            <span className="text-[10px] text-white/40 mt-1 block">{device.health}% Vitality</span>
          </div>
        );
      case "email":
        return (
           <span className="text-sm text-white/50">{device.email}</span>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Ping Device">
              <Button isIconOnly variant="light" size="sm" className="text-white/40 hover:text-white">
                 <Signal size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Send Message/Broadcast">
              <Button 
                isIconOnly 
                variant="light" 
                size="sm" 
                className="text-blue-400 hover:text-blue-300"
                onPress={() => {
                   setSelectedDevice(device);
                   setBroadcastType("individual");
                   onOpen();
                }}
              >
                 <Radio size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
           <h2 className="text-3xl font-bold text-white">Device Fleet</h2>
           <p className="text-white/40 mt-1">Manage physical hardware and edge gateway connectivity.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="flat" className="glass border-white/10 text-white w-full sm:w-auto" startContent={<RefreshCw size={16} />}>Scan New</Button>
           <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-auto" 
            startContent={<Send size={16} />}
            onPress={() => {
                setBroadcastType("all");
                onOpen();
            }}
          >
            Broadcast to Fleet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <MetricBox icon={<Signal size={20} />} label="Signal Stability" value="Good" color="text-emerald-400" />
         <MetricBox icon={<Database size={20} />} label="Total Storage" value="4.2 TB" color="text-purple-400" />
         <MetricBox icon={<HardDrive size={20} />} label="Pending Updates" value="3 Nodes" color="text-amber-400" />
         <MetricBox icon={<Activity size={20} />} label="Avg Response" value="142ms" color="text-blue-400" />
      </div>

      <Table 
        aria-label="Devices Table"
        classNames={{
          base: "glass border-none bg-black/40 p-4 rounded-xl",
          thead: "bg-white/5 text-white/60",
          row: "hover:bg-white/5 border-b border-white/5"
        }}
      >
        <TableHeader>
          <TableColumn key="name">NAME & ID</TableColumn>
          <TableColumn key="location">LOCATION</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
          <TableColumn key="health">SYSTEM HEALTH</TableColumn>
          <TableColumn key="email">ASSIGNED EMAIL</TableColumn>
          <TableColumn key="actions" align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={devices} isLoading={isLoading} loadingContent={<Spinner color="white" />}>
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
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Radio size={20} />
                  </div>
                  <span>{broadcastType === "all" ? "Fleet Broadcast (OTA)" : `Message to ${selectedDevice?.name}`}</span>
                </div>
              </ModalHeader>
              <ModalBody className="p-6">
                <div className="space-y-4">
                  <Select 
                    label="Command Type" 
                    placeholder="Select command or template"
                    classNames={{trigger: "bg-white/5 border border-white/10", label: "text-white/60"}}
                    defaultSelectedKeys={["firmware_update"]}
                  >
                    <SelectItem key="firmware_update" value="firmware_update">Push Firmware Update v2.4</SelectItem>
                    <SelectItem key="security_wipe" value="security_wipe">Trigger Security Wipe</SelectItem>
                    <SelectItem key="reboot" value="reboot">Schedule Forced Reboot</SelectItem>
                    <SelectItem key="diagnostics" value="diagnostics">Deep Diagnostics Collection</SelectItem>
                  </Select>
                  <Input 
                    label="Message Label" 
                    placeholder="Ref. Code" 
                    defaultValue="OTA-DEPLOY-MARCH-2026"
                    classNames={{inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60"}} 
                  />
                  <Textarea 
                    label="Instructions (Raw Command)" 
                    placeholder="Enter payload data..." 
                    minRows={4}
                    defaultValue="{'action': 'update', 'target_version': '2.4.5', 'priority': 'high', 'automated': true}"
                    classNames={{inputWrapper: "bg-white/5 border border-white/10", label: "text-white/60"}} 
                  />
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-center">
                     <Signal className="text-emerald-400" size={18} />
                     <p className="text-[11px] text-emerald-400/80">Message will be deployed via MQTT broadcast channel encrypted with AES-256.</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-white/10">
                <Button variant="light" onPress={onClose} className="text-white/50 hover:text-white">Close</Button>
                <Button 
                   color="primary" 
                   onPress={() => {
                        alert("Command broadcasted to IoT fleet!");
                        onClose();
                   }}
                   className="bg-blue-600 font-semibold"
                   startContent={<Send size={18} />}
                >
                  Broadcast Command
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const MetricBox = ({ icon, label, value, color }) => (
  <Card className="glass border-none bg-black/40 p-4 border border-white/5">
    <div className="flex items-center gap-3">
       <div className="p-2 rounded-lg bg-white/5 text-white/40">
         {icon}
       </div>
       <div>
         <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
         <p className={cn("text-lg font-bold", color)}>{value}</p>
       </div>
    </div>
  </Card>
);

// Using global cn
