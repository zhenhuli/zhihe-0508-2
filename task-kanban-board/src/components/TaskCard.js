import React, { useState } from 'react';
import styled from 'styled-components';
import { useTasks } from '../context/TaskContext';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const TaskTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const TaskDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#d1fae5';
      default: return '#e5e7eb';
    }
  }};
  color: ${props => {
    switch(props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    background: #eff6ff;
    color: #2563eb;
    
    &:hover {
      background: #dbeafe;
    }
  }

  &.delete {
    background: #fef2f2;
    color: #dc2626;
    
    &:hover {
      background: #fee2e2;
    }
  }
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, moveTask } = useTasks();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleStatusChange = (e) => {
    moveTask(task.id, e.target.value);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDragging) return;
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDragging) return;
    if (window.confirm('确定要删除这个任务吗？')) {
      deleteTask(task.id);
    }
  };

  return (
    <Card 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <TaskTitle>{task.title}</TaskTitle>
      <TaskDescription>{task.description}</TaskDescription>
      <PriorityBadge priority={task.priority}>
        {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
      </PriorityBadge>
      <StatusSelect value={task.status} onChange={handleStatusChange}>
        <option value="todo">待办</option>
        <option value="in-progress">进行中</option>
        <option value="done">已完成</option>
      </StatusSelect>
      <ActionButtons>
        <Button className="edit" onClick={handleEdit}>编辑</Button>
        <Button className="delete" onClick={handleDelete}>删除</Button>
      </ActionButtons>
    </Card>
  );
};

export default TaskCard;
