const wasmFile = 'tankle.wasm'; // Path to your WASM file

document.getElementById('runGameButton').addEventListener('click', async () => {
  try {
    const canvas = document.getElementById('gameCanvas');
    const gl = canvas.getContext('webgl'); // Initialize WebGL context
    if (!gl) {
      console.error('WebGL not supported in this browser.');
      return;
    }
    //failed attempt
    // Set a default black background for the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
//
    console.log('Canvas and WebGL context initialized.');

    // Fetch the WASM file
    console.log('Fetching WASM...');
    const response = await fetch(wasmFile);
    if (!response.ok) throw new Error('Failed to load WASM file');
    console.log('WASM file fetched successfully.');

    // Load and instantiate the WASM module
    const buffer = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer);
    console.log('WASM instantiated:', instance);

    // Debug: List available exports in the WASM module
    console.log('Available WASM exports:', instance.exports);

    // Check if the WASM exports necessary functions (e.g., init, main, render)
    if (instance.exports.init) {
      console.log('Initializing WebGL in WASM...');
      instance.exports.init(); // Call an `init` function if available
    } else {
      console.warn('No `init` function found in WASM to initialize WebGL.');
    }

    if (instance.exports.main) {
      console.log('Running the game...');
      instance.exports.main(); // Call the main game loop function
    } else {
      console.error('No exported `main` function found in the WASM file.');
    }
  } catch (error) {
    console.error('Error loading or running WASM file:', error);
  }
});
