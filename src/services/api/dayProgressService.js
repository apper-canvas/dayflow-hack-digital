import dayProgressData from '../mockData/dayProgress.json';

let dayProgress = [...dayProgressData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dayProgressService = {
  async getAll() {
    await delay(200);
    return [...dayProgress];
  },

  async getById(id) {
    await delay(150);
    const progress = dayProgress.find(p => p.Id === parseInt(id, 10));
    if (!progress) {
      throw new Error('Progress record not found');
    }
    return { ...progress };
  },

  async getByDate(date) {
    await delay(200);
    const progress = dayProgress.find(p => p.date === date);
    return progress ? { ...progress } : null;
  },

  async create(progressData) {
    await delay(250);
    const maxId = dayProgress.length > 0 ? Math.max(...dayProgress.map(p => p.Id)) : 0;
    const newProgress = {
      Id: maxId + 1,
      ...progressData
    };
    dayProgress.push(newProgress);
    return { ...newProgress };
  },

  async update(id, updates) {
    await delay(200);
    const index = dayProgress.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Progress record not found');
    }
    
    const updatedProgress = {
      ...dayProgress[index],
      ...updates,
      Id: dayProgress[index].Id // Preserve original Id
    };
    
    dayProgress[index] = updatedProgress;
    return { ...updatedProgress };
  },

  async updateByDate(date, updates) {
    await delay(200);
    const index = dayProgress.findIndex(p => p.date === date);
    
    if (index === -1) {
      // Create new progress record for this date
      return this.create({ date, ...updates });
    }
    
    const updatedProgress = {
      ...dayProgress[index],
      ...updates
    };
    
    dayProgress[index] = updatedProgress;
    return { ...updatedProgress };
  },

  async delete(id) {
    await delay(150);
    const index = dayProgress.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Progress record not found');
    }
    dayProgress.splice(index, 1);
    return true;
  }
};

export default dayProgressService;