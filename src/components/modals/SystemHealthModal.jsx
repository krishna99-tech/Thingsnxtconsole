import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Chip, Progress, Divider, Spinner
} from "@heroui/react";
import {
  Server, Cpu, Database, Wifi, HardDrive, Activity,
  CheckCircle2, AlertTriangle, RefreshCw, Clock
} from "lucide-react";
import { motion } from "framer-motion";

// System Services moved to api.js

export const SystemHealthModal = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState({
    cpu: 0, memory: 0, disk: 0, network: 0,
  });

  const { data: liveMetrics, dataUpdatedAt } = useQuery({
    queryKey: ['system_metrics'],
    queryFn: async () => {
      const res = await api.get('/system/metrics');
      return res.data;
    },
    enabled: isOpen,
    refetchInterval: 2500, // Native React Query polling
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['system_services'],
    queryFn: async () => {
      const res = await api.get('/system/services');
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (liveMetrics) {
      setMetrics(liveMetrics);
    }
  }, [liveMetrics]);

  const colorFor = (v) => v > 80 ? "danger" : v > 60 ? "warning" : "success";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "glass bg-zinc-900/95 border border-white/10 text-white",
        header: "border-b border-white/10 p-6",
        body: "p-6",
        footer: "border-t border-white/10 p-4",
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">System Health</p>
                  <p className="text-xs text-white/40 font-normal mt-0.5">
                    Live infrastructure metrics
                  </p>
                </div>
                <Chip size="sm" color="success" variant="dot" className="ml-auto border-none text-xs">
                  All Systems Nominal
                </Chip>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              {/* Resource meters */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "CPU Usage",    value: metrics.cpu,     icon: <Cpu size={16} />,      unit: "%" },
                  { label: "Memory",       value: metrics.memory,  icon: <Database size={16} />, unit: "%" },
                  { label: "Disk I/O",     value: metrics.disk,    icon: <HardDrive size={16} />,unit: "%" },
                  { label: "Network Load", value: metrics.network, icon: <Wifi size={16} />,     unit: "%" },
                ].map((m) => (
                  <motion.div
                    key={m.label}
                    layout
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span className="text-white/40">{m.icon}</span>
                        {m.label}
                      </div>
                      <span className={`text-sm font-bold ${
                        m.value > 80 ? "text-rose-400" : m.value > 60 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {Math.round(m.value)}{m.unit}
                      </span>
                    </div>
                    <Progress
                      aria-label={m.label}
                      value={m.value}
                      color={colorFor(m.value)}
                      size="sm"
                      classNames={{ track: "bg-white/5" }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Uptime */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Uptime",         value: "99.99%",   color: "text-emerald-400" },
                  { label: "Last Incident",   value: "45d ago",  color: "text-white/80"    },
                  { label: "Active Connections", value: "1,280", color: "text-blue-400"    },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <Divider className="bg-white/5" />

              {/* Service statuses */}
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                  Service Status
                </p>
                {isLoadingServices ? <Spinner size="sm" color="white" /> : (
                   <ul className="space-y-2" role="list">
                     {services.map(s => (
                       <li
                         key={s.name}
                         className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                       >
                         <div className="flex items-center gap-3">
                           {s.status === "operational"
                             ? <CheckCircle2 size={14} className="text-emerald-400" />
                             : <AlertTriangle size={14} className="text-amber-400" />
                           }
                           <span className="text-sm text-white/80">{s.name}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-xs text-white/30 font-mono">{s.latency}</span>
                           <Chip
                             size="sm"
                             variant="flat"
                             color={s.status === "operational" ? "success" : "warning"}
                             className="border-none text-[10px] h-5 capitalize"
                           >
                             {s.status}
                           </Chip>
                         </div>
                       </li>
                     ))}
                   </ul>
                )}
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-between">
              <span className="text-[11px] text-white/20 flex items-center gap-1.5">
                <RefreshCw size={10} />
                Refreshes every 2.5s · Last: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "Loading..."}
              </span>
              <Button variant="light" onPress={close} className="text-white/50 hover:text-white">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
