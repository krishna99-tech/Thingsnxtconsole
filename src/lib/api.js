import axios from 'axios';

const MOCK_DELAY = 600;

const mockDataStore = {
  users: [
    { id: 1, name: "Tony Reichert", role: "Admin", team: "Management", status: "active", age: "29", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", email: "tony.reichert@example.com" },
    { id: 2, name: "Zoey Lang", role: "User", team: "Development", status: "suspended", age: "25", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", email: "zoey.lang@example.com" },
    { id: 3, name: "Jane Fisher", role: "User", team: "DevOps", status: "active", age: "22", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", email: "jane.fisher@example.com" },
    { id: 4, name: "William Howard", role: "Admin", team: "Marketing", status: "active", age: "28", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", email: "william.howard@example.com" },
    { id: 5, name: "Kristen Copper", role: "User", team: "Sales", status: "suspended", age: "24", avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d", email: "kristen.copper@example.com" }
  ],
  devices: [
    { id: "D001", name: "SensorNode Alpha-12", type: "Gateway", status: "online", health: 98, lastSeen: "2m ago", email: "gateway-01@iot-node.net", location: "Singapore Hub" },
    { id: "D002", name: "Ambient Light Sensor V2", type: "Endpoint", status: "offline", health: 45, lastSeen: "4h ago", email: "sensor-02@iot-node.net", location: "Jakarta Warehouse" },
    { id: "D003", name: "HVAC Controller Pro", type: "Actuator", status: "online", health: 72, lastSeen: "15s ago", email: "hvac-pro@iot-node.net", location: "Tokyo HQ" },
    { id: "D004", name: "Security Cam AI-4K", type: "Camera", status: "online", health: 91, lastSeen: "Just now", email: "cam-ai-4k@iot-node.net", location: "Mumbai Port" },
    { id: "D005", name: "Power Meter 3-Phase", type: "Meter", status: "online", health: 84, lastSeen: "10m ago", email: "meter-3p@iot-node.net", location: "Seoul Factory" }
  ],
  analyticsBar: [
    { name: 'Jan', revenue: 4000, nodes: 2400 },
    { name: 'Feb', revenue: 3000, nodes: 1398 },
    { name: 'Mar', revenue: 2000, nodes: 9800 },
    { name: 'Apr', revenue: 2780, nodes: 3908 },
    { name: 'May', revenue: 1890, nodes: 4800 },
    { name: 'Jun', revenue: 2390, nodes: 3800 }
  ],
  analyticsPie: [
    { name: 'Sensor Data', value: 400 },
    { name: 'Media Stream', value: 300 },
    { name: 'OTA Updates', value: 300 },
    { name: 'System Logs', value: 200 }
  ],
  dashboardSparkline: [
    { name: 'Mon', active: 400, requests: 240 },
    { name: 'Tue', active: 300, requests: 139 },
    { name: 'Wed', active: 2000, requests: 980 },
    { name: 'Thu', active: 2780, requests: 390 },
    { name: 'Fri', active: 1890, requests: 480 },
    { name: 'Sat', active: 2390, requests: 380 },
    { name: 'Sun', active: 3490, requests: 430 }
  ],
  securityFirewall: [
    { id: 1, title: "Block External DB Access", port: "5432", action: "DENY", protocol: "TCP", status: "active" },
    { id: 2, title: "Allow MQTT Ingress", port: "1883", action: "ALLOW", protocol: "TCP/UDP", status: "active" },
    { id: 3, title: "Rate Limit API Endpoints", port: "ANY", action: "THROTTLE", protocol: "HTTP", status: "active" },
    { id: 4, title: "Geo-Fencing APAC", port: "*", action: "ALLOW", protocol: "ALL", status: "inactive" }
  ],
  securityEvents: [
    { id: 1, severity: "high", timestamp: "2026-03-30 22:45:12", message: "Unauthorized access attempt detected from 192.168.1.105 (Berlin Hub)" },
    { id: 2, severity: "medium", timestamp: "2026-03-30 21:30:05", message: "SSH root login enabled by user admin@iot.com" },
    { id: 3, severity: "low", timestamp: "2026-03-30 19:12:33", message: "Automatic firewall rule 'ST-923' modified by system" }
  ],
  paymentGateways: [
    { id: 1, name: "Stripe Connect", status: "online", type: "Credit / Debit", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { id: 2, name: "PayPal Braintree", status: "online", type: "Digital Wallet", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { id: 3, name: "Coinbase Commerce", status: "warning", type: "Crypto (BTC/ETH)", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Coinbase_Logo_2013.png" },
    { id: 4, name: "Apple Pay", status: "offline", type: "Mobile Wallet", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" }
  ],
  dashboardStats: [
    { id: "s1", title: "Active Devices", value: "1,280", change: "+12.5%", trend: "up", icon: "smartphone", chartColor: "#3b82f6" },
    { id: "s2", title: "Daily Traffic", value: "45.2 GB", change: "-2.3%", trend: "down", icon: "signal", chartColor: "#a855f7" },
    { id: "s3", title: "Connected Users", value: "4,500", change: "+8.4%", trend: "up", icon: "users", chartColor: "#10b981" },
    { id: "s4", title: "Server Uptime", value: "99.99%", change: "Stable", trend: "neutral", icon: "trendingup", chartColor: "#f59e0b" }
  ],
  dashboardAlerts: [
    { id: "a1", title: "Device Overheating", description: "Node-A12 in Singapore Data Center", time: "2m ago", severity: "error" },
    { id: "a2", title: "API Rate Limit", description: "Approaching limit for Billing API", time: "45m ago", severity: "warning" },
    { id: "a3", title: "New Firmware", description: "Version 2.4.5 ready for deployment", time: "1h ago", severity: "success" },
    { id: "a4", title: "User Action", description: "Admin changed security rules", time: "3h ago", severity: "info" }
  ],
  paymentsBalances: [
    { id: "p1", title: "Current Balance", amount: "$12,480.00", trend: "+12% this month", icon: "wallet" },
    { id: "p2", title: "Processing", amount: "$2,150.50", trend: "Next payout: Tomorrow", icon: "clock" },
    { id: "p3", title: "Total Revenue", amount: "$145,200.00", trend: "All time gross", icon: "trendingup" }
  ],
  settingsProfile: {
    fullName: "Alexander Pierce",
    jobTitle: "Admin Lead",
    email: "admin@iot-console.com",
    timezone: "UTC+05:30 (IST)",
    bio: "Leading the digital transformation of the IoT infrastructure with over 10 years of experience in system architecture."
  },
  helpFaqs: [
    { id: "f1", q: "How do I reset a locked gateway?", a: "Navigate to the Device Fleet page, select the specific node, and use the 'Ping Device' action followed by 'Hard Reset' if it fails to respond within 30 seconds." },
    { id: "f2", q: "What is the data retention policy?", a: "All telemetry data is stored in the hot-cache for 30 days. Afterwards, it is compressed and moved to cold storage (AWS S3) where it is retained for 7 years." },
    { id: "f3", q: "Can I add custom firewall rules?", a: "Yes, via the Security & Governance tab. Click 'View Advanced Rules Editor' to manually specify IP ranges, ports, and protocols." },
    { id: "f4", q: "How to export billing reports?", a: "Go to the Financial Services page and click 'Withdraw Funds' dropdown to find the monthly TSV/CSV export utility." }
  ],
  teamMembers: [
    { id: 1, name: "You (Admin)", email: "admin@iot.com", role: "Owner" },
    { id: 2, name: "Sarah Connor", email: "sarah@iot.com", role: "Admin" },
    { id: 3, name: "John Smith", email: "john.s@iot.com", role: "Editor" }
  ],
  notifications: [
    { id: 1, type: "error",   title: "Device Overheating",  body: "Node-A12 in Singapore Data Center",    time: "2m ago"  },
    { id: 2, type: "warning", title: "API Rate Limit",       body: "Approaching limit for Billing API",    time: "45m ago" },
    { id: 3, type: "success", title: "New Firmware Ready",   body: "Version 2.4.5 ready for deployment",  time: "1h ago"  },
    { id: 4, type: "info",    title: "User Action",          body: "Admin changed security rules",         time: "3h ago"  }
  ],
  systemServices: [
    { name: "API Gateway",        status: "operational", latency: "12ms"  },
    { name: "MQTT Broker",        status: "operational", latency: "4ms"   },
    { name: "Database Cluster",   status: "operational", latency: "28ms"  },
    { name: "OTA Update Service", status: "degraded",    latency: "340ms" },
    { name: "Auth Service",       status: "operational", latency: "8ms"   },
    { name: "Billing API",        status: "operational", latency: "65ms"  }
  ]
};

// Math random util for fake server values
const makeMetric = (base, variance) => Math.min(100, Math.max(0, base + (Math.random() - 0.5) * variance));

export const api = {
  get: async (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/system/metrics') return resolve({ data: {
           cpu: makeMetric(42, 20), memory: makeMetric(68, 10), disk: makeMetric(31, 5), network: makeMetric(58, 30)
        } });
        if (url === '/system/services') return resolve({ data: mockDataStore.systemServices });

        if (url === '/users') return resolve({ data: mockDataStore.users });
        if (url === '/devices') return resolve({ data: mockDataStore.devices });
        if (url === '/analytics/bar') return resolve({ data: mockDataStore.analyticsBar });
        if (url === '/analytics/pie') return resolve({ data: mockDataStore.analyticsPie });
        if (url === '/dashboard/sparkline') return resolve({ data: mockDataStore.dashboardSparkline });
        if (url === '/security/firewall') return resolve({ data: mockDataStore.securityFirewall });
        if (url === '/security/events') return resolve({ data: mockDataStore.securityEvents });
        if (url === '/payments/gateways') return resolve({ data: mockDataStore.paymentGateways });
        if (url === '/payments/balances') return resolve({ data: mockDataStore.paymentsBalances });
        if (url === '/dashboard/stats') return resolve({ data: mockDataStore.dashboardStats });
        if (url === '/dashboard/alerts') return resolve({ data: mockDataStore.dashboardAlerts });
        if (url === '/settings/profile') return resolve({ data: mockDataStore.settingsProfile });
        if (url === '/help/faqs') return resolve({ data: mockDataStore.helpFaqs });
        if (url === '/team') return resolve({ data: mockDataStore.teamMembers });
        if (url === '/notifications') return resolve({ data: mockDataStore.notifications });
        
        reject(new Error("404 Not Found"));
      }, MOCK_DELAY);
    });
  },
  post: async (url, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, ...data } }), MOCK_DELAY));
  },
  put: async (url, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, ...data } }), MOCK_DELAY));
  }
};
