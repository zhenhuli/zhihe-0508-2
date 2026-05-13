import React, { useState } from 'react';
import styled from 'styled-components';
import { useTasks } from '../context/TaskContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
  
  &:hover {
    color: #4b5563;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.submit {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.cancel {
    background: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const AddTaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTask(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo'
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>添加新任务</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>任务标题 *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="输入任务标题..."
              autoFocus
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>任务描述</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="输入任务描述..."
            />
          </FormGroup>
          <FormGroup>
            <Label>优先级</Label>
            <Select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>状态</Label>
            <Select name="status" value={formData.status} onChange={handleChange}>
              <option value="todo">待办</option>
              <option value="in-progress">进行中</option>
              <option value="done">已完成</option>
            </Select>
          </FormGroup>
          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>取消</Button>
            <Button type="submit" className="submit">添加任务</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddTaskModal;
