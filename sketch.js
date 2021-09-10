const PATH_LENGTH = 16;
const NUM_PATHS = 6;
const NUM_CUTS = 5;
const HORIZONTAL_CHANCE = 0.0;

var paths = [];
var time = 0;

var capturer = new CCapture({ format: 'png', framerate: 60});

function setup() {
    createCanvas(1920, 1080);
    createPaths();
}

function draw() {
    
    if (frameCount === 1)
        capturer.start();

    if (frameCount === 1200) {
        noLoop();
        capturer.stop();
        capturer.save();
    }
    
    background(205, 15, 40);
    drawPaths();
    fill(205, 15, 40)
    noStroke();

    capturer.capture(document.getElementById('defaultCanvas0'));
    time += deltaTime;
}

function Path(path, vertical) {
    return {
        path: path,
        vertical: vertical,
        rectanglePos: createVector(0, 0),
        rectangleSpeed: random(0.03, 0.08)
    }
}

function createPaths() {
    for (let i = 0; i < NUM_PATHS; ++i) {
        var vertical = random();
        var path = []
        path[0] = vertical > HORIZONTAL_CHANCE ? createVector(random(width), -200) : createVector(-200, random(height));
        for (let j = 1; j < PATH_LENGTH; ++j) {
            var widthRange = random(
                ((j / PATH_LENGTH) * width) + 20,
                (((j + 1) / PATH_LENGTH) * width) - 20
            );

            var heightRange = random(0, height);

            path[j] = vertical > HORIZONTAL_CHANCE ? createVector(heightRange, widthRange) : createVector(widthRange, heightRange);
        }
        path[PATH_LENGTH] = vertical > HORIZONTAL_CHANCE ? createVector(random(width), height + 200) : createVector(width + 200, random(height));

        for (let k = 0; k < random(NUM_CUTS - 4, NUM_CUTS); ++k)
            path = cornerCut(path);

        paths.push(Path(path, vertical));
    }

    paths.sort((a, b) => (a.rectangleSpeed > b.rectangleSpeed) ? 1 : -1);
}

function drawPaths() {
    for (let i = 0; i < NUM_PATHS; ++i) {
        var path = paths[i].path;
        for (let j = 0; j < path.length - 1; ++j) {
            stroke(41, 14, 14, map(i, 0, NUM_PATHS - 1, 50, 225));
            strokeWeight(map(cos((time + j * path[j].y) * 0.005), -1, 1, 1.0, 4.0));
            line(path[j].x, path[j].y, path[j + 1].x, path[j + 1].y);
            
            var rectPos = paths[i].rectanglePos;
            noStroke();
            rect(rectPos.x, rectPos.y, width, height);

            if (paths[i].vertical > HORIZONTAL_CHANCE)
                paths[i].rectanglePos.y = time * paths[i].rectangleSpeed;
            else
                paths[i].rectanglePos.x = time * paths[i].rectangleSpeed;
        }
    }
}

function cornerCut(path) {
    var newPath = []
    for (let i = 0; i < path.length - 1; ++i) {
        var p1 = path[i];
        var p2 = path[i + 1];

        newPath.push(createVector(p1.x * 0.75 + p2.x * 0.25, p1.y * 0.75 + p2.y * 0.25));
        newPath.push(createVector(p1.x * 0.25 + p2.x * 0.75, p1.y * 0.25 + p2.y * 0.75));
    }
    
    return newPath.slice();
}