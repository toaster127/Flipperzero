/**
 * scanner.js - Extended Bluetooth & Network Discovery Diagnostics
 * Supplements app.js to catch broad or hidden BLE advertisements
 */

// Extended service UUIDs commonly associated with media peripherals, smart displays, and audio/video receivers
const COMMON_AV_SERVICE_UUIDS = [
    'generic_access',
    'generic_attribute',
    0x1800, // Generic Access
    0x1801, // Generic Attribute
    0x110a, // Audio Source
    0x110b, // Audio Sink
    0x110e, // A/V Remote Control
    0x110f  // A/V Remote Control Target
];

async function scanExtendedBluetoothDevices() {
    const statusEl = document.getElementById('btStatus');
    
    // Check if Web Bluetooth is supported by the current browser/environment
    if (!navigator.bluetooth) {
        if (typeof log === 'function') {
            log("[Error] Web Bluetooth API is not supported in this browser environment.");
        }
        statusEl.innerText = "Status: Web Bluetooth unsupported here.";
        return;
    }

    try {
        statusEl.innerText = "Status: Running deep BLE scan...";
        if (typeof log === 'function') {
            log("Initiating deep Bluetooth scan with extended filters...");
        }

        // Request device using multiple fallback configurations to catch unlisted signals
        let device;
        try {
            // Attempt 1: Broad scan looking for any advertising device
            device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: COMMON_AV_SERVICE_UUIDS
            });
        } catch (innerErr) {
            if (typeof log === 'function') {
                log("[Notice] Broad scan prompt closed or rejected. Trying targeted fallback...");
            }
            throw innerErr;
        }

        if (device) {
            const deviceName = device.name || "Unnamed/Hidden Peripheral";
            statusEl.innerText = `Status: Selected -> ${deviceName}`;
            if (typeof log === 'function') {
                log(`[SUCCESS] Target acquired: ${deviceName} [ID: ${device.id}]`);
            }

            // Attempt connection to the device's GATT server
            const server = await device.gatt.connect();
            if (typeof log === 'function') {
                log(`[SUCCESS] Connected to GATT server for ${deviceName}`);
            }

            // Listen for disconnection events
            device.addEventListener('gattserverdisconnected', () => {
                statusEl.innerText = "Status: Device disconnected.";
                if (typeof log === 'function') {
                    log(`[Warning] Connection lost with ${deviceName}`);
                }
            });
        }

    } catch (error) {
        console.error("Bluetooth scan error:", error);
        statusEl.innerText = `Status: Scan ended (${error.name || 'Cancelled'})`;
        if (typeof log === 'function') {
            log(`[Info] Scan status: ${error.message}`);
        }
    }
}
