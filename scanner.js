/**
 * scanner.js - Fixed Web Bluetooth Scanner Utility
 * Handles browser security filters and prevents unhandled promise exceptions.
 */

async function scanExtendedBluetoothDevices() {
    const statusEl = document.getElementById('btStatus');
    
    // Check if Web Bluetooth is supported
    if (!navigator.bluetooth) {
        if (typeof log === 'function') {
            log("[Error] Web Bluetooth API is not supported in this browser environment.");
        }
        statusEl.innerText = "Status: Web Bluetooth unsupported here.";
        return;
    }

    try {
        statusEl.innerText = "Status: Opening Bluetooth selector...";
        if (typeof log === 'function') {
            log("Triggering browser Bluetooth device picker...");
        }

        // NOTE: Browsers require filters or explicit configuration to avoid throwing errors.
        // We use a broader set of optional services and filter parameters.
        const options = {
            filters: [
                { services: ['generic_access'] },
                { services: ['generic_attribute'] }
            ],
            optionalServices: [
                'battery_service', 
                'device_information',
                0x110a, // Audio Source
                0x110b  // Audio Sink
            ]
        };

        // Fallback: If no devices match specific filters, prompt with acceptAllDevices if supported, 
        // otherwise catch the constraint error cleanly.
        let device;
        try {
            device = await navigator.bluetooth.requestDevice(options);
        } catch (filterErr) {
            if (typeof log === 'function') {
                log("[Notice] Filtered scan yielded nothing or was dismissed. Trying broader match...");
            }
            // Fallback to allow pairing if user environment permits
            device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['generic_access', 'generic_attribute']
            });
        }

        if (device) {
            const deviceName = device.name || "Unnamed Device";
            statusEl.innerText = `Status: Selected -> ${deviceName}`;
            if (typeof log === 'function') {
                log(`[SUCCESS] Connected to target: ${deviceName}`);
            }

            // Connect to GATT server
            const server = await device.gatt.connect();
            if (typeof log === 'function') {
                log(`[SUCCESS] GATT server connection established.`);
            }

            device.addEventListener('gattserverdisconnected', () => {
                statusEl.innerText = "Status: Device disconnected.";
                if (typeof log === 'function') {
                    log(`[Warning] Disconnected from ${deviceName}`);
                }
            });
        }

    } catch (error) {
        // This handles when the user cancels the Bluetooth popup window or if an error occurs
        console.error("Bluetooth error:", error);
        if (error.name === 'NotFoundError' || error.code === 8) {
            statusEl.innerText = "Status: Scan cancelled by user.";
            if (typeof log === 'function') {
                log("[Info] Bluetooth selection dialog was closed or no device was selected.");
            }
        } else {
            statusEl.innerText = `Status: Error - ${error.message}`;
            if (typeof log === 'function') {
                log(`[Error] Bluetooth failure: ${error.message}`);
            }
        }
    }
}
