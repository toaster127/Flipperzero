/**
 * chrome-scanner.js - Optimized Web Bluetooth Scanner for Chrome
 * Leverages Chrome's full support for BLE device selection, service querying, and GATT services.
 */

async function runChromeBluetoothScan() {
    const statusEl = document.getElementById('btStatus');
    
    if (!navigator.bluetooth) {
        if (typeof log === 'function') {
            log("[Error] Web Bluetooth is not available in this environment.");
        }
        statusEl.innerText = "Status: Web Bluetooth unsupported.";
        return;
    }

    try {
        statusEl.innerText = "Status: Opening Chrome Bluetooth picker...";
        if (typeof log === 'function') {
            log("[Chrome Scanner] Requesting Bluetooth device with full service discovery...");
        }

        // Chrome allows broad discovery when paired with user interaction
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                'generic_access',
                'generic_attribute',
                'battery_service',
                'device_information',
                'pnp_information'
            ]
        });

        if (device) {
            const deviceName = device.name || "Unnamed BLE Device";
            statusEl.innerText = `Status: Connected to ${deviceName}`;
            if (typeof log === 'function') {
                log(`[SUCCESS] Selected Device: ${deviceName}`);
                log(`[Info] Device ID: ${device.id}`);
            }

            // Establish connection to the GATT server
            const server = await device.gatt.connect();
            if (typeof log === 'function') {
                log(`[SUCCESS] GATT server connected for ${deviceName}`);
            }

            // Monitor connection status
            device.addEventListener('gattserverdisconnected', () => {
                statusEl.innerText = "Status: Device disconnected.";
                if (typeof log === 'function') {
                    log(`[Warning] Connection lost with ${deviceName}`);
                }
            });
        }

    } catch (error) {
        console.error("Chrome Bluetooth Error:", error);
        if (error.name === 'NotFoundError') {
            statusEl.innerText = "Status: Selection cancelled.";
            if (typeof log === 'function') {
                log("[Info] Bluetooth device prompt was closed or dismissed.");
            }
        } else {
            statusEl.innerText = `Status: Error - ${error.message}`;
            if (typeof log === 'function') {
                log(`[Error] Bluetooth failure: ${error.message}`);
            }
        }
    }
}
