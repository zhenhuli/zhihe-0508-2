import SnowFall from './SnowFall.js';

class App {
    constructor() {
        this.snowFall = new SnowFall('snowCanvas');
        this.initElements();
        this.bindEvents();
        document.body.classList.add('day-mode');
    }

    initElements() {
        this.toggleBtn = document.getElementById('toggleBtn');
        this.controls = document.getElementById('controls');
        
        this.sizeSlider = document.getElementById('sizeSlider');
        this.sizeValue = document.getElementById('sizeValue');
        
        this.densitySlider = document.getElementById('densitySlider');
        this.densityValue = document.getElementById('densityValue');
        
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        
        this.shapeSelect = document.getElementById('shapeSelect');
        
        this.nightModeBtn = document.getElementById('nightModeBtn');
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', () => {
            this.controls.classList.toggle('show');
        });

        this.sizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.sizeValue.textContent = value;
            this.snowFall.updateSize(value);
        });

        this.densitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.densityValue.textContent = value;
            this.snowFall.updateDensity(value);
        });

        this.speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.speedValue.textContent = value;
            this.snowFall.updateSpeed(value);
        });

        this.shapeSelect.addEventListener('change', (e) => {
            this.snowFall.updateShape(e.target.value);
        });

        this.nightModeBtn.addEventListener('click', () => {
            const isNightMode = this.snowFall.toggleNightMode();
            this.nightModeBtn.textContent = isNightMode ? '关闭' : '开启';
            this.nightModeBtn.classList.toggle('active', isNightMode);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
