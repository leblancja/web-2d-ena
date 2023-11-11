
//Get the canvas element
const canvas = document.getElementById("webgl-canvas");

//Initialize the WebGL context
const gl = canvas.getContext("webgl");

if (!gl) {
console.error("WebGL is not supported in this browser.");
}
console.log("Canvas dimensions: "+ canvas.width + "," + canvas.height);
//Set the clear color of the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let positionBuffer;

// Define a shape including methods to update it, if inputs are blank defaults to a set shape
class Shape {
    constructor(verts,pos,col) {
        this.verts = verts || [[-0.5,-0.5],[0.5,-0.5],[0.0,0.5]];
        this.pos = pos || [0.0,0.0];
        this.col = col || [1.0,0.0,0.0];
    }
}




/*
// Parse color input
function parseColor() {
    const colorInput = document.getElementById("color-input");
    if (!colorInput) {
        console.error("Color input element not found.");
        return null;
    }
    
    let col = colorInput.value.trim();
    
    if (!col) {
        return null;
    }
    
    if (!col.startsWith('#')) {
        let tempElem = document.createElement('div');
        tempElem.style.color = col;
        col = window.getComputedStyle(tempElem, null).getPropertyValue('color');
    }
    
    if (col.startsWith('#')) {
        let bigint = parseInt(col.slice(1), 16);
        let r = ((bigint >> 16) & 255) / 255;
        let g = ((bigint >> 8) & 255) / 255;
        let b = (bigint & 255) / 255;
        return [r, g, b];
    }
    
    let rgb = col.match(/\d+/g);
    return rgb.map(x => parseInt(x) / 255);
}

// Parse position input
function parsePos() {
    const posInput = document.getElementById("position-input");
    if (!posInput) {
        console.error("Position input element not found.");
        return null;
    }
    
    const pos = posInput.value.trim();
    
    if (!pos) {
        return null;
    }
    
    return pos.split(',').map(x => parseFloat(x));
}

// Parse vertices input
function parseVerts() {
    const vertsInput = document.getElementById("vertices-input");
    if (!vertsInput) {
        console.error("Vertices input element not found.");
        return null;
    }
    
    const verts = vertsInput.value.trim();
    
    if (!verts) {
        return null;
    }
    
    return verts.split(' ').map(x => x.split(',').map(y => parseFloat(y)));
}
*/

//vertex shader
const vertexShaderSource = `
attribute vec2 aPosition;
uniform vec2 uResolution;

void main() {
    vec2 clipSpace = ((aPosition / uResolution) * 2.0) - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
}
`;

//fragment shader
const fragmentShaderSource = `
precision mediump float;
uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 1.0);
}
`;
    
//Create the shader program
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

//handle errors
if (!shaderProgram) {
    console.error("Error creating shader program.");
} else {
    //get attributes and uniform locations

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aPosition");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "uResolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
    console.log("Shader program created successfully");
    
}


//compiling and linking the shaders to a shader program
function createShaderProgram(gl,vertexShaderSource,fragmentShaderSource) {

    //compile the vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexShaderSource);
    gl.compileShader(vertexShader);

    //check for success
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex shader compilation error: " + gl.getShaderInfoLog(vertexShader));
        return null;
    }
    console.log("vertex shader compiled: "+gl.COMPILE_STATUS);
    //compile the fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSource);
    gl.compileShader(fragmentShader);

    //check for success
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment shader compilation error: " + gl.getShaderInfoLog(fragmentShader));
    }
    console.log("vertex shader compiled: "+gl.COMPILE_STATUS);
    //create shader program and attach the shaders
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    //link the program
    gl.linkProgram(shaderProgram);

    //check for success
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader program link error: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    console.log("program linked: "+gl.LINK_STATUS);
    return shaderProgram;
}

function setBufferData(shape, positionBuffer) {

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    const vertices = shape.verts.flat();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Pass the vertex positions to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Specify how to interpret the vertex data
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Set other attributes and uniforms, if needed
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "uResolution");
    console.log("passing w,h of "+canvas.width+","+canvas.height);
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
    gl.uniform3fv(colorUniformLocation, shape.col);
    
    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
}

function render(gl, shapes) {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Loop over the shapes and draw each one
    for (let shape of shapes) {
        gl.useProgram(shaderProgram);
        setBufferData(shape, positionBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, shape.verts.length);
    }
}

let shapes = [];
let tri = new Shape();
shapes.push(tri);
render(gl,shapes);

/*
// Add an event listener to the button
document.getElementById("add-button").addEventListener("click", function() {
    // Parse the inputs and create a new shape
    let shape = new Shape(parseVerts(),parsePos(),parseColor());
    console.log("Created shape with data: "+shape.verts+" "+shape.pos+" "+shape.col);
    // Add the shape to the array
    console.log("Array len before push: "+shapes.length);
    shapes.push(shape);
    console.log("Array len after push:"+shapes.length )

    // Render all shapes
    render(gl, shapes);
});
*/










