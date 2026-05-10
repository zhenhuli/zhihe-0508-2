import CryptoJS from 'crypto-js';

const USER_ID_KEY = 'font_preview_user_id';
const EXPIRE_KEY = 'font_preview_expire_at';

const getBrowserFingerprint = async () => {
  const components = [];
  
  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(navigator.platform);
  components.push(navigator.hardwareConcurrency || 'unknown');
  components.push(navigator.deviceMemory || 'unknown');
  components.push(screen.width + 'x' + screen.height);
  components.push(screen.colorDepth);
  components.push(new Date().getTimezoneOffset());
  components.push(navigator.javaEnabled());
  
  if (typeof window !== 'undefined' && window.performance) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('font-preview', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('fingerprint', 4, 17);
      components.push(canvas.toDataURL().slice(-100));
    } catch (e) {}
  }
  
  return components.join('###');
};

const generateHash = (data) => {
  return CryptoJS.MD5(data).toString();
};

const generateUserId = async () => {
  const fingerprint = await getBrowserFingerprint();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString();
  return generateHash(fingerprint + randomStr + timestamp);
};

export const getUserId = async () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  const expireAt = localStorage.getItem(EXPIRE_KEY);
  
  if (userId && expireAt) {
    const now = Date.now();
    if (parseInt(expireAt) > now) {
      return userId;
    }
  }
  
  userId = await generateUserId();
  const newExpireAt = Date.now() + (72 * 60 * 60 * 1000);
  
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(EXPIRE_KEY, newExpireAt.toString());
  
  return userId;
};

export const clearUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(EXPIRE_KEY);
};

export const getExpireTime = () => {
  const expireAt = localStorage.getItem(EXPIRE_KEY);
  return expireAt ? parseInt(expireAt) : null;
};
