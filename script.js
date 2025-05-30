const nameInput = document.querySelector(".nameInput");
const addNameButton = document.querySelector(".addBtn");
const spinWheelButton = document.querySelector(".spinWheel");
const wheelCanvas = document.querySelector("#wheelCanvas");
const resultDiv = document.querySelector(".resultContainer");
const inputArea = document.querySelector(".inputArea");
const resultH1 = document.querySelector(".resultHeader h1");
const doneBtn = document.querySelector(".done");
const inputName = document.querySelector(".inputName");

let segments = [
  "YES",
  "NO",
  "YES",
  "NO",
  "YES",
  "NO",
  "YES",
  "NO",
  "YES",
  "NO",
];
let defaultSegmentsActive = true;
let startAngle = 0;
let spinAngle = 0;
let isSpinning = false;

const ctx = wheelCanvas.getContext("2d");

// Lighter, eye-friendly color palette (4 colors)
const segmentColors = [
  "#FFE082", // Light Yellow
  "#B3E5FC", // Light Blue
  "#C8E6C9", // Light Green
  "#FFCCBC", // Light Peach
];

// Set initial canvas size
function setCanvasSize() {
  const container = wheelCanvas.parentElement;
  const size = Math.min(container.clientWidth, 600);
  wheelCanvas.width = size;
  wheelCanvas.height = size;
  drawWheel(); // Redraw wheel after resize
}

// Handle window resize
window.addEventListener("resize", () => {
  setCanvasSize();
});

// Initial setup
setCanvasSize();

// Add value to list
// Add value to list
function addValue(name) {
  const oneInput = document.createElement("div");
  const newH2 = document.createElement("h2");
  const delVal = document.createElement("button");

  delVal.innerHTML = `<span class="material-symbols-outlined">delete</span>"`;
  newH2.textContent = `${name}`;

  delVal.classList.add("delIcon");
  oneInput.classList.add("oneInput");
  inputArea.appendChild(oneInput);
  oneInput.appendChild(newH2);
  oneInput.appendChild(delVal);

  delVal.addEventListener("click", () => {
    inputArea.removeChild(oneInput);
    popVal(name); // Use the name to identify the segment
    drawWheel();
  });
}

// Delete an input value
function popVal(name) {
  const index = segments.indexOf(name); // Find the index dynamically
  if (index > -1) {
    segments.splice(index, 1); // Remove the correct segment
    console.log(segments);
    updateInputHeader();
  }
}

// Add name to the segments array
addNameButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name) {
    // On first user input, clear default segments and input area
    if (defaultSegmentsActive) {
      segments = [];
      inputArea.innerHTML = "";
      defaultSegmentsActive = false;
    }
    segments.push(name);
    addValue(name); // Pass the name to addValue
    nameInput.value = "";
    drawWheel();
    updateInputHeader();
  }
});

nameInput.addEventListener("keypress", (e) => {
  const name = nameInput.value.trim();
  if (e.key === "Enter" && name) {
    // On first user input, clear default segments and input area
    if (defaultSegmentsActive) {
      segments = [];
      inputArea.innerHTML = "";
      defaultSegmentsActive = false;
    }
    segments.push(name);
    const index = segments.indexOf(name);
    addValue(name, index);
    nameInput.value = "";
    drawWheel();
    updateInputHeader();
  }
});

// Draw the wheel with current segments
function drawWheel() {
  const radius = wheelCanvas.width / 2;
  const arcSize = (2 * Math.PI) / segments.length;

  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

  segments.forEach((segment, index) => {
    const angle = startAngle + index * arcSize;
    ctx.fillStyle = segmentColors[index % segmentColors.length];

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + arcSize);
    ctx.closePath();
    ctx.fill();

    // Adjust font size based on canvas size
    const fontSize = Math.max(16, Math.min(30, radius / 10));
    ctx.fillStyle = "#000";
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(
      radius + Math.cos(angle + arcSize / 2) * (radius * 0.7),
      radius + Math.sin(angle + arcSize / 2) * (radius * 0.7)
    );
    ctx.rotate(angle + arcSize / 2 + Math.PI / 2);

    // Truncate text if too long
    const maxLength = Math.floor(radius / (fontSize * 0.6));
    const displayText =
      segment.length > maxLength
        ? segment.substring(0, maxLength - 3) + "..."
        : segment;

    ctx.fillText(displayText, 0, 0);
    ctx.restore();
  });
}

// Spin the wheel
spinWheelButton.addEventListener("click", () => {
  if (isSpinning || segments.length === 0) return;

  isSpinning = true;
  spinAngle = Math.random() * 2000 + 1000; // Random spin angle
  const spinDuration = 3000; // Spin duration in ms

  const startTime = Date.now();

  const spin = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / spinDuration;

    if (progress < 1) {
      startAngle += (spinAngle * (1 - progress ** 2)) / spinDuration;
      drawWheel();
      requestAnimationFrame(spin);
    } else {
      isSpinning = false;
      getResult();
      resultDiv.style.visibility = "visible";
      document.querySelector("body").classList.add("afterResult");
      doneBtn.addEventListener("click", () => {
        resultDiv.style.visibility = "hidden";
        document.querySelector("body").classList.remove("afterResult");
      });
    }
  };

  spin();
});

// Spin the wheel with Ctrl + Enter
document.body.addEventListener("keypress", (event) => {
  console.log(event);
  if ((event.key = "Enter" && event.ctrlKey === true)) {
    if (isSpinning || segments.length === 0) return;

    isSpinning = true;
    spinAngle = Math.random() * 2000 + 1000; // Random spin angle
    const spinDuration = 3000; // Spin duration in ms

    const startTime = Date.now();

    const spin = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / spinDuration;

      if (progress < 1) {
        startAngle += (spinAngle * (1 - progress ** 2)) / spinDuration;
        drawWheel();
        requestAnimationFrame(spin);
      } else {
        isSpinning = false;
        getResult();
        resultDiv.style.visibility = "visible";
        document.querySelector("body").classList.add("afterResult");
        doneBtn.addEventListener("click", () => {
          resultDiv.style.visibility = "hidden";
          document.querySelector("body").classList.remove("afterResult");
        });
      }
    };

    spin();
  }
});

//Hover the Ctrl+Button element
spinWheelButton.addEventListener("mouseover", () => {
  const ctrlEnterPara = document.querySelector(".ctrlMsg p");
  ctrlEnterPara.style.visibility = "visible";
});
//Remove the Ctrl+Button element
spinWheelButton.addEventListener("mouseout", () => {
  const ctrlEnterPara = document.querySelector(".ctrlMsg p");
  ctrlEnterPara.style.visibility = "hidden";
});

// Calculate the result based on the wheel position
function getResult() {
  const arcSize = (2 * Math.PI) / segments.length;

  // Normalize the angle to a range between 0 and 2π
  const normalizedAngle =
    ((startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Adjust angle for the fixed pointer at 12 o'clock
  const pointerAngle =
    ((Math.PI * 3) / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);

  // Find the segment under the pointer
  const selectedIndex = Math.floor(pointerAngle / arcSize);

  // Handle edge case where rounding might cause out-of-bound index
  const finalIndex = selectedIndex === segments.length ? 0 : selectedIndex;

  resultH1.textContent = `Result: ${segments[finalIndex]}`;
}

// On page load, draw the default wheel (input area remains empty)
drawWheel();

// Add Clear All button to input header
function addClearAllButton() {
  let header = document.querySelector(".input");
  let clearBtn = document.querySelector(".clearAllBtn");
  if (!clearBtn) {
    clearBtn = document.createElement("button");
    clearBtn.textContent = "❌";
    clearBtn.className = "clearAllBtn";
    header.appendChild(clearBtn);
  }
  clearBtn.onclick = () => {
    // Reset segments to default YES/NO
    segments = [
      "YES",
      "NO",
      "YES",
      "NO",
      "YES",
      "NO",
      "YES",
      "NO",
      "YES",
      "NO",
    ];
    defaultSegmentsActive = true;
    inputArea.innerHTML = "";
    drawWheel();
    inputName.innerHTML = `Inputs`;
    addClearAllButton();
  };
}

// Call this on page load
addClearAllButton();

// Ensure Clear All button is always present after adding/removing inputs
function updateInputHeader() {
  inputName.innerHTML = `Inputs`;
  addClearAllButton();
}
