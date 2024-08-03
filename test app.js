let widget = require("widget");
let rfid = require("rfid");
let subghz = require("subghz");
let badusb = require("badusb");
let blebeacon = require("blebeacon");
let notification = require("notification");

// Function to show the main menu
function showMainMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Security Device");
    widget.addButton(10, 30, "RFID Cloning", showRFIDMenu);
    widget.addButton(10, 50, "Sub-GHz Control", showSubGHzMenu);
    widget.addButton(10, 70, "BadUSB", showBadUSBMenu);
    widget.addButton(10, 90, "BLE Beacon", showBLEBeaconMenu);
    widget.addButton(10, 110, "Notifications", showNotificationsMenu);
    widget.show();
}

// Function to show RFID menu
function showRFIDMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "RFID Cloning");
    widget.addButton(10, 30, "Read RFID", readRFID);
    widget.addButton(10, 50, "Emulate RFID", emulateRFID);
    widget.addButton(10, 90, "Back", showMainMenu);
    widget.show();
}

// Function to read RFID
function readRFID() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Reading RFID...");
    widget.show();
    rfid.startRead();
    let data = rfid.read();
    rfid.stopRead();
    widget.clear();
    widget.addText(10, 10, "Primary", "RFID Data: " + to_string(data));
    widget.addButton(10, 50, "Back", showRFIDMenu);
    widget.show();
}

// Function to emulate RFID
function emulateRFID() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Emulating RFID...");
    widget.show();
    let data = readRFID();
    rfid.startEmulate(data);
    delay(5000);  // Emulate for 5 seconds
    rfid.stopEmulate();
    widget.clear();
    widget.addText(10, 10, "Primary", "RFID Emulated");
    widget.addButton(10, 50, "Back", showRFIDMenu);
    widget.show();
}

// Function to show Sub-GHz menu
function showSubGHzMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Sub-GHz Control");
    widget.addButton(10, 30, "Capture Signal", captureAndReplaySubGHz);
    widget.addButton(10, 90, "Back", showMainMenu);
    widget.show();
}

// Function to capture and replay Sub-GHz signals
function captureAndReplaySubGHz() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Capturing Signal...");
    widget.show();
    subghz.setup();
    subghz.setRx();
    let signal = subghz.receive();
    subghz.stopRx();
    subghz.setTx();
    subghz.transmit(signal);
    subghz.stopTx();
    widget.clear();
    widget.addText(10, 10, "Primary", "Signal Replayed");
    widget.addButton(10, 50, "Back", showSubGHzMenu);
    widget.show();
}

// Function to show BadUSB menu
function showBadUSBMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "BadUSB");
    widget.addButton(10, 30, "Run Payload", runBadUSBPayload);
    widget.addButton(10, 90, "Back", showMainMenu);
    widget.show();
}

// Function to run BadUSB payload
function runBadUSBPayload() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Running Payload...");
    widget.show();
    badusb.setup({ vid: 0xAAAA, pid: 0xBBBB, mfr_name: "Flipper", prod_name: "Zero" });
    badusb.print("Hello, this is a test payload!", 500);
    badusb.press("ENTER");
    badusb.quit();
    widget.clear();
    widget.addText(10, 10, "Primary", "Payload Executed");
    widget.addButton(10, 50, "Back", showBadUSBMenu);
    widget.show();
}

// Function to show BLE Beacon menu
function showBLEBeaconMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "BLE Beacon");
    widget.addButton(10, 30, "Scan Beacons", scanBLEBeacons);
    widget.addButton(10, 50, "Spoof Beacon", spoofBLEBeacon);
    widget.addButton(10, 90, "Back", showMainMenu);
    widget.show();
}

// Function to scan BLE beacons
function scanBLEBeacons() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Scanning for Beacons...");
    widget.show();
    blebeacon.start();
    let beacons = blebeacon.scan();
    blebeacon.stop();
    widget.clear();
    widget.addText(10, 10, "Primary", "Found Beacons: " + to_string(beacons));
    widget.addButton(10, 50, "Back", showBLEBeaconMenu);
    widget.show();
}

// Function to spoof BLE beacon
function spoofBLEBeacon() {
    let beacons = scanBLEBeacons();
    if (beacons.length > 0) {
        widget.clear();
        widget.addText(10, 10, "Primary", "Spoofing Beacon...");
        widget.show();
        blebeacon.setConfig(beacons[0].mac, beacons[0].power, beacons[0].intvMin, beacons[0].intvMax);
        blebeacon.setData(beacons[0].data);
        blebeacon.start();
        delay(5000);  // Spoof for 5 seconds
        blebeacon.stop();
        widget.clear();
        widget.addText(10, 10, "Primary", "Beacon Spoofed");
        widget.addButton(10, 50, "Back", showBLEBeaconMenu);
        widget.show();
    } else {
        widget.clear();
        widget.addText(10, 10, "Primary", "No Beacons Found");
        widget.addButton(10, 50, "Back", showBLEBeaconMenu);
        widget.show();
    }
}

// Function to show Notifications menu
function showNotificationsMenu() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Notifications");
    widget.addButton(10, 30, "Send Notification", sendNotification);
    widget.addButton(10, 90, "Back", showMainMenu);
    widget.show();
}

// Function to send a custom notification
function sendNotification() {
    widget.clear();
    widget.addText(10, 10, "Primary", "Sending Notification...");
    widget.show();
    notification.send("Security event detected!");
    widget.clear();
    widget.addText(10, 10, "Primary", "Notification Sent");
    widget.addButton(10, 50, "Back", showNotificationsMenu);
    widget.show();
}

// Initialize the GUI by showing the main menu
showMainMenu();
