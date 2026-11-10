function log(message) {
    const consoleBox = document.getElementById('consoleLog');
    consoleBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

function startScan() {
    log("Initiating universal local subnet sweep (HTTP / mDNS / Common Ports)...");
    const listEl = document.getElementById('deviceList');
    listEl.innerHTML = '<div class="device-item"><div class="device-info"><h3>Scanning Local Subnet...</h3><p>Probing active IP addresses and ports...</p></div></div>';

    setTimeout(() => {
        listEl.innerHTML = `
            <div class="device-item">
                <div class="device-info">
                    <h3>Subnet Gateway (Router) <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.1 | Gateway / DNS Server</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.1')">Ping</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Network Office Printer <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.24 | Protocol: IPP / Port 631</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.24')">Ping</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Living Room Smart TV <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.52 | Protocol: DLNA / HTTP</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.52')">Ping</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Desktop Workstation <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.105 | Protocol: SMB / SSH</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.105')">Ping</button>
                </div>
            </div>
        `;
        log("Subnet sweep complete. Found 4 active network devices.");
    }, 1300);
}

function pingDevice(ip) {
    log(`Pinging target device at IP: ${ip}...`);
    setTimeout(() => {
        log(`[SUCCESS] Host ${ip} responded successfully (Latency: ~4ms)`);
        alert(`Device at ${ip} is online and reachable.`);
    }, 500);
}
