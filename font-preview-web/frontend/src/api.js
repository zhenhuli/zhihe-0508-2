const API_BASE = '';
let cachedUserId = null;

export const setUserId = (userId) => {
  cachedUserId = userId;
};

export const getCachedUserId = () => cachedUserId;

const getAuthHeaders = () => {
  if (!cachedUserId) {
    console.warn('User ID not set');
    return {};
  }
  return {
    'X-User-Id': cachedUserId
  };
};

export const checkDuplicates = async (files) => {
  const fileInfos = files.map(file => ({
    originalName: file.name,
    size: file.size
  }));

  const response = await fetch(`${API_BASE}/api/check-duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ files: fileInfos })
  });

  if (!response.ok) {
    throw new Error('检查重复失败');
  }

  return response.json();
};

export const uploadFonts = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('fonts', file);
  });

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '上传失败' }));
    throw new Error(errorData.error || '上传失败');
  }

  return response.json();
};

export const getFonts = async () => {
  const response = await fetch(`${API_BASE}/api/fonts`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('获取字体列表失败');
  }
  return response.json();
};

export const deleteFont = async (fontId) => {
  const response = await fetch(`${API_BASE}/api/fonts/${fontId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('删除失败');
  }
  return response.json();
};

export const clearAllFonts = async () => {
  const response = await fetch(`${API_BASE}/api/fonts`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('清空失败');
  }
  return response.json();
};

export const getSessionInfo = async () => {
  const response = await fetch(`${API_BASE}/api/session`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('获取会话信息失败');
  }
  return response.json();
};
