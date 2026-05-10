const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const net = require('net');

const app = express();
const DEFAULT_PORT = 3099;
const PORT_RANGE_START = 3099;
const PORT_RANGE_END = 3199;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const FONT_RETENTION_HOURS = 72;
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
const PORT_CONFIG_FILE = path.join(__dirname, 'port-config.json');

app.use(cors());
app.use(express.json());

fs.ensureDirSync(UPLOAD_DIR);

const getUserUploadDir = (userId) => {
  return path.join(UPLOAD_DIR, userId);
};

const getUserInfoFile = (userId) => {
  return path.join(getUserUploadDir(userId), '.user-info.json');
};

const getFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

const loadUserInfo = async (userId) => {
  const infoFile = getUserInfoFile(userId);
  if (await fs.pathExists(infoFile)) {
    return await fs.readJson(infoFile);
  }
  return {
    userId,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    fonts: {}
  };
};

const saveUserInfo = async (userId, info) => {
  const infoFile = getUserInfoFile(userId);
  info.lastActiveAt = Date.now();
  await fs.writeJson(infoFile, info, { spaces: 2 });
};

const updateLastActive = async (userId) => {
  const info = await loadUserInfo(userId);
  await saveUserInfo(userId, info);
};

const isFontExpired = (fontInfo, currentTime) => {
  const expireTime = fontInfo.uploadedAt + (FONT_RETENTION_HOURS * 60 * 60 * 1000);
  return currentTime > expireTime;
};

const isUserExpired = (userInfo, currentTime) => {
  const expireTime = userInfo.lastActiveAt + (FONT_RETENTION_HOURS * 60 * 60 * 1000);
  return currentTime > expireTime;
};

const cleanupExpiredFonts = async () => {
  const currentTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting cleanup...`);

  try {
    if (!await fs.pathExists(UPLOAD_DIR)) return;

    const userDirs = await fs.readdir(UPLOAD_DIR);
    let deletedCount = 0;
    let clearedUsers = 0;

    for (const userId of userDirs) {
      const userDir = path.join(UPLOAD_DIR, userId);
      const stat = await fs.stat(userDir);
      
      if (!stat.isDirectory()) continue;

      try {
        const userInfo = await loadUserInfo(userId);
        
        if (isUserExpired(userInfo, currentTime)) {
          await fs.remove(userDir);
          clearedUsers++;
          console.log(`  User ${userId} expired and removed`);
          continue;
        }

        const fontIds = Object.keys(userInfo.fonts);
        let userDeleted = 0;

        for (const fontId of fontIds) {
          const fontInfo = userInfo.fonts[fontId];
          
          if (isFontExpired(fontInfo, currentTime)) {
            const fontPath = path.join(userDir, fontId);
            if (await fs.pathExists(fontPath)) {
              await fs.unlink(fontPath);
            }
            delete userInfo.fonts[fontId];
            userDeleted++;
            console.log(`  Font ${fontId} expired and removed`);
          }
        }

        if (userDeleted > 0) {
          await saveUserInfo(userId, userInfo);
          deletedCount += userDeleted;
        }
      } catch (err) {
        console.error(`  Error cleaning user ${userId}:`, err.message);
      }
    }

    console.log(`[${new Date().toISOString()}] Cleanup complete: ${deletedCount} fonts deleted, ${clearedUsers} users cleared`);
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};

setInterval(cleanupExpiredFonts, CLEANUP_INTERVAL_MS);
cleanupExpiredFonts();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return cb(new Error('缺少用户ID'));
    }
    const userDir = getUserUploadDir(userId);
    fs.ensureDirSync(userDir);
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${timestamp}_${name}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.ttf', '.otf', '.woff', '.woff2'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 TTF、OTF、WOFF、WOFF2 格式的字体文件'));
    }
  }
});

const requireUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: '缺少用户ID' });
  }
  req.userId = userId;
  next();
};

app.get('/uploads/:userId/:filename', async (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(getUserUploadDir(userId), filename);
  
  if (!await fs.pathExists(filePath)) {
    return res.status(404).json({ error: '文件不存在或已过期' });
  }
  
  const userInfo = await loadUserInfo(userId);
  const currentTime = Date.now();
  
  if (isUserExpired(userInfo, currentTime)) {
    await fs.remove(getUserUploadDir(userId));
    return res.status(404).json({ error: '用户会话已过期' });
  }
  
  if (userInfo.fonts[filename] && isFontExpired(userInfo.fonts[filename], currentTime)) {
    return res.status(404).json({ error: '字体已过期' });
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: '文件不存在' });
    }
  });
});

app.post('/api/check-duplicate', requireUserId, async (req, res) => {
  try {
    const { files } = req.body;
    const userId = req.userId;
    
    if (!files || files.length === 0) {
      return res.json({ duplicates: [] });
    }

    const userDir = getUserUploadDir(userId);
    if (!await fs.pathExists(userDir)) {
      return res.json({ duplicates: [] });
    }

    const userInfo = await loadUserInfo(userId);
    const currentTime = Date.now();
    const duplicates = [];

    for (const file of files) {
      const originalName = file.originalName;
      const size = file.size;
      
      const matchingFonts = [];
      for (const [fontId, fontInfo] of Object.entries(userInfo.fonts)) {
        if (isFontExpired(fontInfo, currentTime)) continue;
        if (fontInfo.size === size) {
          matchingFonts.push({
            id: fontId,
            originalName: fontInfo.originalName,
            size: fontInfo.size
          });
        }
      }

      if (matchingFonts.length > 0) {
        duplicates.push({
          originalName,
          size,
          matches: matchingFonts
        });
      }
    }

    await updateLastActive(userId);
    res.json({ duplicates });
  } catch (error) {
    console.error('检查重复错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', requireUserId, upload.array('fonts', 20), async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const userDir = getUserUploadDir(userId);
    fs.ensureDirSync(userDir);
    
    const userInfo = await loadUserInfo(userId);
    const uploadedFonts = [];
    const duplicates = [];

    for (const file of req.files) {
      const fileHash = await getFileHash(file.path);
      
      const currentTime = Date.now();
      let isDuplicate = false;
      for (const fontInfo of Object.values(userInfo.fonts)) {
        if (isFontExpired(fontInfo, currentTime)) continue;
        if (fontInfo.hash === fileHash) {
          isDuplicate = true;
          duplicates.push(file.originalname);
          break;
        }
      }
      
      userInfo.fonts[file.filename] = {
        originalName: file.originalname,
        size: file.size,
        hash: fileHash,
        uploadedAt: currentTime
      };

      uploadedFonts.push({
        id: file.filename,
        name: path.basename(file.filename, path.extname(file.filename)),
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/${userId}/${file.filename}`,
        ext: path.extname(file.filename).toLowerCase(),
        isDuplicate
      });
    }

    await saveUserInfo(userId, userInfo);

    res.json({
      success: true,
      fonts: uploadedFonts.map(f => ({
        id: f.id,
        name: f.name,
        originalName: f.originalName,
        size: f.size,
        url: f.url,
        ext: f.ext
      })),
      duplicates: [...new Set(duplicates)]
    });
  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fonts', requireUserId, async (req, res) => {
  try {
    const userId = req.userId;
    const userDir = getUserUploadDir(userId);
    
    if (!await fs.pathExists(userDir)) {
      return res.json({ success: true, fonts: [] });
    }

    const userInfo = await loadUserInfo(userId);
    const currentTime = Date.now();
    const fonts = [];

    for (const [fontId, fontInfo] of Object.entries(userInfo.fonts)) {
      if (isFontExpired(fontInfo, currentTime)) continue;
      
      const fontPath = path.join(userDir, fontId);
      if (!await fs.pathExists(fontPath)) continue;

      fonts.push({
        id: fontId,
        name: path.basename(fontId, path.extname(fontId)),
        originalName: fontInfo.originalName,
        size: fontInfo.size,
        url: `/uploads/${userId}/${fontId}`,
        ext: path.extname(fontId).toLowerCase()
      });
    }

    await updateLastActive(userId);
    res.json({ success: true, fonts });
  } catch (error) {
    console.error('获取字体列表错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fonts/:id', requireUserId, async (req, res) => {
  try {
    const userId = req.userId;
    const fontId = req.params.id;
    const filePath = path.join(getUserUploadDir(userId), fontId);

    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: '字体不存在' });
    }

    await fs.unlink(filePath);
    
    const userInfo = await loadUserInfo(userId);
    delete userInfo.fonts[fontId];
    await saveUserInfo(userId, userInfo);
    
    res.json({ success: true, message: '字体已删除' });
  } catch (error) {
    console.error('删除字体错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fonts', requireUserId, async (req, res) => {
  try {
    const userId = req.userId;
    const userDir = getUserUploadDir(userId);
    
    if (await fs.pathExists(userDir)) {
      await fs.remove(userDir);
    }
    
    res.json({ success: true, message: '所有字体已清空' });
  } catch (error) {
    console.error('清空字体错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/session', requireUserId, async (req, res) => {
  try {
    const userId = req.userId;
    const userDir = getUserUploadDir(userId);
    const currentTime = Date.now();
    
    let userInfo;
    if (await fs.pathExists(userDir)) {
      userInfo = await loadUserInfo(userId);
    } else {
      userInfo = await loadUserInfo(userId);
      fs.ensureDirSync(userDir);
      await saveUserInfo(userId, userInfo);
    }

    const fontCount = Object.keys(userInfo.fonts).filter(id => 
      !isFontExpired(userInfo.fonts[id], currentTime)
    ).length;

    const expireAt = userInfo.lastActiveAt + (FONT_RETENTION_HOURS * 60 * 60 * 1000);

    res.json({
      success: true,
      userId,
      fontCount,
      createdAt: userInfo.createdAt,
      lastActiveAt: userInfo.lastActiveAt,
      expireAt,
      remainHours: Math.ceil((expireAt - currentTime) / (60 * 60 * 1000))
    });
  } catch (error) {
    console.error('获取会话信息错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    retentionHours: FONT_RETENTION_HOURS
  });
});

const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
};

const findAvailablePort = async (startPort, endPort) => {
  for (let port = startPort; port <= endPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`在 ${startPort}-${endPort} 范围内没有找到可用端口`);
};

const savePortConfig = async (port) => {
  try {
    await fs.writeJson(PORT_CONFIG_FILE, {
      port,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.warn('保存端口配置失败:', err.message);
  }
};

const loadPortConfig = async () => {
  try {
    if (await fs.pathExists(PORT_CONFIG_FILE)) {
      const config = await fs.readJson(PORT_CONFIG_FILE);
      return config.port;
    }
  } catch (err) {
    console.warn('读取端口配置失败:', err.message);
  }
  return null;
};

const startServer = async () => {
  let port = await loadPortConfig();
  
  if (port && await isPortAvailable(port)) {
    console.log(`使用之前保存的端口: ${port}`);
  } else {
    console.log(`搜索可用端口: ${PORT_RANGE_START}-${PORT_RANGE_END}`);
    port = await findAvailablePort(PORT_RANGE_START, PORT_RANGE_END);
    console.log(`找到可用端口: ${port}`);
  }

  await savePortConfig(port);

  app.listen(port, () => {
    console.log(`字体预览服务运行在 http://localhost:${port}`);
    console.log(`健康检查: http://localhost:${port}/api/health`);
    console.log(`上传目录: ${UPLOAD_DIR}`);
    console.log(`字体保留时间: ${FONT_RETENTION_HOURS} 小时`);
    console.log(`清理间隔: ${CLEANUP_INTERVAL_MS / 60000} 分钟`);
  });
};

startServer().catch(err => {
  console.error('启动服务器失败:', err);
  process.exit(1);
});
