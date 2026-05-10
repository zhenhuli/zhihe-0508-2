import React, { useState, useRef } from 'react';
import { UploadOutlined, InboxOutlined, WarningOutlined } from '@ant-design/icons';
import { Upload, Button, message, Modal, Tag, Alert, List, Card, Empty } from 'antd';
import { uploadFonts, checkDuplicates } from '../api';

const { Dragger } = Upload;

const FontUploader = ({ onUploadSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择字体文件');
      return;
    }

    setChecking(true);
    try {
      const files = fileList.map(item => item.originFileObj);
      
      const checkResult = await checkDuplicates(files);
      
      if (checkResult.duplicates && checkResult.duplicates.length > 0) {
        setDuplicates(checkResult.duplicates);
        setShowDuplicateModal(true);
        return;
      }
      
      await performUpload(files);
    } catch (error) {
      console.error('检查重复失败:', error);
      message.warning('无法检查重复，继续上传...');
      const files = fileList.map(item => item.originFileObj);
      await performUpload(files);
    } finally {
      setChecking(false);
    }
  };

  const performUpload = async (files) => {
    setUploading(true);
    try {
      const result = await uploadFonts(files);
      
      if (result.success) {
        if (result.duplicates && result.duplicates.length > 0) {
          message.warning(
            `上传成功，但检测到 ${result.duplicates.length} 个可能重复的字体: ${result.duplicates.join(', ')}`
          );
        } else {
          message.success(`成功上传 ${result.fonts.length} 个字体文件`);
        }
        setFileList([]);
        setDuplicates([]);
        if (onUploadSuccess) {
          onUploadSuccess(result.fonts);
        }
      }
    } catch (error) {
      message.error(error.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmUpload = () => {
    setShowDuplicateModal(false);
    const files = fileList.map(item => item.originFileObj);
    performUpload(files);
  };

  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const props = {
    fileList,
    multiple: true,
    accept: '.ttf,.otf,.woff,.woff2',
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      const validFiles = newFileList.filter(file => {
        const validExts = ['.ttf', '.otf', '.woff', '.woff2'];
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!validExts.includes(ext)) {
          message.error(`不支持的文件格式: ${file.name}`);
          return false;
        }
        return true;
      });
      setFileList(validFiles);
    },
    onRemove: handleRemove
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Dragger {...props} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽字体文件到此处上传</p>
        <p className="ant-upload-hint">
          支持 TTF、OTF、WOFF、WOFF2 格式，可批量上传（最多 20 个文件）
        </p>
      </Dragger>
      
      {fileList.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleUpload}
            loading={uploading || checking}
            size="large"
          >
            {checking ? '检查重复中...' : `上传 ${fileList.length} 个字体`}
          </Button>
        </div>
      )}

      <Modal
        title={
          <span>
            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
            检测到潜在的重复字体
          </span>
        }
        open={showDuplicateModal}
        onOk={handleConfirmUpload}
        onCancel={() => setShowDuplicateModal(false)}
        okText="继续上传"
        cancelText="取消"
        width={700}
      >
        <Alert
          message="以下文件与已上传的字体文件大小相同，可能是重复文件"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Card size="small" title="可能的重复字体列表">
          {duplicates.length === 0 ? (
            <Empty description="暂无数据" />
          ) : (
            <List
              dataSource={duplicates}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Tag color="orange">可能重复</Tag>}
                    title={item.originalName}
                    description={
                      <div>
                        <div>文件大小: {formatSize(item.size)}</div>
                        <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                          匹配的已有文件:
                          {item.matches && item.matches.map((m, idx) => (
                            <span key={idx} style={{ marginLeft: 4 }}>
                              {idx > 0 && ', '}
                              <Tag color="blue">{m.originalName}</Tag>
                            </span>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
        
        <Alert
          message="提示：您可以继续上传，系统会使用 MD5 哈希进一步检测重复，并在上传完成后提示重复的文件"
          type="info"
          style={{ marginTop: 16 }}
          showIcon
        />
      </Modal>
    </div>
  );
};

export default FontUploader;
