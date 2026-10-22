# Tab Mini - Chrome Extension

Tab Mini is a lightweight Chrome extension that instantly shrinks your current browser window into a small window in the corner of your screen. It is perfect for keeping a video, tutorial, or reference article visible while you work in other applications.

## Features
* **Minimize & Restore:** Instantly shrink the active window to a 450x300 mini-player, and restore it to its exact original size and position.
* **Corner Cycling:** Move the minimized window between the four corners of your screen (bottom-right, bottom-left, top-left, top-right).
* **Keyboard Shortcuts:** Fully controllable via custom keyboard commands.

## Keyboard Shortcuts
* **`Alt + M`**: Toggle the window size (Minimize / Restore).
* **`Alt + C`**: Cycle the minimized window to the next corner of the screen.

## Installation (Developer Mode)
1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the folder containing the extension files.
6. *Note: Ensure your keyboard shortcuts are active by checking `chrome://extensions/shortcuts`.*

## Technical Overview
* `manifest.json`: Configures permissions (`windows`, `system.display`), registers the `Alt+M` and `Alt+C` commands, and sets the extension icons.
* `background.js`: Handles the core logic. It calculates screen dimensions, stores the original window coordinates and state, resizes the window via the `chrome.windows` API, and calculates the exact coordinates for all four screen corners.
* `icons`: Contains the required 16x16, 48x48, and 128x128 pixel icons.
