const paletteContainer = document.getElementById("palette");
const paletteSizeSelect = document.getElementById("paletteSize");
const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");
const savedPalettesContainer = document.getElementById("savedPalettes");
const toast = document.getElementById("toast");

let currentPalette = [];

function generateRandomHSL() {
const hue = Math.floor(Math.random() * 360);
const saturation = Math.floor(Math.random() * 31) + 60;
const lightness = Math.floor(Math.random() * 31) + 40;
 
return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
 
function hslToHex(hsl) {
const values = hsl.match(/\d+/g).map(Number);
const h = values[0] / 360;
const s = values[1] / 100;
const l = values[2] / 100;
 
let r;
let g;
let b;
 
if (s === 0) {
  r = g = b = l;
} else {
const hueToRgb = (p, q, t) => {
if (t < 0) t += 1;
if (t > 1) t -= 1;
if (t < 1 / 6) return p + (q - p) * 6 * t;
if (t < 1 / 2) return q;
if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
return p;
};
 
const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
const p = 2 * l - q;
 
r = hueToRgb(p, q, h + 1 / 3);
g = hueToRgb(p, q, h);
b = hueToRgb(p, q, h - 1 / 3);
}
 
const toHex = (color) => {
const hex = Math.round(color * 255).toString(16);
return hex.length === 1 ? "0" + hex : hex;
};
 
return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
 
function showToast(message) {
toast.textContent = message;
toast.classList.add("show");

setTimeout(() => {
toast.classList.remove("show");
}, 1800);
}

function generatePalette() {
const size = Number(paletteSizeSelect.value);
const newPalette = [];
 
for (let i = 0; i < size; i++) {
if (currentPalette[i]?.locked) {
newPalette.push(currentPalette[i]);
} else {
const hsl = generateRandomHSL();
const hex = hslToHex(hsl);
 
newPalette.push({
hsl,
hex,
locked: false
});
}
}

currentPalette = newPalette;
renderPalette();
showToast("Paleta generada");
}
 
function renderPalette() {
paletteContainer.innerHTML = "";
 
currentPalette.forEach((color, index) => {
const colorCard = document.createElement("article");
colorCard.className = "color-card";
colorCard.style.backgroundColor = color.hsl;
colorCard.tabIndex = 0;
colorCard.setAttribute("aria-label", `Color ${color.hex}. Click para copiar`);
 
const colorCode = document.createElement("span");
colorCode.className = "color-code";
colorCode.textContent = color.hex;
 
const lockButton = document.createElement("button");
lockButton.className = "lock-btn";
lockButton.type = "button";
lockButton.textContent = color.locked ? "🔒" : "🔓";
lockButton.setAttribute(
"aria-label",
color.locked ? "Desbloquear color" : "Bloquear color"
);
 
colorCard.addEventListener("click", () => {
copyHex(color.hex);
});
 
colorCard.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
copyHex(color.hex);
}
});
 
lockButton.addEventListener("click", (event) => {
event.stopPropagation();
currentPalette[index].locked = !currentPalette[index].locked;
renderPalette();
showToast(currentPalette[index].locked ? "Color bloqueado" : "Color desbloqueado");
});
 
colorCard.appendChild(colorCode);
colorCard.appendChild(lockButton);
paletteContainer.appendChild(colorCard);
});
}
 
function copyHex(hex) {
navigator.clipboard.writeText(hex);
showToast(`${hex} copiado`);
}

function savePalette() {
if (currentPalette.length === 0) {
showToast("Primero generá una paleta");
return;
} 
const savedPalettes = getSavedPalettes();
savedPalettes.push(currentPalette);
localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
 
renderSavedPalettes();
showToast("Paleta guardada");
}
 
function getSavedPalettes() {
   return JSON.parse(localStorage.getItem("savedPalettes")) || [];
}
 
function renderSavedPalettes() {
const savedPalettes = getSavedPalettes();
savedPalettesContainer.innerHTML = "";

savedPalettes.forEach((palette) => {
const paletteElement = document.createElement("div");
paletteElement.className = "saved-palette";

palette.forEach((color) => {
const colorElement = document.createElement("div");
colorElement.className = "saved-color";
colorElement.style.backgroundColor = color.hex;
colorElement.title = color.hex;

paletteElement.appendChild(colorElement);
});

savedPalettesContainer.appendChild(paletteElement);
});
}

generateBtn.addEventListener("click", generatePalette);
saveBtn.addEventListener("click", savePalette);
paletteSizeSelect.addEventListener("change", generatePalette);
 
renderSavedPalettes();
generatePalette();


