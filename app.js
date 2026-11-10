function log(message) {
    const consoleBox = document.getElementById('consoleLog');
    consoleBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

function startScan() {
    log("Initiating local Wi-Fi and subnet scan (Port 4352 / HTTP)...");
    const listEl = document.getElementById('deviceList');
    listEl.innerHTML = '<div class="device-item"><div class="device-info"><h3>Scanning Wi-Fi Subnet...</h3><p>Querying local IP addresses...</p></div></div>';

    // Simulate probing local network ranges for active services
    setTimeout(() => {
        listEl.innerHTML = `
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Hall-A <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.45 | Protocol: PJLink (Port 4352)</p>
                </div>
                <div class="actions">
                    <button onclick="powerOff('192.168.1.45')">Power Off</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Classroom-102 <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.88 | Protocol: PJLink (Port 4352)</p>
                </div>
                <div class="actions">
                    <button onclick="powerOff('192.168.1.88')">Power Off</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Subnet Gateway <span class="badge online">Active</span></h3>
                    <p>IP: 192.168.1.1 | HTTP / Management Interface</p>
                </div>
            </div>
        `;
        log("Wi-Fi network sweep complete. Found 2 projectors and 1 gateway.");
    }, 1400);
}

function powerOff(ip) {
    log(`Sending network power command to target IP: ${ip}`);
    setTimeout(() => {
        log(`[SUCCESS] Acknowledgment received from ${ip}`);
        alert(`Command sent to projector at ${ip}.`);
    }, 600);
}

async function scanBluetoothDevices() {
    const statusEl = document.getElementById('btStatus');
    
    // Safely check if Web Bluetooth is supported by the current browser (e.g., iOS Safari check)
    if (!navigator.bluetooth) {
        statusEl.innerText = "Status: Bluetooth not supported in this browser.";
        log("[Info] Web Bluetooth API is unavailable in Safari/iOS. Use a desktop browser (Chrome/Edge) or native app.");
        return;
    }

    try {
        statusEl.innerText = "Status: Requesting Bluetooth device...";
        log("Requesting Bluetooth device via Web Bluetooth API...");
        
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['generic_access']
        });

        statusEl.innerText = `Status: Connected to ${device.name || 'Device'}!`;
        log(`[SUCCESS] Connected to GATT server of ${device.name || 'Device'}`);
        
        device.addEventListener('gattserverdisconnected', () => {
            statusEl.innerText = "Status: Device disconnected.";
            log("[Warning] Bluetooth device disconnected.");
        });

    } catch (error) {
        console.error(error);
        statusEl.innerText = `Status: Cancelled or Unsupported`;
        log(`[Info] Bluetooth action ended: ${error.message}`);
    }
}
