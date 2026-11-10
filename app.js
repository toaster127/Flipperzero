function log(message) {
    const consoleBox = document.getElementById('consoleLog');
    consoleBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

function startScan() {
    log("Initiating network sweep on port 4352...");
    const listEl = document.getElementById('deviceList');
    listEl.innerHTML = '<div class="device-item"><div class="device-info"><h3>Scanning...</h3><p>Please wait...</p></div></div>';

    setTimeout(() => {
        listEl.innerHTML = `
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Hall-A <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.45 | Protocol: PJLink</p>
                </div>
                <div class="actions">
                    <button onclick="powerOff('192.168.1.45')">Power Off</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Classroom-102 <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.88 | Protocol: PJLink</p>
                </div>
                <div class="actions">
                    <button onclick="powerOff('192.168.1.88')">Power Off</button>
                </div>
            </div>
        `;
        log("Scan complete. 2 active projectors discovered.");
    }, 1200);
}

function powerOff(ip) {
    log(`Sending power-off command (%1POWR 0) to target: ${ip}`);
    setTimeout(() => {
        log(`[SUCCESS] Response received from ${ip}: OK`);
        alert(`Projector at ${ip} has been powered off.`);
    }, 600);
}

async function scanBluetoothDevices() {
    const statusEl = document.getElementById('btStatus');
    try {
        statusEl.innerText = "Status: Requesting Bluetooth device...";
        log("Requesting Bluetooth device via Web Bluetooth API...");
        
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['generic_access']
        });

        statusEl.innerText = `Status: Connecting to ${device.name || 'Unknown Device'}...`;
        log(`Selected Bluetooth device: ${device.name || 'Unknown Device'}`);
        
        const server = await device.gatt.connect();
        statusEl.innerText = `Status: Connected to ${device.name || 'Device'}!`;
        log(`[SUCCESS] Connected to GATT server of ${device.name || 'Device'}`);
        
        device.addEventListener('gattserverdisconnected', () => {
            statusEl.innerText = "Status: Device disconnected.";
            log("[Warning] Bluetooth device disconnected.");
        });

    } catch (error) {
        console.error(error);
        statusEl.innerText = `Status: Error - ${error.message}`;
        log(`[Error] Bluetooth error: ${error.message}`);
    }
}
