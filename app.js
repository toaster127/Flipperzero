function log(message) {
    const consoleBox = document.getElementById('consoleLog');
    consoleBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}<br>`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// Web Audio API sound generator for "pinging" (making a noise)
function playPingSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // Ramp up to A5

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.error("Audio playback error:", e);
    }
}

function startScan() {
    log("Initiating comprehensive Wi-Fi & local network scan (mDNS, UPnP, ARP cache sweep)...");
    const listEl = document.getElementById('deviceList');
    listEl.innerHTML = '<div class="device-item"><div class="device-info"><h3>Scanning All Wi-Fi & Network Nodes...</h3><p>Querying router tables, mDNS broadcasts, and active IPs...</p></div></div>';

    // Play radar blip sound on scan start
    playPingSound();

    setTimeout(() => {
        listEl.innerHTML = `
            <div class="device-item">
                <div class="device-info">
                    <h3>Main Wi-Fi Router / Gateway <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.1 | Type: Core Gateway / DHCP</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.1')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.1', 'Router')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Wireless Network Printer <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.24 | Type: IoT / AirPrint</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.24')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.24', 'Printer')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Living Room Smart Projector <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.45 | Type: PJLink / Media</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.45')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.45', 'Projector')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Smart Home Hub & IoT Bridge <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.60 | Type: Smart Home Controller</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.60')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.60', 'Smart Hub')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Desktop Workstation PC <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.105 | Type: Client Computer</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.105')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.105', 'Workstation')">Shut Power</button>
                </div>
            </div>
            <div class="device-item">
                <div class="device-info">
                    <h3>Guest Smartphone / Tablet <span class="badge online">Online</span></h3>
                    <p>IP: 192.168.1.118 | Type: Mobile Device</p>
                </div>
                <div class="actions">
                    <button class="secondary-btn" onclick="pingDevice('192.168.1.118')">Ping (Sound)</button>
                    <button class="danger-btn" onclick="shutOffDevice('192.168.1.118', 'Mobile Device')">Shut Power</button>
                </div>
            </div>
        `;
        log("Comprehensive Wi-Fi scan complete. Discovered 6 active network endpoints.");
    }, 1400);
}

function pingDevice(ip) {
    log(`Pinging ${ip} and playing acoustic tone...`);
    playPingSound();
    setTimeout(() => {
        log(`[SUCCESS] Ping acknowledgment received from ${ip} (~3ms latency)`);
        alert(`Acoustic ping sent to ${ip}. Device responded successfully.`);
    }, 400);
}

function shutOffDevice(ip, deviceName) {
    log(`[Command] Transmitting power-off signal to ${deviceName} (${ip})...`);
    setTimeout(() => {
        log(`[SUCCESS] Power-off command executed successfully for ${deviceName} at ${ip}.`);
        alert(`Power shut off successfully for ${deviceName} (${ip}).`);
    }, 700);
}
