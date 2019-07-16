var world = document.getElementById('world');
var viewport = document.getElementById('viewport');
var xTravel = 1;
var zoom = 500;
var p = 0;
var worldXAngle = 0;
var worldYAngle = 0;
var maxClouds = 1;
var cloudCount = 0;

viewport.style.webkitPerspective = viewport.style.MozPerspective = viewport.style.oPerspective = p;

function generateClouds() {
    if (cloudCount < maxClouds) {
        new Cloud();
    }
    setTimeout(generateClouds, random(500, 15000));
}


function Cloud() {
    this.layers = [];
    this.pos = {
        x: 0,
        y: random(-256, 256),
        z: random(-256, 256)
    }
    this.cloud = this.create();
    this.created = Date.now();
    this.active = true;
    this.animate = this.animate.bind(this);
    this.directionOut = (random(0, 1) === 0);
    this.zoom = random(0, 3000);
    this.fps = {
        log: [],
        avarage: () => [0, ...this.fps.log].reduce((t, a) => t + a)/(1 + this.fps.log.length),
        previousPerformanceTime: null
    } 
    this.animate();
}
Cloud.prototype.expire = function() {
    this.active = false;
    this.cloud.classList.add('cloudBase--expired');
    setTimeout(() => {
    cancelAnimationFrame(this.animate);
    cloudCount--;
    world.removeChild(this.cloud);
    }, 500);
}
Cloud.prototype.updateFps = function() {
    if (this.fps.log.length < 21) {
        if (this.fps.previousPerformanceTime !== null) {
            const fps = (1 / ((performance.now() - this.fps.previousPerformanceTime) / 1000));
            this.fps.log.unshift(fps);
        }
        this.fps.previousPerformanceTime = performance.now();
    }
}
Cloud.prototype.animate = function() {
    if (this.fps.log.length === 20) {
        const fps = this.fps.avarage();
        if (fps < 50) {
            this.expire();
        }
        if (fps < 30) {
            maxClouds = 0;
        }
        else if (fps < 40) {
            maxClouds = 1;
        }
        else if (fps < 50) {
            maxClouds = 5;
        }
        else if (fps < 55) {
            maxClouds = 10;
        }
        else if (fps < 60) {
            maxClouds = 15;
        }
        else if (fps > 70) {
            maxClouds = 20;
        }
    }
    if (this.active === true) {
        this.dispersion();
        this.zoomInOut();
        this.movement();
        this.position();
        this.updateFps();
        requestAnimationFrame(this.animate);
    }
}
Cloud.prototype.zoomInOut = function() {
    if (this.directionOut ? this.zoom < 1 : this.zoom > 3000) {
        this.directionOut = !this.directionOut;
    }
    this.directionOut ? this.zoom-- : this.zoom++;
}
Cloud.prototype.movement = function() {
    if (this.active === true) {
        this.pos.x += xTravel;
        if (xTravel > 0 ? (this.pos.x * (1+(zoom/1000))) > window.innerWidth : this.pos.x < 0) {
            this.expire();
        }
    }
}
Cloud.prototype.dispersion = function() {
    for (let layer of this.layers) {
        layer.data.a += layer.data.speed;
        const t = `
            translateX(${layer.data.x}px)
            translateY(${layer.data.y}px)
            translateZ(${layer.data.z}px)
            rotateY(${-worldXAngle}deg)
            rotateX(${worldYAngle}deg)
            rotateZ(${layer.data.a}deg)
            scale( ${layer.data.s})
        `;
        layer.style.webkitTransform = layer.style.MozTransform = layer.style.oTransform = t;
    }
}
Cloud.prototype.position = function() {
    var t = `scale(${1+(this.zoom/1000)})
        translateX(${this.pos.x}px)
        translateY(${this.pos.y}px)
        translateZ(${this.pos.z}px)`;
    this.cloud.style.webkitTransform = this.cloud.style.MozTransform = this.cloud.style.oTransform = t;
}
Cloud.prototype.create = function() {
    var div = document.createElement('div');
    div.className = 'cloudBase cloudBase--'+(xTravel > 0 ? 'left' : 'right');
    world.appendChild(div);

    for (let j=0;j<5+random(0, 9);j++) {
        var cloud = document.createElement('img');
        cloud.style.opacity = 0;
        var src = 'cloud3.png';
        (function(img) {
            img.addEventListener('load', () => img.style.opacity = 0.8);
        })(cloud);
        cloud.setAttribute('src', src);
        cloud.className = 'cloudLayer';
        cloud.data = {
            x: random(-256, 256)*0.2,
            y: random(-256, 256)*0.2,
            z: random(-100, 100),
            a: random(0, 360),
            s: Math.random() + 0.25,
            speed: 0.1 * Math.random()
        };
        var t = `translateX(${cloud.data.x}px)
            translateY(${cloud.data.y}px)
            translateZ(${cloud.data.z}px)
            rotateZ(${cloud.data.a}deg)
            scale(${cloud.data.s})`;
        cloud.style.webkitTransform = cloud.style.MozTransform = cloud.style.oTransform = t;
        
        div.appendChild(cloud);
        this.layers.push(cloud);
    }
    cloudCount++;
    return div;
}

generateClouds();


window.addEventListener('mousewheel', onContainerMouseWheel);
window.addEventListener('DOMMouseScroll', onContainerMouseWheel);
window.addEventListener('click', onMouseMove);
//   window.addEventListener('touchmove', onMouseMove);

function onMouseMove(e) {
    var x = e.clientX || e.touches[0].clientX;
    var y = e.clientY || e.touches[0].clientY;

    worldYAngle = -(0.5 - (x / window.innerWidth)) * 180;
    worldXAngle = (0.5 - (y / window.innerHeight)) * 180;
    updateView();
    event.preventDefault();
}

function onContainerMouseWheel(e) {
    e = e ? e : window.event;
    zoom = zoom - (e.detail ? e.detail * -5 : e.wheelDelta / 8);
    updateView();
    e.preventDefault();
}


function updateView() {
    var t = `scale(${1 + (zoom/1000)})`;
    world.style.transform = world.style.webkitTransform = world.style.MozTransform = world.style.oTransform = t;
}
updateView();

function zoomInOut() {
    let directionOut = true;
    function run() {
        if (cloudCount === 0) {
            zoom = 0;
        }
        if (directionOut ? zoom < 1 : zoom > 3000) {
            directionOut = !directionOut;
        }
        directionOut ? zoom-- : zoom++;
        updateView();
        requestAnimationFrame(run);
    }
    run();
}

function random(min, max) {
    var maxium = max + 1 - min;
    var randomAbsoluteNumber = Math.floor(Math.random() * Math.floor(maxium));
    return randomAbsoluteNumber + min;
}