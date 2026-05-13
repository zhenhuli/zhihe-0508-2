import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskProvider } from './context/TaskContext';
import Column from './components/Column';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 24px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AddButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Board = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 16px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const columns = [
  {
    title: '待办',
    status: 'todo',
    color: '#ef4444',
    borderColor: '#ef4444',
    bgColor: '#ef4444'
  },
  {
    title: '进行中',
    status: 'in-progress',
    color: '#f59e0b',
    borderColor: '#f59e0b',
    bgColor: '#f59e0b'
  },
  {
    title: '已完成',
    status: 'done',
    color: '#10b981',
    borderColor: '#10b981',
    bgColor: '#10b981'
  }
];

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskProvider>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>📋 任务看板</Title>
          <AddButton onClick={() => setIsAddModalOpen(true)}>
            <span>+</span>
            添加任务
          </AddButton>
        </Header>
        <Board>
          {columns.map(column => (
            <Column key={column.status} {...column} onEdit={handleEdit} />
          ))}
        </Board>
        <AddTaskModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          task={editingTask}
        />
      </AppContainer>
    </TaskProvider>
  );
}

export default App;
