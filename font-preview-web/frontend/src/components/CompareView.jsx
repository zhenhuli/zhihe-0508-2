import React from 'react';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SelectOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Card, Button, Empty, Row, Col, Tag, Space, Tooltip, message } from 'antd';
import { loadFont, isFontLoaded } from '../utils/fontLoader';

const CompareView = ({
  selectedFonts,
  allFonts,
  previewText,
  fontSize,
  fontWeight,
  onBack,
  onRemoveFont,
  onClearAll
}) => {
  const getFontById = (id) => allFonts.find(f => f.id === id);
  
  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const handleRemoveFont = (fontId) => {
    if (onRemoveFont) {
      onRemoveFont(fontId);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (selectedFonts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Empty
          description={
            <span>
              暂未选择字体进行对比
              <br />
              请先在列表视图中选择字体
            </span>
          }
        >
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回列表
          </Button>
        </Empty>
      </div>
    );
  }

  const previewStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    lineHeight: 1.8,
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  return (
    <div>
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginRight: 16 }}>
            返回列表
          </Button>
          <Tag color="blue" style={{ fontSize: 14 }}>
            已选择 {selectedFonts.length} 个字体进行对比
          </Tag>
        </div>
        
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleClearAll}>
            清空对比
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {selectedFonts.map(fontId => {
          const font = getFontById(fontId);
          if (!font) return null;

          const fontPreviewStyle = {
            ...previewStyle,
            fontFamily: `'${font.id}', sans-serif`
          };

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={font.id}>
              <Card
                bordered
                style={{ height: '100%' }}
                title={
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    overflow: 'hidden'
                  }}>
                    <span style={{ 
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {font.name}
                    </span>
                  </div>
                }
                extra={
                  <Tooltip title="从对比中移除">
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFont(font.id)}
                    />
                  </Tooltip>
                }
              >
                <div style={{ marginBottom: 12 }}>
                  <Tag color="blue">{font.ext.toUpperCase()}</Tag>
                  <Tag color="geekblue">{formatSize(font.size)}</Tag>
                </div>
                
                <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
                  <div
                    className="font-preview"
                    style={fontPreviewStyle}
                  >
                    {previewText || '暂无预览文字'}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CompareView;
