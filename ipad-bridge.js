/**
 * ipad-bridge.js - iPadOS Compatibility Bridge for Web Bluetooth
 * Detects iOS/iPadOS user agents and provides user guidance for BLE-enabled browsers.
 */

function isIpadOrIos() {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

async function handleIpadBluetoothScan() {
    const statusEl = document.getElementById('btStatus');

    // If native Web Bluetooth exists (Desktop Chrome/Edge/Android), let it run normally
    if (navigator.bluetooth) {
        if (typeof runChromeBluetoothScan === 'function') {
            return runChromeBluetoothScan();
        }
    }

    // If running on an iPad or iOS device where WebKit blocks Bluetooth:
    if (isIpadOrIos()) {
        statusEl.innerText = "Status: iPadOS restricted. Use Bluefy browser.";
        if (typeof log === 'function') {
            log("[Notice] iPadOS detected: Apple restricts Web Bluetooth in standard apps.");
            log("[Guide] To use Bluetooth here, open this GitHub Pages link inside the 'Bluefy - Web BLE Browser' app from the App Store.");
        }
        
        // Show a helpful prompt explaining the iPad workaround
        alert(
            "iPadOS Web Bluetooth Notice:\n\n" +
            "Apple restricts built-in Bluetooth scanning inside standard iOS web views. " +
            "To use this dashboard's Bluetooth features on your iPad, please open your GitHub Pages link inside the free 'Bluefy' browser app from the App Store."
        );
        return;
    }

    // Fallback error if completely unsupported
    statusEl.innerText = "Status: Web Bluetooth unsupported.";
    if (typeof log === 'function') {
        log("[Error] Web Bluetooth API is not supported by this browser.");
    }
}
