class Shape {
    constructor(verts,pos,col) {
        this.verts = parseVerts(verts) || [[-0.5,-0.5],[0.5,-0.5],[0.0,0.5]];
        this.pos = parsePos(pos)
    }
}


// Get the canvas element
const canvas = document.getElementById("webgl-canvas");

// Initialize the WebGL context
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL is not supported in this browser.");
}

// Set the clear color and clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Now, you can start rendering your graphics using WebGL functions
// Add your rendering code here