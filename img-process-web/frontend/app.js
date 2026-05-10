const API_URL = 'http://localhost:3001/api/process';

class ImageProcessor {
    constructor() {
        this.originalImage = null;
        this.currentImage = null;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.displayScale = 1;
        this.cropArea = null;
        this.dragState = null;
        this.cropSettings = { x: 0, y: 0, width: 0, height: 0 };
        
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.imageInput = document.getElementById('imageInput');
        this.controls = document.getElementById('controls');
        this.previewContainer = document.getElementById('previewContainer');
        this.loading = document.getElementById('loading');
        this.processBtn = document.getElementById('processBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.applyCropBtn = document.getElementById('applyCrop');
        this.cropMode = document.getElementById('cropMode');
        this.brightness = document.getElementById('brightness');
        this.contrast = document.getElementById('contrast');
        this.saturation = document.getElementById('saturation');
        this.watermarkText = document.getElementById('watermarkText');
        this.watermarkSize = document.getElementById('watermarkSize');
        this.watermarkColor = document.getElementById('watermarkColor');
        this.outputFormat = document.getElementById('outputFormat');
        this.quality = document.getElementById('quality');
    }

    bindEvents() {
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.processBtn.addEventListener('click', () => this.processAndDownload());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.applyCropBtn.addEventListener('click', () => this.applyCrop());
        this.cropMode.addEventListener('change', () => this.updateCropArea());
        
        ['brightness', 'contrast', 'saturation', 'quality'].forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                const span = document.getElementById(id + 'Value');
                span.textContent = id === 'quality' ? el.value : parseFloat(el.value).toFixed(1);
                this.applyPreviewFilters();
            });
        });
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.imageWidth = img.width;
                this.imageHeight = img.height;
                this.renderPreview();
                this.controls.style.display = 'block';
                this.resetControls();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    renderPreview() {
        this.previewContainer.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'crop-wrapper';
        
        const img = document.createElement('img');
        img.src = this.currentImage.src;
        img.id = 'previewImage';
        
        img.onload = () => {
            this.displayScale = this.imageWidth / img.offsetWidth;
            this.initCropArea();
            this.applyPreviewFilters();
        };
        
        wrapper.appendChild(img);
        this.previewContainer.appendChild(wrapper);
    }

    initCropArea() {
        const img = document.getElementById('previewImage');
        if (!img) return;

        const displayWidth = img.offsetWidth;
        const displayHeight = img.offsetHeight;
        this.displayScale = this.imageWidth / displayWidth;

        this.cropSettings = {
            x: 0,
            y: 0,
            width: this.imageWidth,
            height: this.imageHeight
        };

        this.createCropUI(displayWidth, displayHeight);
    }

    createCropUI(displayWidth, displayHeight) {
        const existingCrop = document.querySelector('.crop-area');
        if (existingCrop) existingCrop.remove();

        const wrapper = document.querySelector('.crop-wrapper');
        
        const cropArea = document.createElement('div');
        cropArea.className = 'crop-area';
        cropArea.style.left = '0px';
        cropArea.style.top = '0px';
        cropArea.style.width = displayWidth + 'px';
        cropArea.style.height = displayHeight + 'px';

        const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
        handles.forEach(h => {
            const handle = document.createElement('div');
            handle.className = `crop-handle ${h}`;
            handle.dataset.handle = h;
            handle.addEventListener('mousedown', (e) => this.startDrag(e, 'resize', h));
            cropArea.appendChild(handle);
        });

        cropArea.addEventListener('mousedown', (e) => {
            if (e.target === cropArea || e.target.classList.contains('crop-area')) {
                this.startDrag(e, 'move');
            }
        });

        wrapper.appendChild(cropArea);
        this.cropArea = cropArea;
    }

    startDrag(e, type, handle = null) {
        e.preventDefault();
        this.dragState = {
            type,
            handle,
            startX: e.clientX,
            startY: e.clientY,
            initialRect: this.cropArea.getBoundingClientRect(),
            imgRect: document.getElementById('previewImage').getBoundingClientRect()
        };

        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    handleDrag = (e) => {
        if (!this.dragState) return;

        const dx = e.clientX - this.dragState.startX;
        const dy = e.clientY - this.dragState.startY;
        const { initialRect, imgRect } = this.dragState;

        if (this.dragState.type === 'move') {
            let newLeft = initialRect.left - imgRect.left + dx;
            let newTop = initialRect.top - imgRect.top + dy;

            newLeft = Math.max(0, Math.min(newLeft, imgRect.width - initialRect.width));
            newTop = Math.max(0, Math.min(newTop, imgRect.height - initialRect.height));

            this.cropArea.style.left = newLeft + 'px';
            this.cropArea.style.top = newTop + 'px';
        } else {
            this.resizeCrop(dx, dy);
        }
    }

    resizeCrop(dx, dy) {
        const { initialRect, imgRect } = this.dragState;
        const handle = this.dragState.handle;
        
        let left = initialRect.left - imgRect.left;
        let top = initialRect.top - imgRect.top;
        let width = initialRect.width;
        let height = initialRect.height;
        
        const ratio = this.getAspectRatio();

        switch (handle) {
            case 'e':
                width = Math.max(50, Math.min(width + dx, imgRect.width - left));
                break;
            case 'w':
                const newWidthW = Math.max(50, width - dx);
                const diffW = width - newWidthW;
                left = Math.max(0, left + diffW);
                width = newWidthW;
                break;
            case 's':
                height = Math.max(50, Math.min(height + dy, imgRect.height - top));
                break;
            case 'n':
                const newHeightN = Math.max(50, height - dy);
                const diffN = height - newHeightN;
                top = Math.max(0, top + diffN);
                height = newHeightN;
                break;
            case 'se':
                if (ratio) {
                    width = Math.max(50, width + dx);
                    height = width / ratio;
                } else {
                    width = Math.max(50, width + dx);
                    height = Math.max(50, height + dy);
                }
                break;
            case 'sw':
                if (ratio) {
                    width = Math.max(50, width - dx);
                    height = width / ratio;
                } else {
                    width = Math.max(50, width - dx);
                    height = Math.max(50, height + dy);
                }
                break;
            case 'ne':
                if (ratio) {
                    width = Math.max(50, width + dx);
                    height = width / ratio;
                } else {
                    width = Math.max(50, width + dx);
                    height = Math.max(50, height - dy);
                }
                break;
            case 'nw':
                if (ratio) {
                    width = Math.max(50, width - dx);
                    height = width / ratio;
                } else {
                    width = Math.max(50, width - dx);
                    height = Math.max(50, height - dy);
                }
                break;
        }

        width = Math.min(width, imgRect.width - left);
        height = Math.min(height, imgRect.height - top);

        this.cropArea.style.left = left + 'px';
        this.cropArea.style.top = top + 'px';
        this.cropArea.style.width = width + 'px';
        this.cropArea.style.height = height + 'px';
    }

    stopDrag = () => {
        this.dragState = null;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    }

    getAspectRatio() {
        const mode = this.cropMode.value;
        if (mode === 'free') return null;
        const [w, h] = mode.split(':').map(Number);
        return w / h;
    }

    updateCropArea() {
        const ratio = this.getAspectRatio();
        if (!ratio) return;

        const img = document.getElementById('previewImage');
        const displayWidth = img.offsetWidth;
        const displayHeight = img.offsetHeight;
        const imgRatio = displayWidth / displayHeight;

        let newWidth, newHeight;
        if (ratio > imgRatio) {
            newWidth = displayWidth;
            newHeight = newWidth / ratio;
        } else {
            newHeight = displayHeight;
            newWidth = newHeight * ratio;
        }

        if (this.cropArea) {
            this.cropArea.style.width = newWidth + 'px';
            this.cropArea.style.height = newHeight + 'px';
            this.cropArea.style.left = ((displayWidth - newWidth) / 2) + 'px';
            this.cropArea.style.top = ((displayHeight - newHeight) / 2) + 'px';
        }
    }

    applyCrop() {
        if (!this.cropArea) return;

        const img = document.getElementById('previewImage');
        const imgRect = img.getBoundingClientRect();
        const cropRect = this.cropArea.getBoundingClientRect();

        const left = cropRect.left - imgRect.left;
        const top = cropRect.top - imgRect.top;
        const width = cropRect.width;
        const height = cropRect.height;

        this.cropSettings = {
            x: Math.round(left * this.displayScale),
            y: Math.round(top * this.displayScale),
            width: Math.round(width * this.displayScale),
            height: Math.round(height * this.displayScale)
        };

        const canvas = document.createElement('canvas');
        canvas.width = this.cropSettings.width;
        canvas.height = this.cropSettings.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            this.currentImage,
            this.cropSettings.x,
            this.cropSettings.y,
            this.cropSettings.width,
            this.cropSettings.height,
            0,
            0,
            this.cropSettings.width,
            this.cropSettings.height
        );

        const croppedImg = new Image();
        croppedImg.onload = () => {
            this.currentImage = croppedImg;
            this.imageWidth = this.cropSettings.width;
            this.imageHeight = this.cropSettings.height;
            this.cropSettings = { x: 0, y: 0, width: this.imageWidth, height: this.imageHeight };
            this.renderPreview();
        };
        croppedImg.src = canvas.toDataURL();
    }

    applyPreviewFilters() {
        const img = document.getElementById('previewImage');
        if (!img) return;

        const brightness = this.brightness.value;
        const contrast = this.contrast.value;
        const saturation = this.saturation.value;

        img.style.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
    }

    getCurrentCropSettings() {
        if (!this.cropArea) return null;

        const img = document.getElementById('previewImage');
        const imgRect = img.getBoundingClientRect();
        const cropRect = this.cropArea.getBoundingClientRect();

        let left = cropRect.left - imgRect.left;
        let top = cropRect.top - imgRect.top;
        let width = cropRect.width;
        let height = cropRect.height;

        const imgDisplayWidth = imgRect.width;
        const imgDisplayHeight = imgRect.height;

        left = Math.max(0, Math.min(left, imgDisplayWidth - 1));
        top = Math.max(0, Math.min(top, imgDisplayHeight - 1));
        width = Math.max(1, Math.min(width, imgDisplayWidth - left));
        height = Math.max(1, Math.min(height, imgDisplayHeight - top));

        let settings = {
            x: Math.max(0, Math.round(left * this.displayScale)),
            y: Math.max(0, Math.round(top * this.displayScale)),
            width: Math.max(1, Math.round(width * this.displayScale)),
            height: Math.max(1, Math.round(height * this.displayScale))
        };

        settings.width = Math.min(settings.width, this.imageWidth - settings.x);
        settings.height = Math.min(settings.height, this.imageHeight - settings.y);

        if (settings.x === 0 && settings.y === 0 && 
            settings.width >= this.imageWidth - 2 && 
            settings.height >= this.imageHeight - 2) {
            return null;
        }

        return settings;
    }

    async processAndDownload() {
        console.log('Starting process...');
        this.showLoading(true);

        try {
            const cropSettings = this.getCurrentCropSettings();
            
            let imageToProcess = this.currentImage;
            let processWidth = this.imageWidth;
            let processHeight = this.imageHeight;

            if (cropSettings) {
                console.log('Applying crop:', cropSettings);
                
                const cropCanvas = document.createElement('canvas');
                cropCanvas.width = cropSettings.width;
                cropCanvas.height = cropSettings.height;
                const cropCtx = cropCanvas.getContext('2d');
                cropCtx.drawImage(
                    this.currentImage,
                    cropSettings.x,
                    cropSettings.y,
                    cropSettings.width,
                    cropSettings.height,
                    0,
                    0,
                    cropSettings.width,
                    cropSettings.height
                );

                const croppedImg = new Image();
                await new Promise((resolve) => {
                    croppedImg.onload = resolve;
                    croppedImg.src = cropCanvas.toDataURL();
                });

                imageToProcess = croppedImg;
                processWidth = cropSettings.width;
                processHeight = cropSettings.height;
                console.log('Cropped image:', processWidth, 'x', processHeight);
            }

            const canvas = document.createElement('canvas');
            canvas.width = processWidth;
            canvas.height = processHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageToProcess, 0, 0);
            
            const dataUrl = canvas.toDataURL('image/png');
            const blob = await this.dataURLtoBlob(dataUrl);
            const file = new File([blob], 'image.png', { type: 'image/png' });

            console.log('Image prepared:', file.size, 'bytes');

            const formData = new FormData();
            formData.append('image', file);
            formData.append('brightness', this.brightness.value);
            formData.append('contrast', this.contrast.value);
            formData.append('saturation', this.saturation.value);
            formData.append('format', this.outputFormat.value);
            formData.append('quality', this.quality.value);

            if (this.watermarkText.value.trim()) {
                formData.append('watermarkText', this.watermarkText.value);
                formData.append('watermarkSize', this.watermarkSize.value);
                formData.append('watermarkColor', this.watermarkColor.value);
            }

            console.log('Sending request to:', API_URL);
            console.log('Params:', {
                brightness: this.brightness.value,
                contrast: this.contrast.value,
                saturation: this.saturation.value,
                format: this.outputFormat.value,
                quality: this.quality.value,
                watermark: this.watermarkText.value
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = '处理失败';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                    console.error('Server error:', errorJson);
                } catch {
                    console.error('Server error:', errorText);
                }
                throw new Error(errorMsg);
            }

            const resultBlob = await response.blob();
            console.log('Result received:', resultBlob.size, 'bytes');

            const url = URL.createObjectURL(resultBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `processed_${Date.now()}.${this.outputFormat.value}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('Download complete!');
            alert('图片处理完成，已开始下载！');

        } catch (error) {
            console.error('Processing error:', error);
            alert('处理失败: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    showLoading(show) {
        this.loading.style.display = show ? 'flex' : 'none';
        this.processBtn.disabled = show;
    }

    resetControls() {
        this.brightness.value = 1;
        this.contrast.value = 1;
        this.saturation.value = 1;
        this.watermarkText.value = '';
        this.watermarkSize.value = 32;
        this.watermarkColor.value = '#ffffff';
        this.outputFormat.value = 'jpeg';
        this.quality.value = 80;
        this.cropMode.value = 'free';

        document.getElementById('brightnessValue').textContent = '1.0';
        document.getElementById('contrastValue').textContent = '1.0';
        document.getElementById('saturationValue').textContent = '1.0';
        document.getElementById('qualityValue').textContent = '80';
    }

    reset() {
        if (this.originalImage) {
            this.currentImage = this.originalImage;
            this.imageWidth = this.originalImage.width;
            this.imageHeight = this.originalImage.height;
            this.renderPreview();
            this.resetControls();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Image Processor initialized');
    new ImageProcessor();
});
