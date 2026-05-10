import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Card, Typography, Space, Tag, message, Tooltip, Spin } from 'antd';
import FontUploader from './components/FontUploader';
import PreviewControl, { DEFAULT_TEXT } from './components/PreviewControl';
import FontList from './components/FontList';
import CompareView from './components/CompareView';
import { getFonts, deleteFont, clearAllFonts, setUserId, getSessionInfo } from './api';
import { loadFonts, unloadFont } from './utils/fontLoader';
import { getUserId, getExpireTime } from './utils/fingerprint';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [previewText, setPreviewText] = useState(DEFAULT_TEXT);
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [userId, setAppUserId] = useState(null);

  const initSession = useCallback(async () => {
    try {
      setInitializing(true);
      const uid = await getUserId();
      setAppUserId(uid);
      setUserId(uid);
      
      try {
        const result = await getSessionInfo();
        if (result.success) {
          setSessionInfo(result);
        }
      } catch (err) {
        console.warn('获取会话信息失败:', err);
      }
      
      await loadFontListInternal();
    } catch (error) {
      console.error('初始化会话失败:', error);
      message.error('初始化失败，请刷新页面重试');
    } finally {
      setInitializing(false);
    }
  }, []);

  const loadFontListInternal = async () => {
    try {
      setLoading(true);
      const result = await getFonts();
      if (result.success) {
        setFonts(result.fonts);
        if (result.fonts.length > 0) {
          await loadFonts(result.fonts);
        }
      }
    } catch (error) {
      console.error('加载字体列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFontList = useCallback(loadFontListInternal, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (!sessionInfo) return;
    
    const checkExpiration = () => {
      const now = Date.now();
      const expireAt = getExpireTime();
      if (expireAt && now > expireAt) {
        message.warning('您的会话已过期，页面将重新初始化', 5);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, [sessionInfo]);

  const handleUploadSuccess = async (newFonts) => {
    setFonts(prev => [...prev, ...newFonts]);
    try {
      await loadFonts(newFonts);
    } catch (error) {
      console.warn('部分字体可能加载失败:', error);
    }
  };

  const handleDeleteFont = async (fontId) => {
    try {
      await deleteFont(fontId);
      unloadFont(fontId);
      setFonts(prev => prev.filter(f => f.id !== fontId));
      setSelectedFonts(prev => prev.filter(id => id !== fontId));
      message.success('字体已删除');
    } catch (error) {
      message.error(error.message || '删除失败');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllFonts();
      fonts.forEach(font => unloadFont(font.id));
      setFonts([]);
      setSelectedFonts([]);
      message.success('已清空所有字体');
    } catch (error) {
      message.error(error.message || '清空失败');
    }
  };

  const handleToggleSelect = (fontId) => {
    setSelectedFonts(prev => {
      if (prev.includes(fontId)) {
        return prev.filter(id => id !== fontId);
      } else {
        return [...prev, fontId];
      }
    });
  };

  const handleRemoveFromCompare = (fontId) => {
    setSelectedFonts(prev => prev.filter(id => id !== fontId));
  };

  const handleClearCompare = () => {
    setSelectedFonts([]);
  };

  const handleEnterCompareMode = () => {
    if (selectedFonts.length > 0) {
      setViewMode('compare');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const handleResetSettings = () => {
    setPreviewText(DEFAULT_TEXT);
    setFontSize(24);
    setFontWeight(400);
  };

  if (initializing) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin size="large" tip="正在初始化会话...">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  const formatRemainTime = () => {
    if (!sessionInfo || !sessionInfo.remainHours) return null;
    const hours = sessionInfo.remainHours;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainHours = hours % 24;
      return remainHours > 0 ? `${days}天${remainHours}小时` : `${days}天`;
    }
    return `${hours}小时`;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          flexWrap: 'wrap'
        }}>
          <Space size="middle" wrap>
            <Title
              level={3}
              style={{
                margin: 0,
                color: '#fff',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: 12 }}>🔤</span>
              字体预览工具
            </Title>
            <Tag color="white" style={{ background: 'rgba(255,255,255,0.2)' }}>
              Font Preview
            </Tag>
          </Space>
          
          <Space wrap>
            {sessionInfo && (
              <Tooltip title={`会话ID: ${sessionInfo.userId.substring(0, 8)}...\n数据将在 ${formatRemainTime()} 后过期`}>
                <Tag color="gold" style={{ fontSize: 13, padding: '2px 10px' }}>
                  ⏱ 剩余 {formatRemainTime()}
                </Tag>
              </Tooltip>
            )}
            {sessionInfo && (
              <Tooltip title="您当前拥有的字体数量">
                <Tag color="cyan" style={{ fontSize: 13, padding: '2px 10px' }}>
                  📁 {sessionInfo.fontCount} 个字体
                </Tag>
              </Tooltip>
            )}
            {viewMode === 'compare' && (
              <Tag color="green" style={{ fontSize: 13, padding: '2px 10px' }}>
                对比模式
              </Tag>
            )}
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
        {viewMode === 'list' && (
          <Card
            title="上传字体"
            style={{ marginBottom: 24 }}
          >
            <FontUploader onUploadSuccess={handleUploadSuccess} />
          </Card>
        )}

        <PreviewControl
          previewText={previewText}
          onPreviewTextChange={setPreviewText}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          fontWeight={fontWeight}
          onFontWeightChange={setFontWeight}
          onReset={handleResetSettings}
        />

        <Card
          title={viewMode === 'list' ? '字体列表' : '字体对比'}
          loading={loading}
        >
          {viewMode === 'list' ? (
            <FontList
              fonts={fonts}
              previewText={previewText}
              fontSize={fontSize}
              fontWeight={fontWeight}
              selectedFonts={selectedFonts}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDeleteFont}
              onClearAll={handleClearAll}
              onEnterCompareMode={handleEnterCompareMode}
              searchText={searchText}
              onSearchChange={setSearchText}
            />
          ) : (
            <CompareView
              selectedFonts={selectedFonts}
              allFonts={fonts}
              previewText={previewText}
              fontSize={fontSize}
              fontWeight={fontWeight}
              onBack={handleBackToList}
              onRemoveFont={handleRemoveFromCompare}
              onClearAll={handleClearCompare}
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default App;
