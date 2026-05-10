import React from 'react';
import {
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  SwapOutlined,
  FileTextOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {
  Empty,
  Input,
  Button,
  Tag,
  Space,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import FontCard from './FontCard';

const FontList = ({
  fonts,
  previewText,
  fontSize,
  fontWeight,
  selectedFonts,
  onToggleSelect,
  onDelete,
  onClearAll,
  onEnterCompareMode,
  searchText,
  onSearchChange
}) => {
  const filteredFonts = fonts.filter(font => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      font.name.toLowerCase().includes(searchLower) ||
      (font.originalName && font.originalName.toLowerCase().includes(searchLower))
    );
  });

  const renderControlBar = () => (
    <div style={{ 
      marginBottom: 16, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
          共 {fonts.length} 个字体
        </Tag>
        {searchText && (
          <Tag color="cyan" style={{ fontSize: 14, padding: '4px 12px' }}>
            匹配 {filteredFonts.length} 个
          </Tag>
        )}
        {selectedFonts.length > 0 && (
          <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
            已选择 {selectedFonts.length} 个
          </Tag>
        )}
        
        <Input
          placeholder="搜索字体..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
      </div>
      
      <Space wrap>
        <Popconfirm
          title="确定要清空所有字体吗？"
          description="此操作将删除所有已上传的字体文件，且不可恢复。"
          okText="确定"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => {
            if (onClearAll) onClearAll();
          }}
        >
          <Button icon={<ClearOutlined />} danger>
            清空全部
          </Button>
        </Popconfirm>
        
        <Button
          type={selectedFonts.length > 0 ? 'primary' : 'default'}
          icon={<SwapOutlined />}
          disabled={selectedFonts.length === 0}
          onClick={onEnterCompareMode}
        >
          开始对比 {selectedFonts.length > 0 ? `(${selectedFonts.length})` : ''}
        </Button>
      </Space>
    </div>
  );

  if (fonts.length === 0) {
    return (
      <div>
        {renderControlBar()}
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                <FileTextOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16, display: 'block' }} />
                暂无字体文件
                <br />
                请上传字体文件开始预览
              </span>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderControlBar()}
      
      {filteredFonts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                <SearchOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16, display: 'block' }} />
                没有找到匹配的字体
                <br />
                请尝试其他搜索关键词
              </span>
            }
          />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredFonts.map(font => (
            <Col xs={24} sm={12} md={8} lg={6} key={font.id}>
              <FontCard
                font={font}
                previewText={previewText}
                fontSize={fontSize}
                fontWeight={fontWeight}
                onDelete={onDelete}
                selected={selectedFonts.includes(font.id)}
                onToggleSelect={onToggleSelect}
                showSelect={true}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FontList;
