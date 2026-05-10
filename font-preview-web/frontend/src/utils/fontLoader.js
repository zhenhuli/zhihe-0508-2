const loadedFonts = new Set();

const getFontFormat = (ext) => {
  const formats = {
    '.ttf': 'truetype',
    '.otf': 'opentype',
    '.woff': 'woff',
    '.woff2': 'woff2'
  };
  return formats[ext.toLowerCase()] || 'truetype';
};

export const loadFont = async (fontId, url, ext) => {
  if (loadedFonts.has(fontId)) {
    return fontId;
  }

  const format = getFontFormat(ext);
  const styleElement = document.createElement('style');
  styleElement.id = `font-${fontId}`;
  styleElement.textContent = `
    @font-face {
      font-family: '${fontId}';
      src: url('${url}') format('${format}');
      font-weight: normal;
      font-style: normal;
    }
  `;
  document.head.appendChild(styleElement);

  try {
    const fontFace = new FontFace(fontId, `url('${url}') format('${format}')`);
    await fontFace.load();
    document.fonts.add(fontFace);
    loadedFonts.add(fontId);
    return fontId;
  } catch (error) {
    console.warn(`字体加载可能存在问题: ${fontId}`, error);
    return fontId;
  }
};

export const unloadFont = (fontId) => {
  const styleElement = document.getElementById(`font-${fontId}`);
  if (styleElement) {
    styleElement.remove();
  }
  loadedFonts.delete(fontId);
};

export const isFontLoaded = (fontId) => {
  return loadedFonts.has(fontId);
};

export const loadFonts = async (fonts) => {
  const promises = fonts.map(font => 
    loadFont(font.id, font.url, font.ext)
  );
  return Promise.all(promises);
};
