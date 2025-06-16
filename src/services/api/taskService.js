import tasksData from '../mockData/tasks.json';

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

async create(taskData) {
    await delay(400);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      assignedUsers: taskData.assignedUsers || []
    };
    tasks.push(newTask);
    
    // Send assignment emails if users are assigned
    if (newTask.assignedUsers.length > 0) {
      try {
        const emailService = (await import('./emailService.js')).default;
        await emailService.sendTaskAssignment(newTask, newTask.assignedUsers);
      } catch (error) {
        console.error('Failed to send assignment emails:', error);
        // Don't fail task creation if email fails
      }
    }
    
    return { ...newTask };
  },

async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const originalTask = tasks[index];
    const updatedTask = {
      ...originalTask,
      ...updates,
      Id: originalTask.Id // Preserve original Id
    };
    
    // Handle completion status
    if (updates.completed !== undefined) {
      updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
    }
    
    // Handle assigned users changes
    if (updates.assignedUsers !== undefined) {
      const newAssignees = updates.assignedUsers.filter(
        email => !originalTask.assignedUsers?.includes(email)
      );
      
      // Send emails to newly assigned users
      if (newAssignees.length > 0) {
        try {
          const emailService = (await import('./emailService.js')).default;
          await emailService.sendTaskAssignment(updatedTask, newAssignees);
        } catch (error) {
          console.error('Failed to send assignment emails:', error);
          // Don't fail update if email fails
        }
      }
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  },

  async getTodaysTasks() {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === today;
    });
  },

  async getTasksByPriority(priority) {
    await delay(200);
    return tasks.filter(task => task.priority === priority);
  },

async getTasksByCategory(category) {
    await delay(200);
    return tasks.filter(task => task.category === category);
  },

  async getTasksForDateRange(startDate, endDate) {
    await delay(200);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
return taskDate >= start && taskDate <= end;
    });
  },

  async getTasksDueTomorrow() {
    await delay(200);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === tomorrowDateStr;
    });
  }
};

export default taskService;