class Snowflake {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.shapes = ['snowflake1', 'snowflake2', 'snowflake3', 'snowflake4', 'snowflake5', 'snowflake6'];
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * -this.canvas.height;
        this.size = this.config.size * (0.5 + Math.random() * 0.5);
        this.speed = this.config.speed * (0.5 + Math.random() * 0.5);
        this.opacity = 0.4 + Math.random() * 0.6;
        this.sway = Math.random() * 3 - 1.5;
        this.swaySpeed = 0.008 + Math.random() * 0.02;
        this.swayOffset = Math.random() * Math.PI * 2;
        
        if (this.config.shape && this.config.shape !== 'random') {
            this.shape = this.config.shape;
        } else {
            this.shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        }
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.015;
    }

    update() {
        this.y += this.speed;
        this.swayOffset += this.swaySpeed;
        this.x += Math.sin(this.swayOffset) * this.sway;
        this.rotation += this.rotationSpeed;

        if (this.y > this.canvas.height + this.size || 
            this.x < -this.size * 2 || 
            this.x > this.canvas.width + this.size * 2) {
            this.reset();
            this.y = -this.size * 2;
        }
    }

    draw(ctx, isNightMode) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (isNightMode) {
            ctx.shadowColor = 'rgba(200, 220, 255)';
            ctx.shadowBlur = this.size * 0.5;
        } else {
            ctx.shadowColor = 'rgba(255, 255, 255)';
            ctx.shadowBlur = this.size * 0.3;
        }

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = Math.max(1, this.size * 0.08);

        switch (this.shape) {
            case 'snowflake1':
                this.drawSnowflake1(ctx);
                break;
            case 'snowflake2':
                this.drawSnowflake2(ctx);
                break;
            case 'snowflake3':
                this.drawSnowflake3(ctx);
                break;
            case 'snowflake4':
                this.drawSnowflake4(ctx);
                break;
            case 'snowflake5':
                this.drawSnowflake5(ctx);
                break;
            case 'snowflake6':
                this.drawSnowflake6(ctx);
                break;
            default:
                this.drawSnowflake1(ctx);
        }

        ctx.restore();
    }

    drawSnowflake1(ctx) {
        const s = this.size;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        }
        ctx.stroke();

        this.drawCircle(ctx, 0, 0, s * 0.15);
        this.drawCircle(ctx, 0, -s * 0.7, s * 0.1);
        this.drawCircle(ctx, 0, s * 0.7, s * 0.1);
        this.drawCircle(ctx, -s * 0.7, 0, s * 0.1);
        this.drawCircle(ctx, s * 0.7, 0, s * 0.1);
        this.drawCircle(ctx, -s * 0.5, -s * 0.5, s * 0.08);
        this.drawCircle(ctx, s * 0.5, -s * 0.5, s * 0.08);
        this.drawCircle(ctx, -s * 0.5, s * 0.5, s * 0.08);
        this.drawCircle(ctx, s * 0.5, s * 0.5, s * 0.08);
    }

    drawSnowflake2(ctx) {
        const s = this.size;
        ctx.lineWidth = Math.max(1, s * 0.1);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * s * 0.9, Math.sin(angle) * s * 0.9);
        }
        ctx.stroke();

        ctx.lineWidth = Math.max(1, s * 0.05);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * s * 0.35;
            const y = Math.sin(angle) * s * 0.35;
            ctx.moveTo(x - Math.cos(angle + 0.5) * s * 0.15, y - Math.sin(angle + 0.5) * s * 0.15);
            ctx.lineTo(x, y);
            ctx.lineTo(x - Math.cos(angle - 0.5) * s * 0.15, y - Math.sin(angle - 0.5) * s * 0.15);
        }
        ctx.fill();
    }

    drawSnowflake3(ctx) {
        const s = this.size;
        ctx.lineWidth = Math.max(1, s * 0.08);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(Math.cos(angle) * s * 0.1, Math.sin(angle) * s * 0.1);
            ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(Math.cos(angle) * s * 0.8, Math.sin(angle) * s * 0.8);
            ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
            ctx.lineTo(Math.cos(angle + 0.3) * s * 0.85, Math.sin(angle + 0.3) * s * 0.85);
        }
        ctx.fill();

        this.drawCircle(ctx, 0, 0, s * 0.15);
    }

    drawSnowflake4(ctx) {
        const s = this.size;
        ctx.lineWidth = Math.max(1, s * 0.08);
        
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.save();
            ctx.rotate(angle);
            
            ctx.fillRect(-s * 0.05, -s, s * 0.1, s * 2);
            
            ctx.save();
            ctx.translate(0, -s * 0.6);
            ctx.rotate(-0.5);
            ctx.fillRect(-s * 0.04, -s * 0.25, s * 0.08, s * 0.25);
            ctx.restore();
            
            ctx.save();
            ctx.translate(0, -s * 0.6);
            ctx.rotate(0.5);
            ctx.fillRect(-s * 0.04, -s * 0.25, s * 0.08, s * 0.25);
            ctx.restore();
            
            ctx.save();
            ctx.translate(0, s * 0.6);
            ctx.rotate(-0.5);
            ctx.fillRect(-s * 0.04, 0, s * 0.08, s * 0.25);
            ctx.restore();
            
            ctx.save();
            ctx.translate(0, s * 0.6);
            ctx.rotate(0.5);
            ctx.fillRect(-s * 0.04, 0, s * 0.08, s * 0.25);
            ctx.restore();
            
            ctx.restore();
        }

        this.drawCircle(ctx, 0, 0, s * 0.18);
    }

    drawSnowflake5(ctx) {
        const s = this.size;
        ctx.lineWidth = Math.max(1, s * 0.1);
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(Math.cos(angle) * s * 0.15, Math.sin(angle) * s * 0.15);
            ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        }
        ctx.stroke();

        ctx.lineWidth = Math.max(1, s * 0.08);
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * s * 0.8;
            const y = Math.sin(angle) * s * 0.8;
            ctx.beginPath();
            ctx.moveTo(x - Math.cos(angle) * s * 0.1, y - Math.sin(angle) * s * 0.1);
            ctx.lineTo(x + Math.cos(angle) * s * 0.1, y + Math.sin(angle) * s * 0.1);
            ctx.stroke();
        }

        this.drawCircle(ctx, 0, 0, s * 0.16);
    }

    drawSnowflake6(ctx) {
        const s = this.size;
        ctx.lineWidth = Math.max(1, s * 0.06);

        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.save();
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(-s * 0.08, -s * 0.7);
            ctx.lineTo(s * 0.08, -s * 0.7);
            ctx.lineTo(s * 0.12, -s * 0.5);
            ctx.lineTo(-s * 0.12, -s * 0.5);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-s * 0.12, -s * 0.5);
            ctx.lineTo(s * 0.12, -s * 0.5);
            ctx.lineTo(s * 0.1, 0);
            ctx.lineTo(-s * 0.1, 0);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-s * 0.1, 0);
            ctx.lineTo(s * 0.1, 0);
            ctx.lineTo(s * 0.12, s * 0.5);
            ctx.lineTo(-s * 0.12, s * 0.5);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-s * 0.12, s * 0.5);
            ctx.lineTo(s * 0.12, s * 0.5);
            ctx.lineTo(s * 0.08, s * 0.7);
            ctx.lineTo(-s * 0.08, s * 0.7);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        this.drawCircle(ctx, 0, 0, s * 0.2);
    }

    drawCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.size = this.config.size * (0.5 + Math.random() * 0.5);
        this.speed = this.config.speed * (0.5 + Math.random() * 0.5);
        
        if (this.config.shape && this.config.shape !== 'random') {
            this.shape = this.config.shape;
        }
    }
}

export default Snowflake;
