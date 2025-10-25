 import api from '@/lib/axios';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  course: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  publishDate: string;
  expiryDate?: string;
  createdBy: {
    _id: string;
    username: string;
  } | string;
}

const announcementService = {
  getAnnouncements: () => api.get('/announcements'),
  getAnnouncement: (id: string) => api.get(`/announcements/${id}`),
  createAnnouncement: (data: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/announcements', data),
  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id: string) => api.delete(`/announcements/${id}`),
};

export default announcementService;
