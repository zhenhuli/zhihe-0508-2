import React from 'react';
import styled from 'styled-components';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';

const ColumnContainer = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  min-width: 300px;
  max-width: 350px;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.borderColor};
`;

const ColumnTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TaskCount = styled.span`
  background: ${props => props.bgColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
`;

const TaskList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const DropZone = styled.div`
  min-height: 60px;
  border: 2px dashed ${props => props.isOver ? '#3b82f6' : '#e2e8f0'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isOver ? '#3b82f6' : '#94a3b8'};
  font-size: 12px;
  transition: all 0.2s ease;
  background: ${props => props.isOver ? '#eff6ff' : 'transparent'};
`;

const Column = ({ title, status, color, borderColor, bgColor, onEdit }) => {
  const { tasks, moveTask } = useTasks();
  const [isOver, setIsOver] = React.useState(false);

  const columnTasks = tasks.filter(task => task.status === status);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  return (
    <ColumnContainer>
      <ColumnHeader borderColor={borderColor}>
        <ColumnTitle>
          <span style={{ color }}>{title}</span>
          <TaskCount bgColor={bgColor}>{columnTasks.length}</TaskCount>
        </ColumnTitle>
      </ColumnHeader>
      <TaskList
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
        {columnTasks.length === 0 && (
          <DropZone isOver={isOver}>
            {isOver ? '释放以添加任务' : '拖拽任务到这里'}
          </DropZone>
        )}
      </TaskList>
    </ColumnContainer>
  );
};

export default Column;
