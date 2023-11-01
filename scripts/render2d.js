// Define a shape including methods to update it, if inputs are blank defaults to a set shape
class Shape {
    constructor(verts,pos,col) {
        this.verts = parseVerts(verts) || [[-0.5,-0.5],[0.5,-0.5],[0.0,0.5]];
        this.pos = parsePos(pos) || [0.0,0.0];
        this.col = parseColor(col) || [1.0,0.0,0.0];
    }

    updateVerts(vertsIn){
        this.verts = parseVerts(vertsIn);
    }

    updatePos(posIn){
        this.pos = parsePos(posIn);
    }

    updateCol(colIn){
        this.col = parseCol(colIn);
    }
}

//Get the canvas element
const canvas = document.getElementById("webgl-canvas");

//Initialize the WebGL context
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL is not supported in this browser.");
}

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
        gl_FragColor = vec4(uColor, 1.0)
    }
`;

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

    //compile the fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSource);
    gl.compileShader(fragmentShader);

    //check for success
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment shader compilation error: " + gl.getShaderInfoLog(fragmentShader));
    }

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

    return shaderProgram;
}

const Shape = new Shape();
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

//handle errors
if (!shaderProgram) {
    console.error("Error creating shader program.");
} else {
    //get attributes and uniform locations
    const positionAttributeLocation = gl.getAttributeLocation(shaderProgram, "aPosition");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "uResolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");

    //create buffer for shape vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
}

// Set the clear color and clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

