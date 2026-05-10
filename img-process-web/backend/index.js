const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.post('/api/process', upload.single('image'), async (req, res) => {
  try {
    console.log('Received request');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('File received:', req.file.originalname, req.file.size);

    const { 
      brightness, 
      contrast, 
      saturation, 
      watermarkText,
      watermarkSize,
      watermarkColor,
      format,
      quality 
    } = req.body;

    let image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    console.log('Image metadata:', metadata.width, 'x', metadata.height);

    const brightnessValue = brightness ? parseFloat(brightness) : 1;
    const contrastValue = contrast ? parseFloat(contrast) : 1;
    const saturationValue = saturation ? parseFloat(saturation) : 1;

    console.log('Adjustments:', { brightnessValue, contrastValue, saturationValue });

    if (brightnessValue !== 1 || saturationValue !== 1) {
      image = image.modulate({
        brightness: brightnessValue,
        saturation: saturationValue
      });
    }

    if (contrastValue !== 1) {
      image = image.linear(contrastValue, -(128 * (contrastValue - 1)));
    }

    if (watermarkText) {
      console.log('Adding watermark:', watermarkText);
      const size = parseInt(watermarkSize) || 32;
      const color = watermarkColor || '#ffffff';

      const currentMeta = await image.metadata();
      const width = currentMeta.width;
      const height = currentMeta.height;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>
          .watermark {
            font: bold ${size}px Arial, sans-serif;
            fill: ${color};
            opacity: 0.7;
          }
        </style>
        <text x="50%" y="50%" class="watermark" 
          dominant-baseline="middle" 
          text-anchor="middle"
          transform="rotate(-30, ${width/2}, ${height/2})">
          ${watermarkText}
        </text>
      </svg>`;

      image = image.composite([{
        input: Buffer.from(svg),
        gravity: 'center'
      }]);
    }

    const outputFormat = format || 'jpeg';
    const qualityValue = quality ? parseInt(quality) : 80;

    console.log('Output format:', outputFormat, 'quality:', qualityValue);

    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      image = image.jpeg({ quality: qualityValue });
    } else if (outputFormat === 'png') {
      image = image.png({ quality: qualityValue });
    } else if (outputFormat === 'webp') {
      image = image.webp({ quality: qualityValue });
    }

    const outputBuffer = await image.toBuffer();
    console.log('Output buffer size:', outputBuffer.length);

    res.set('Content-Type', `image/${outputFormat}`);
    res.set('Content-Disposition', `attachment; filename="processed.${outputFormat}"`);
    res.set('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(outputBuffer);
    
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
