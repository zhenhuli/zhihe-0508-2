import React from 'react';
import {
  SettingOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  BoldOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {
  Card,
  Input,
  Slider,
  Select,
  Button,
  Space,
  Row,
  Col
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const DEFAULT_TEXT = `ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
?!@#$%^&*()_+-=[]{}|;':",./<>
人生天地之间，若白驹过隙，忽然而已。
The quick brown fox jumps over the lazy dog.`;

const fontWeights = [
  { value: 100, label: '100 (Thin)' },
  { value: 200, label: '200 (Extra Light)' },
  { value: 300, label: '300 (Light)' },
  { value: 400, label: '400 (Normal)' },
  { value: 500, label: '500 (Medium)' },
  { value: 600, label: '600 (Semi Bold)' },
  { value: 700, label: '700 (Bold)' },
  { value: 800, label: '800 (Extra Bold)' },
  { value: 900, label: '900 (Black)' }
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120];

const PreviewControl = ({
  previewText,
  onPreviewTextChange,
  fontSize,
  onFontSizeChange,
  fontWeight,
  onFontWeightChange,
  onReset
}) => {
  const marks = {
    12: '12',
    24: '24',
    36: '36',
    48: '48',
    60: '60',
    72: '72',
    84: '84',
    96: '96',
    108: '108',
    120: '120'
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card
      title={
        <span>
          <SettingOutlined style={{ marginRight: 8 }} />
          预览设置
        </span>
      }
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          size="small"
        >
          重置
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} lg={12}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              <strong>预览文字</strong>
            </div>
            <TextArea
              value={previewText}
              onChange={(e) => onPreviewTextChange && onPreviewTextChange(e.target.value)}
              placeholder="输入要预览的文字..."
              rows={6}
              style={{ resize: 'vertical' }}
            />
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>
              <FontSizeOutlined style={{ marginRight: 8 }} />
              <strong>字体大小: {fontSize}px</strong>
            </div>
            <Slider
              min={12}
              max={120}
              step={1}
              marks={marks}
              value={fontSize}
              onChange={(value) => onFontSizeChange && onFontSizeChange(value)}
            />
          </div>
          
          <div>
            <div style={{ marginBottom: 8 }}>
              <BoldOutlined style={{ marginRight: 8 }} />
              <strong>字体粗细</strong>
            </div>
            <Select
              style={{ width: '100%' }}
              value={fontWeight}
              onChange={(value) => onFontWeightChange && onFontWeightChange(value)}
            >
              {fontWeights.map(fw => (
                <Option key={fw.value} value={fw.value}>
                  {fw.label}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export { DEFAULT_TEXT };
export default PreviewControl;
