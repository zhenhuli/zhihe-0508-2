import Snowflake from './Snowflake.js';

class SnowFall {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.isNightMode = false;
        this.config = {
            size: 5,
            density: 150,
            speed: 2
        };
        this.animationId = null;

        this.init();
        this.bindEvents();
    }

    init() {
        this.resize();
        this.createSnowflakes();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.snowflakes.forEach(flake => {
            flake.canvas = this.canvas;
            if (flake.x > this.canvas.width) {
                flake.x = Math.random() * this.canvas.width;
            }
        });
    }

    createSnowflakes() {
        while (this.snowflakes.length < this.config.density) {
            const flake = new Snowflake(this.canvas, { ...this.config });
            flake.y = Math.random() * this.canvas.height;
            this.snowflakes.push(flake);
        }
    }

    updateDensity(newDensity) {
        this.config.density = newDensity;
        
        if (this.snowflakes.length < newDensity) {
            while (this.snowflakes.length < newDensity) {
                this.snowflakes.push(new Snowflake(this.canvas, { ...this.config }));
            }
        } else if (this.snowflakes.length > newDensity) {
            this.snowflakes = this.snowflakes.slice(0, newDensity);
        }
    }

    updateSize(newSize) {
        this.config.size = newSize;
        this.snowflakes.forEach(flake => {
            flake.updateConfig({ size: newSize });
        });
    }

    updateSpeed(newSpeed) {
        this.config.speed = newSpeed;
        this.snowflakes.forEach(flake => {
            flake.updateConfig({ speed: newSpeed });
        });
    }

    updateShape(shapeType) {
        this.config.shape = shapeType;
        this.snowflakes.forEach(flake => {
            flake.config.shape = shapeType;
            if (shapeType === 'random') {
                flake.shape = flake.shapes[Math.floor(Math.random() * flake.shapes.length)];
            } else {
                flake.shape = shapeType;
            }
        });
    }

    toggleNightMode() {
        this.isNightMode = !this.isNightMode;
        document.body.classList.toggle('night-mode', this.isNightMode);
        document.body.classList.toggle('day-mode', !this.isNightMode);
        return this.isNightMode;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snowflakes.forEach(flake => {
            flake.update();
            flake.draw(this.ctx, this.isNightMode);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

export default SnowFall;
