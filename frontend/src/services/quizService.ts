  import api from '@/lib/axios';

 export interface Question {
  _id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  points: number;
}

export interface Quiz {
  _id: string;
  title: string;
  course: string;
  description: string;
  questions: Question[];
  duration: number;
  totalPoints: number;
  dueDate: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}


const quizService = {
  getQuizzes: () => api.get('/quizzes'),        // بدون /auth
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  createQuiz: (quizData: Omit<Quiz, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/quizzes', quizData),
  updateQuiz: (id: string, quizData: Partial<Quiz>) =>
    api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id: string) => api.delete(`/quizzes/${id}`),
};

export default quizService;
