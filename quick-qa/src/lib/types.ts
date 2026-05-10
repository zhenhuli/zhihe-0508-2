export interface User {
  id: string;
  name: string;
  avatar: string;
}

export const AVAILABLE_USERS: User[] = [
  { id: 'user-1', name: '匿名用户', avatar: '👤' },
  { id: 'user-2', name: '小明', avatar: '🧑' },
  { id: 'user-3', name: '开发者A', avatar: '👨‍💻' },
  { id: 'user-4', name: '开发者B', avatar: '👩‍💻' },
  { id: 'user-5', name: '新手开发者', avatar: '🐣' },
  { id: 'user-6', name: '架构师', avatar: '🏗️' },
  { id: 'user-7', name: '性能专家', avatar: '⚡' },
];

export function getUserById(id: string): User {
  return AVAILABLE_USERS.find(u => u.id === id) || AVAILABLE_USERS[0];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  answerCount: number;
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  isMine: boolean;
  tags: string[];
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  isMine: boolean;
  isAccepted: boolean;
}

export interface QuestionWithAnswers extends Question {
  answers: Answer[];
}
