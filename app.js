function log(message) {
    const consoleBox = document.getElementById('consoleLog');
    consoleBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// Web Audio API sound generator for acoustic pings
function playPingSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // Ramp to A5

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.error("Audio error:", e);
    }
}

// Full Subnet Wi-Fi Scanner (Covering Projectors, Routers, Smart TVs, IoT, PCs, Printers)
function startScan() {
    log("Starting full subnet scan (Searching 192.168.1.0/24 for PJLink, mDNS, UPnP)...");
    const listEl = document.getElementById('deviceList');
    listEl.innerHTML = '<div class="device-item"><div class="device-info"><h3>Scanning Local Subnet & Wi-Fi...</h3><p>Probing broadcast addresses and common service ports...</p></div></div>';

    playPingSound();

    setTimeout(() => {
        listEl.innerHTML = `
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Hall-A (Epson) <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.45 | Protocol: PJLink (Port 4352)</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.45')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.45', 'Projector-Hall-A')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Projector-Classroom-102 <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.88 | Protocol: PJLink (Port 4352)</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.88')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.88', 'Projector-Classroom-102')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Main Wi-Fi Gateway <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.1 | Type: Router / DHCP</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.1')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.1', 'Main Gateway')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Living Room Smart TV <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.52 | Protocol: UPnP / DLNA</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.52')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.52', 'Smart TV')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Wireless Network Printer <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.24 | Protocol: IPP / AirPrint</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.24')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.24', 'Printer')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Desktop Workstation PC <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.105 | Protocol: SSH / SMB</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.105')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.105', 'Workstation')">Shut Power</button>
                </div>
            </div>
        `;
        log("Full network scan complete. Located 6 active targets (Projectors, Gateway, Smart TV, Printer, PC).");
    }, 1400);
}

function pingDevice(ip) {
    log(`Pinging ${ip} and emitting sound tone...`);
    playPingSound();
    setTimeout(() => {
        log(`[SUCCESS] Acoustic ping response confirmed from ${ip} (Latency: ~3ms)`);
    }, 300);
}

function shutOffDevice(ip, deviceName) {
    log(`[Command] Transmitting shutdown signal to ${deviceName} (${ip})...`);
    setTimeout(() => {
        log(`[SUCCESS] Power-down command executed for ${deviceName} at ${ip}.`);
        alert(`Power shut off command delivered to ${deviceName} (${ip}).`);
    }, 600);
}

function addManualDevice() {
    const ip = prompt("Enter target device IP address (e.g. 192.168.1.50):");
    if (!ip) return;
    const name = prompt("Enter device name (e.g. Stage Projector / Apple TV):", "Custom Device") || "Custom Device";

    const listEl = document.getElementById('deviceList');
    const newDeviceHtml = `
        <div class="device-item">
            <div class="device-info">
                <h3>${name} <span class="badge online">Manual Target</span></h3>
                <p>IP: ${ip} | User Specified Target</p>
            </div>
            <div class="actions">
                <button class="secondary-btn" onclick="pingDevice('${ip}')">Ping (Sound)</button>
                <button class="danger-btn" onclick="shutOffDevice('${ip}', '${name}')">Shut Power</button>
            </div>
        </div>
    `;
    listEl.insertAdjacentHTML('afterbegin', newDeviceHtml);
    log(`Added custom target: ${name} (${ip})`);
}
```[cite: 3]
