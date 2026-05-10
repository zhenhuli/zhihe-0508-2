import fs from 'fs';
import path from 'path';
import { Question, Answer, User, QuestionWithAnswers, getUserById, AVAILABLE_USERS } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

interface StoredQuestion {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  answers: StoredAnswer[];
  likedBy: string[];
  favoritedBy: string[];
  tags: string[];
}

interface StoredAnswer {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likedBy: string[];
  isAccepted: boolean;
}

const seedData: StoredQuestion[] = [
  {
    id: 'q-1',
    title: '如何使用 Next.js 服务端组件？',
    content: '我正在学习 Next.js 14，想了解服务端组件和客户端组件的区别，以及什么时候应该使用哪一种？',
    author: { id: 'user-2', name: '小明', avatar: '🧑' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['nextjs', 'react'],
    likedBy: ['user-1', 'user-3'],
    favoritedBy: ['user-1'],
    answers: [
      {
        id: 'a-1',
        content: '服务端组件在服务器上渲染，可以直接访问数据库和文件系统，不需要发送 JavaScript 到客户端。客户端组件则在浏览器中渲染，可以使用 React 的状态和生命周期钩子。',
        author: { id: 'user-3', name: '开发者A', avatar: '👨‍💻' },
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        likedBy: ['user-2'],
        isAccepted: true,
      },
      {
        id: 'a-2',
        content: '一般来说，获取数据的组件可以用服务端组件，需要交互的（按钮、表单等）用客户端组件。可以混合使用。',
        author: { id: 'user-4', name: '开发者B', avatar: '👩‍💻' },
        createdAt: new Date(Date.now() - 21600000).toISOString(),
        likedBy: [],
        isAccepted: false,
      },
    ],
  },
  {
    id: 'q-2',
    title: 'TypeScript 中 interface 和 type 有什么区别？',
    content: '在 TypeScript 中，interface 和 type 都可以用来定义类型，它们有什么具体的区别？应该优先使用哪一个？',
    author: { id: 'user-5', name: '新手开发者', avatar: '🐣' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['typescript'],
    likedBy: ['user-1'],
    favoritedBy: [],
    answers: [],
  },
  {
    id: 'q-3',
    title: '如何优化 React 应用的性能？',
    content: '我有一个比较复杂的 React 应用，渲染有点慢，有哪些常用的性能优化技巧？',
    author: { id: 'user-6', name: '架构师', avatar: '🏗️' },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['react', 'performance'],
    likedBy: ['user-2', 'user-3', 'user-4'],
    favoritedBy: ['user-1', 'user-2'],
    answers: [
      {
        id: 'a-3',
        content: '常用的优化技巧包括：React.memo 避免不必要的重渲染、useMemo 和 useCallback 缓存计算结果和函数、React.lazy 懒加载组件、虚拟化长列表、代码分割等。',
        author: { id: 'user-7', name: '性能专家', avatar: '⚡' },
        createdAt: new Date(Date.now() - 129600000).toISOString(),
        likedBy: ['user-6', 'user-1'],
        isAccepted: false,
      },
    ],
  },
];

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(seedData, null, 2));
  }
}

function readQuestions(): StoredQuestion[] {
  ensureDataFile();
  const content = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  return JSON.parse(content);
}

function writeQuestions(questions: StoredQuestion[]): void {
  ensureDataFile();
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
}

function toQuestionView(q: StoredQuestion, currentUserId: string): Question {
  return {
    id: q.id,
    title: q.title,
    content: q.content,
    author: q.author,
    createdAt: q.createdAt,
    answerCount: q.answers.length,
    likeCount: q.likedBy.length,
    isLiked: q.likedBy.includes(currentUserId),
    isFavorited: q.favoritedBy.includes(currentUserId),
    isMine: q.author.id === currentUserId,
    tags: q.tags,
  };
}

function toAnswerView(a: StoredAnswer, currentUserId: string): Answer {
  return {
    id: a.id,
    content: a.content,
    author: a.author,
    createdAt: a.createdAt,
    likeCount: a.likedBy.length,
    isLiked: a.likedBy.includes(currentUserId),
    isMine: a.author.id === currentUserId,
    isAccepted: a.isAccepted,
  };
}

function toQuestionWithAnswers(q: StoredQuestion, currentUserId: string): QuestionWithAnswers {
  return {
    ...toQuestionView(q, currentUserId),
    answers: q.answers.map(a => toAnswerView(a, currentUserId)),
  };
}

export async function getQuestions(currentUserId: string): Promise<Question[]> {
  const questions = readQuestions();
  return questions
    .map(q => toQuestionView(q, currentUserId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getQuestionById(id: string, currentUserId: string): Promise<QuestionWithAnswers | null> {
  const questions = readQuestions();
  const q = questions.find(q => q.id === id);
  if (!q) return null;
  return toQuestionWithAnswers(q, currentUserId);
}

export async function createQuestion(
  data: { title: string; content: string; tags: string[] },
  currentUserId: string
): Promise<Question> {
  const questions = readQuestions();
  const user = getUserById(currentUserId);
  const newQuestion: StoredQuestion = {
    id: `q-${Date.now()}`,
    title: data.title,
    content: data.content,
    author: user,
    createdAt: new Date().toISOString(),
    tags: data.tags,
    likedBy: [],
    favoritedBy: [],
    answers: [],
  };
  questions.unshift(newQuestion);
  writeQuestions(questions);
  return toQuestionView(newQuestion, currentUserId);
}

export async function createAnswer(
  questionId: string,
  content: string,
  currentUserId: string
): Promise<Answer | null> {
  const questions = readQuestions();
  const qIndex = questions.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;
  
  const user = getUserById(currentUserId);
  const newAnswer: StoredAnswer = {
    id: `a-${Date.now()}`,
    content,
    author: user,
    createdAt: new Date().toISOString(),
    likedBy: [],
    isAccepted: false,
  };
  
  questions[qIndex].answers.push(newAnswer);
  writeQuestions(questions);
  return toAnswerView(newAnswer, currentUserId);
}

export async function toggleQuestionLike(
  questionId: string,
  currentUserId: string
): Promise<{ likeCount: number; isLiked: boolean } | null> {
  const questions = readQuestions();
  const qIndex = questions.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;
  
  const q = questions[qIndex];
  const likedIndex = q.likedBy.indexOf(currentUserId);
  
  if (likedIndex === -1) {
    q.likedBy.push(currentUserId);
  } else {
    q.likedBy.splice(likedIndex, 1);
  }
  
  writeQuestions(questions);
  return {
    likeCount: q.likedBy.length,
    isLiked: q.likedBy.includes(currentUserId),
  };
}

export async function toggleQuestionFavorite(
  questionId: string,
  currentUserId: string
): Promise<{ isFavorited: boolean } | null> {
  const questions = readQuestions();
  const qIndex = questions.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;
  
  const q = questions[qIndex];
  const favoritedIndex = q.favoritedBy.indexOf(currentUserId);
  
  if (favoritedIndex === -1) {
    q.favoritedBy.push(currentUserId);
  } else {
    q.favoritedBy.splice(favoritedIndex, 1);
  }
  
  writeQuestions(questions);
  return {
    isFavorited: q.favoritedBy.includes(currentUserId),
  };
}

export async function toggleAnswerLike(
  questionId: string,
  answerId: string,
  currentUserId: string
): Promise<{ likeCount: number; isLiked: boolean } | null> {
  const questions = readQuestions();
  const qIndex = questions.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;
  
  const aIndex = questions[qIndex].answers.findIndex(a => a.id === answerId);
  if (aIndex === -1) return null;
  
  const a = questions[qIndex].answers[aIndex];
  const likedIndex = a.likedBy.indexOf(currentUserId);
  
  if (likedIndex === -1) {
    a.likedBy.push(currentUserId);
  } else {
    a.likedBy.splice(likedIndex, 1);
  }
  
  writeQuestions(questions);
  return {
    likeCount: a.likedBy.length,
    isLiked: a.likedBy.includes(currentUserId),
  };
}

export async function acceptAnswer(
  questionId: string,
  answerId: string,
  currentUserId: string
): Promise<{ success: boolean; isAccepted: boolean } | null> {
  const questions = readQuestions();
  const qIndex = questions.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;
  
  const q = questions[qIndex];
  
  if (q.author.id !== currentUserId) {
    return null;
  }
  
  const aIndex = q.answers.findIndex(a => a.id === answerId);
  if (aIndex === -1) return null;
  
  const a = q.answers[aIndex];
  const newAccepted = !a.isAccepted;
  
  if (newAccepted) {
    q.answers.forEach(ans => ans.isAccepted = false);
    a.isAccepted = true;
  } else {
    a.isAccepted = false;
  }
  
  writeQuestions(questions);
  return {
    success: true,
    isAccepted: a.isAccepted,
  };
}
