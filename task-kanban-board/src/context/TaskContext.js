import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

const initialTasks = [
  {
    id: 1,
    title: '设计用户界面',
    description: '完成首页和用户中心的UI设计',
    status: 'todo',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '开发API接口',
    description: '编写后端RESTful API接口文档和实现',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: '代码审查',
    description: '审查团队成员提交的代码',
    status: 'done',
    priority: 'low',
    createdAt: new Date().toISOString()
  }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
