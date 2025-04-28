const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const framingOptions = document.getElementById('framing-options');
const rotateXButton = document.getElementById('rotate-x');
const rotateYButton = document.getElementById('rotate-y');

// Placeholder for image
let image = new Image();
let isImageLoaded = false;

// Load an image if user uploads one
document.getElementById('upload-image').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Draw image once loaded
image.onload = function() {
  isImageLoaded = true;
  fitCanvasToImage();
};

// Fit canvas to current image size
function fitCanvasToImage() {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// Framing aspect ratios
const aspectRatios = {
  'original': null, // special case
  '1-1': 1,
  '4-3': 4/3,
  '3-4': 3/4,
  '16-9': 16/9,
  '9-16': 9/16,
  '3-2': 3/2,
  '2-3': 2/3,
  '7-5': 7/5,
  '5-7': 5/7
};

// Change frame when user selects option
framingOptions.addEventListener('change', () => {
  if (!isImageLoaded) return;

  const selected = framingOptions.value;
  const ratio = aspectRatios[selected];

  if (selected === 'original') {
    fitCanvasToImage();
  } else {
    // Adjust canvas keeping width constant
    const currentWidth = canvas.width;
    const newHeight = currentWidth / ratio;
    canvas.height = newHeight;

    // Redraw the image resized
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
});

// Basic rotation along X and Y (simulation)
let rotateX = false;
let rotateY = false;

rotateXButton.addEventListener('click', () => {
  if (!isImageLoaded) return;
  rotateX = !rotateX;
  applyRotation();
});

rotateYButton.addEventListener('click', () => {
  if (!isImageLoaded) return;
  rotateY = !rotateY;
  applyRotation();
});

function applyRotation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  if (rotateX) {
    ctx.scale(1, -1); // Flip vertically
    ctx.drawImage(image, 0, -canvas.height, canvas.width, canvas.height);
  } else if (rotateY) {
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(image, -canvas.width, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  ctx.restore();
}




//adjust default
// Grab adjustment sliders
const brightnessSlider = document.getElementById('brightness');
const greyscaleSlider = document.getElementById('greyscale');
const contrastSlider = document.getElementById('contrast');
const saturationSlider = document.getElementById('saturation');
const hueSlider = document.getElementById('hue');
const sharpnessSlider = document.getElementById('sharpness');

// Listen to adjustment changes
const adjustSliders = [brightnessSlider, greyscaleSlider, contrastSlider, saturationSlider, hueSlider, sharpnessSlider];

adjustSliders.forEach(slider => {
  slider.addEventListener('input', applyAdjustments);
});

function applyAdjustments() {
  if (!isImageLoaded) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.filter = `
    brightness(${brightnessSlider.value}%)
    grayscale(${greyscaleSlider.value}%)
    contrast(${contrastSlider.value}%)
    saturate(${saturationSlider.value}%)
    hue-rotate(${hueSlider.value}deg)
  `;
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  if (sharpnessSlider.value != 100) {
    applySharpnessEffect(sharpnessSlider.value);
  }
}

// Basic "fake" sharpness effect (makes image crisper by redrawing)
function applySharpnessEffect(sharpnessValue) {
  // Simulate slight sharpening by drawing the image again with slightly offset transparency
  const factor = (sharpnessValue - 100) / 1000;
  ctx.globalAlpha = factor;
  ctx.drawImage(canvas, -1, 0, canvas.width, canvas.height);
  ctx.drawImage(canvas, 1, 0, canvas.width, canvas.height);
  ctx.drawImage(canvas, 0, -1, canvas.width, canvas.height);
  ctx.drawImage(canvas, 0, 1, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;
}


document.addEventListener('DOMContentLoaded', function () {

    // Get the canvas and the image pad container
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create an image element to load the uploaded image
    let img = new Image();
    
    // Get the filter selection dropdown
    const filterSelect = document.getElementById('filter-options');
  
    // Function to load the image onto the canvas
    function loadImageToCanvas(image) {
      const imgWidth = image.width;
      const imgHeight = image.height;
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous image
  
      ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
    }
  
    // Function to apply the selected filter to the canvas
    function applyFilter(filter) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      switch (filter) {
        case 'bw':
          // Black and White filter
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
          }
          break;
          
        case 'cyberpunk':
          // Cyberpunk filter: Adjusting RGB for intense colors
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 1.5, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 0.8, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 2, 255); // Blue
          }
          break;
  
        case 'softgrey':
          // Soft Grey filter: reducing colors
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg * 0.8; // Red
            data[i + 1] = avg * 0.8; // Green
            data[i + 2] = avg * 0.8; // Blue
          }
          break;
          
        case 'summer':
          // Summer filter: Warm tones, more orange and red
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 1.2, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 1.1, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 0.8, 255); // Blue
          }
          break;
  
        case 'cool':
          // Cool filter: Blue tones enhanced
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 0.8, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 1.0, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 1.2, 255); // Blue
          }
          break;
  
        case 'warm':
          // Warm filter: Red and yellow enhanced
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 1.2, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 1.1, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 0.9, 255); // Blue
          }
          break;
  
        case 'lomo':
          // Lomo filter: Dark corners and enhanced color
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 1.1, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 1.0, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 0.9, 255); // Blue
          }
          break;
  
        case 'greenorange':
          // Green Orange filter: Green and orange balance
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * 1.0, 255); // Red
            data[i + 1] = Math.min(data[i + 1] * 1.5, 255); // Green
            data[i + 2] = Math.min(data[i + 2] * 0.8, 255); // Blue
          }
          break;
  
        default:
          // Original image, no filter
          break;
      }
  
      // Put the image data back to the canvas after applying the filter
      ctx.putImageData(imageData, 0, 0);
    }
  
    // Load image from the file input
    const uploadImage = document.getElementById('upload-image');
    uploadImage.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          img.onload = function () {
            loadImageToCanvas(img);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Apply filter when the selection changes
    filterSelect.addEventListener('change', function () {
      const selectedFilter = filterSelect.value;
      applyFilter(selectedFilter);
    });
  });



//text 
  // Get the necessary elements
//const canvas = document.getElementById("canvas");
//const ctx = canvas.getContext("2d");
const textInput = document.getElementById("text-input");
const fontSizeInput = document.getElementById("font-size");
const fontColorInput = document.getElementById("font-color");
const addTextButton = document.getElementById("add-text");

// Initialize some variables for text placement
let textObject = null;
let isTextAdded = false;

// Set the default canvas size
canvas.width = 500;
canvas.height = 500;

// Draw initial empty canvas
function drawEmptyCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the text on the canvas
function drawText() {
  if (isTextAdded && textObject) {
    drawEmptyCanvas(); // Clear the canvas before redrawing
    ctx.font = `${textObject.fontSize}px Arial`;
    ctx.fillStyle = textObject.fontColor;
    ctx.fillText(textObject.text, textObject.x, textObject.y);
  }
}

// Handle adding the text when the button is clicked
addTextButton.addEventListener("click", function () {
  const text = textInput.value;
  const fontSize = parseInt(fontSizeInput.value, 10);
  const fontColor = fontColorInput.value;

  // If there's no text, do nothing
  if (!text) return;

  // Set text properties
  textObject = {
    text: text,
    fontSize: fontSize,
    fontColor: fontColor,
    x: canvas.width / 2, // Center horizontally
    y: canvas.height / 2 // Center vertically
  };

  isTextAdded = true;
  drawText(); // Redraw the canvas with the new text
});

// You can add more interactivity here such as dragging the text
// (optional for future improvements)

//eraser undo/redo
const eraserBtn = document.getElementById('eraser');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
let isErasing = false;
let isDrawing = false;
let drawingHistory = [];
let undoneHistory = [];

// Set up the canvas size
canvas.width = 600;
canvas.height = 400;

// Store the drawing history
function saveDrawingState() {
  // Push the current state to history
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  drawingHistory.push(imageData);
  undoneHistory = []; // Clear redo history
}

// Handle eraser
eraserBtn.addEventListener('click', () => {
  isErasing = !isErasing;
  eraserBtn.textContent = isErasing ? 'Stop Erasing' : 'Eraser';
});

// Handle mouse down to start drawing or erasing
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const { offsetX, offsetY } = e;
  if (isErasing) {
    ctx.clearRect(offsetX, offsetY, 20, 20); // Erase 20x20 pixel area
  } else {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  }
  saveDrawingState(); // Save the state when starting a new stroke
});

// Handle mouse move for drawing or erasing
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const { offsetX, offsetY } = e;

  if (isErasing) {
    ctx.clearRect(offsetX, offsetY, 20, 20); // Erase 20x20 pixel area
  } else {
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }
});

// Handle mouse up to stop drawing or erasing
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Undo function
undoBtn.addEventListener('click', () => {
  if (drawingHistory.length === 0) return; // No history to undo

  const lastState = drawingHistory.pop();
  undoneHistory.push(lastState);

  // Restore the last drawing state
  ctx.putImageData(lastState, 0, 0);
});

// Redo function
redoBtn.addEventListener('click', () => {
  if (undoneHistory.length === 0) return; // No history to redo

  const lastUndoneState = undoneHistory.pop();
  drawingHistory.push(lastUndoneState);

  // Restore the last undone drawing state
  ctx.putImageData(lastUndoneState, 0, 0);
});
 

//insertion download
const uploadInput = document.getElementById('upload-image');
const downloadBtn = document.getElementById('download-image');

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Handle image upload
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function() {
        // Clear canvas before drawing new image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      img.src = event.target.result;
    }
    
    reader.readAsDataURL(file);
  }
});

// Handle image download
downloadBtn.addEventListener('click', () => {
  const imageUrl = canvas.toDataURL('image/png'); // Get image data as PNG
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'edited_image.png'; // Set default file name
  link.click(); // Trigger the download
});


const imagePad = document.getElementById('image-pad');
const imageInput = document.getElementById('upload-image');
const downloadButton = document.getElementById('download-image');

// Adjustments
//const brightnessSlider = document.getElementById('brightness');
//const contrastSlider = document.getElementById('contrast');
//const saturationSlider = document.getElementById('saturation');
//const hueSlider = document.getElementById('hue');
//const sharpnessSlider = document.getElementById('sharpness');
//const greyscaleSlider = document.getElementById('greyscale');

// Filters
const filterSelect = document.getElementById('filter-options');

// Text
//const textInput = document.getElementById('text-input');
//const fontSizeInput = document.getElementById('font-size');
//const fontColorInput = document.getElementById('font-color');
//const addTextButton = document.getElementById('add-text');

// Undo/Redo
let history = [];
let currentHistoryIndex = -1;

// Variables to store current image and modifications
let currentImage = new Image();
let imgData = null;
let textObjects = [];

// Event listeners
imageInput.addEventListener('change', handleImageUpload);
downloadButton.addEventListener('click', downloadImage);
filterSelect.addEventListener('change', applyFilter);
brightnessSlider.addEventListener('input', updateImage);
contrastSlider.addEventListener('input', updateImage);
saturationSlider.addEventListener('input', updateImage);
hueSlider.addEventListener('input', updateImage);
sharpnessSlider.addEventListener('input', updateImage);
greyscaleSlider.addEventListener('input', updateImage);
addTextButton.addEventListener('click', addTextToImage);

// Load the image onto the canvas
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// When image is loaded, draw it to canvas
currentImage.onload = function() {
  canvas.width = currentImage.width;
  canvas.height = currentImage.height;
  ctx.drawImage(currentImage, 0, 0);
  storeState();
};

// Update image adjustments like brightness, contrast, etc.
function updateImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.filter = `
    brightness(${brightnessSlider.value}%)
    contrast(${contrastSlider.value}%)
    saturate(${saturationSlider.value}%)
    hue-rotate(${hueSlider.value}deg)
    grayscale(${greyscaleSlider.value}%)
  `;
  
  ctx.drawImage(currentImage, 0, 0);
  textObjects.forEach(drawText); // Redraw text after update
  storeState(); // Save the current state to history
}

// Apply the selected filter
function applyFilter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let filter = filterSelect.value;
  
  switch (filter) {
    case 'bw':
      ctx.filter = 'grayscale(100%)';
      break;
    case 'cyberpunk':
      ctx.filter = 'contrast(200%) saturate(300%)';
      break;
    case 'softgrey':
      ctx.filter = 'grayscale(50%) brightness(80%)';
      break;
    case 'summer':
      ctx.filter = 'saturate(150%) hue-rotate(45deg)';
      break;
    case 'cool':
      ctx.filter = 'blue';
      break;
    case 'warm':
      ctx.filter = 'sepia(100%)';
      break;
    case 'lomo':
      ctx.filter = 'brightness(120%) contrast(150%)';
      break;
    case 'greenorange':
      ctx.filter = 'hue-rotate(90deg)';
      break;
    default:
      ctx.filter = 'none';
  }
  
  ctx.drawImage(currentImage, 0, 0);
  textObjects.forEach(drawText); // Redraw text after applying filter
  storeState(); // Save the current state to history
}

// Add text to the image
function addTextToImage() {
  const text = textInput.value;
  const fontSize = fontSizeInput.value;
  const fontColor = fontColorInput.value;
  
  textObjects.push({ text, fontSize, fontColor, x: 50, y: 50 });
  drawText({ text, fontSize, fontColor, x: 50, y: 50 });
  textInput.value = ''; // Clear the text input
  storeState();
}

// Draw text on the canvas
function drawText({ text, fontSize, fontColor, x, y }) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = fontColor;
  ctx.fillText(text, x, y);
}

// Undo the last action
function undo() {
  if (currentHistoryIndex > 0) {
    currentHistoryIndex--;
    loadState(currentHistoryIndex);
  }
}

// Redo the last undone action
function redo() {
  if (currentHistoryIndex < history.length - 1) {
    currentHistoryIndex++;
    loadState(currentHistoryIndex);
  }
}

// Store the current state of the image
function storeState() {
  const dataUrl = canvas.toDataURL();
  if (currentHistoryIndex < history.length - 1) {
    history = history.slice(0, currentHistoryIndex + 1); // Trim redo history
  }
  history.push(dataUrl);
  currentHistoryIndex++;
}

// Load a specific state from history
function loadState(index) {
  const image = new Image();
  image.src = history[index];
  image.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    textObjects.forEach(drawText); // Redraw text after state load
  };
}

// Download the image
function downloadImage() {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'edited-image.png';
  link.click();
}

  




