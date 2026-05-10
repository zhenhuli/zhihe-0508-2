import React, { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Card, Button, Tag, Tooltip, message, Space, Divider } from 'antd';
import { loadFont, isFontLoaded } from '../utils/fontLoader';

const FontCard = ({
  font,
  previewText,
  fontSize,
  fontWeight,
  onDelete,
  selected,
  onToggleSelect,
  showSelect = false
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const checkAndLoad = async () => {
      if (isFontLoaded(font.id)) {
        setLoaded(true);
      } else {
        try {
          await loadFont(font.id, font.url, font.ext);
          setLoaded(true);
        } catch (error) {
          console.warn('字体加载失败:', font.name);
          setLoaded(true);
        }
      }
    };
    checkAndLoad();
  }, [font]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(font.id);
    }
  };

  const handleToggleSelect = () => {
    if (onToggleSelect) {
      onToggleSelect(font.id);
    }
  };

  const handleCopyFontName = () => {
    navigator.clipboard.writeText(font.name).then(() => {
      message.success('字体名称已复制');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const previewStyle = {
    fontFamily: `'${font.id}', sans-serif`,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    lineHeight: 1.8,
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word'
  };

  const cardTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0
  };

  const titleTextStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <Card
      hoverable
      bordered
      style={{
        marginBottom: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: selected ? '#1890ff' : '#f0f0f0',
        boxShadow: selected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : 'none'
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        overflow: 'hidden'
      }}
      title={
        <div style={cardTitleStyle}>
          <Tooltip title="复制字体名称">
            <span
              style={titleTextStyle}
              onClick={handleCopyFontName}
            >
              {font.name}
            </span>
          </Tooltip>
          <Tag color={loaded ? 'success' : 'warning'} style={{ flexShrink: 0 }}>
            {loaded ? '已加载' : '加载中'}
          </Tag>
        </div>
      }
      extra={
        <Space size="small" wrap>
          {showSelect && (
            <Button
              type={selected ? 'primary' : 'default'}
              size="small"
              icon={selected ? <CheckCircleOutlined /> : undefined}
              onClick={handleToggleSelect}
            >
              {selected ? '已选择' : '对比'}
            </Button>
          )}
          <Tooltip title="删除此字体">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            />
          </Tooltip>
        </Space>
      }
    >
      <div style={{ 
        marginBottom: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        flexShrink: 0
      }}>
        <Tag color="blue">{font.ext.toUpperCase()}</Tag>
        <Tag color="geekblue">{formatSize(font.size)}</Tag>
      </div>
      
      <Divider style={{ margin: '8px 0', flexShrink: 0 }} />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 6, 
        marginBottom: 8,
        flexShrink: 0,
        color: '#666',
        fontSize: 12
      }}>
        <FileTextOutlined />
        <span>预览内容</span>
      </div>
      
      <div
        className="font-preview"
        style={{
          ...previewStyle,
          flex: 1,
          overflow: 'auto',
          padding: '12px 8px',
          backgroundColor: '#fafafa',
          borderRadius: 4,
          border: '1px solid #f0f0f0',
          minHeight: 100,
          maxHeight: 300
        }}
      >
        {previewText || '暂无预览文字'}
      </div>
    </Card>
  );
};

export default FontCard;
