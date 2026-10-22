let originalWindowState = {};
let currentCorner = 'bottom-right'; // Default starting corner
const corners = ['bottom-right', 'bottom-left', 'top-left', 'top-right'];

// Math to calculate where the window should go based on the chosen corner
function getCornerCoordinates(workArea, miniWidth, miniHeight, corner) {
  switch (corner) {
    case 'bottom-right':
      return { top: workArea.height - miniHeight + workArea.top, left: workArea.width - miniWidth + workArea.left };
    case 'bottom-left':
      return { top: workArea.height - miniHeight + workArea.top, left: workArea.left };
    case 'top-left':
      return { top: workArea.top, left: workArea.left };
    case 'top-right':
      return { top: workArea.top, left: workArea.width - miniWidth + workArea.left };
  }
}

async function toggleWindowSize() {
  const currentWindow = await chrome.windows.getCurrent();
  const displayInfo = await chrome.system.display.getInfo();
  const primaryDisplay = displayInfo.find(d => d.isPrimary) || displayInfo[0];
  const workArea = primaryDisplay.workArea;

  if (currentWindow.width <= 500) {
    // Restore window
    const state = originalWindowState[currentWindow.id];
    if (state) {
      chrome.windows.update(currentWindow.id, {
        state: state.state === 'minimized' ? 'normal' : state.state,
        width: state.width,
        height: state.height,
        top: state.top,
        left: state.left
      });
      if (state.state === 'maximized') {
         chrome.windows.update(currentWindow.id, { state: 'maximized' });
      }
    } else {
       chrome.windows.update(currentWindow.id, { state: 'maximized' });
    }
  } else {
    // Shrink window
    originalWindowState[currentWindow.id] = {
      state: currentWindow.state,
      width: currentWindow.width,
      height: currentWindow.height,
      top: currentWindow.top,
      left: currentWindow.left
    };

    const miniWidth = 450;
    const miniHeight = 300;
    const coords = getCornerCoordinates(workArea, miniWidth, miniHeight, currentCorner);

    chrome.windows.update(currentWindow.id, {
      state: 'normal',
      width: miniWidth,
      height: miniHeight,
      top: Math.round(coords.top),
      left: Math.round(coords.left)
    });
  }
}

// Function to shift the mini window to the next corner
async function moveCorner() {
  // Move to the next corner in the list
  let currentIndex = corners.indexOf(currentCorner);
  currentCorner = corners[(currentIndex + 1) % corners.length];

  const currentWindow = await chrome.windows.getCurrent();
  
  // If the window is currently minimized, move it immediately
  if (currentWindow.width <= 500) {
    const displayInfo = await chrome.system.display.getInfo();
    const primaryDisplay = displayInfo.find(d => d.isPrimary) || displayInfo[0];
    const workArea = primaryDisplay.workArea;
    
    const coords = getCornerCoordinates(workArea, currentWindow.width, currentWindow.height, currentCorner);
    
    chrome.windows.update(currentWindow.id, {
      top: Math.round(coords.top),
      left: Math.round(coords.left)
    });
  }
}

// Listeners for clicks and keyboard shortcuts
chrome.action.onClicked.addListener(toggleWindowSize);

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-size') {
    toggleWindowSize();
  } else if (command === 'cycle-corner') {
    moveCorner();
  }
});
