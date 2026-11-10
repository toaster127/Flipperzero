/**
 * bt-scanner.js - Extended Bluetooth Scanner Module
 * Runs independently to prevent breaking existing network scanning code.
 */

async function runAdvancedBluetoothScan() {
    const statusEl = document.getElementById('btStatus') || document.getElementById('consoleLog');
    
    if (!navigator.bluetooth) {
        console.warn("[Bluetooth] Web Bluetooth API is not supported on this device/browser (e.g., iOS Safari).");
        if (typeof log === 'function') {
            log("[Error] Bluetooth unavailable: iOS Safari does not support Web Bluetooth scanning.");
        }
        return;
    }

    try {
        if (typeof log === 'function') {
            log("[Bluetooth] Opening browser Bluetooth selector for deep peripheral scan...");
        }

        // Request connection with broad parameters to catch available devices
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                'generic_access', 
                'generic_attribute', 
                'battery_service', 
                'device_information'
            ]
        });

        if (device) {
            const name = device.name || "Unknown/Unnamed Bluetooth Device";
            if (typeof log === 'function') {
                log(`[SUCCESS] Selected Bluetooth Device: ${name} (ID: ${device.id})`);
            }

            // Attempt GATT connection
            const server = await device.gatt.connect();
            if (typeof log === 'function') {
                log(`[SUCCESS] Connected to GATT server of ${name}`);
            }

            device.addEventListener('gattserverdisconnected', () => {
                if (typeof log === 'function') {
                    log(`[Warning] Lost connection to Bluetooth device: ${name}`);
                }
            });
        }

    } catch (err) {
        console.error("Bluetooth scan error:", err);
        if (err.name === 'NotFoundError') {
            if (typeof log === 'function') {
                log("[Info] Bluetooth scan prompt was dismissed by user.");
            }
        } else {
            if (typeof log === 'function') {
                log(`[Error] Bluetooth error: ${err.message}`);
            }
        }
    }
}
