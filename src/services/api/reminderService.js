import taskService from './taskService.js';
import emailService from './emailService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reminderService = {
  async checkAndSendReminders() {
    await delay(200);
    
    try {
      // Get tasks due tomorrow
      const tasksDueTomorrow = await taskService.getTasksDueTomorrow();
      
      if (tasksDueTomorrow.length === 0) {
        console.log('No tasks due tomorrow - no reminders to send');
        return { success: true, remindersSent: 0 };
      }

      // Group tasks by assigned users for bulk sending
      const reminderGroups = [];
      
      for (const task of tasksDueTomorrow) {
        if (task.assignedUsers && task.assignedUsers.length > 0) {
          reminderGroups.push({
            task,
            emails: task.assignedUsers
          });
        }
      }

      if (reminderGroups.length === 0) {
        console.log('No assigned users for tomorrow\'s tasks - no reminders to send');
        return { success: true, remindersSent: 0 };
      }

      // Send bulk reminders
      const result = await emailService.sendBulkReminders(reminderGroups);
      
      console.log(`Sent ${result.sentCount} reminder emails for ${tasksDueTomorrow.length} tasks`);
      
      return {
        success: true,
        remindersSent: result.sentCount,
        tasksProcessed: tasksDueTomorrow.length
      };
      
    } catch (error) {
      console.error('Failed to check and send reminders:', error);
      throw new Error('Failed to process reminders');
    }
  },

  async scheduleReminders() {
    // In a real application, this would integrate with a job scheduler
    // For now, we'll simulate the scheduling logic
    console.log('Reminder service scheduled - checking daily at 9:00 AM');
    
    return {
      success: true,
      message: 'Reminder service active'
    };
  },

  async getUpcomingReminders() {
    await delay(200);
    
    try {
      const tasksDueTomorrow = await taskService.getTasksDueTomorrow();
      
      const upcomingReminders = tasksDueTomorrow
        .filter(task => task.assignedUsers && task.assignedUsers.length > 0)
        .map(task => ({
          taskId: task.Id,
          taskTitle: task.title,
          dueDate: task.dueDate,
          assignedUsers: task.assignedUsers,
          reminderCount: task.assignedUsers.length
        }));
      
      return upcomingReminders;
    } catch (error) {
      console.error('Failed to get upcoming reminders:', error);
      throw new Error('Failed to get upcoming reminders');
    }
  }
};

// Auto-start reminder checking (in production, this would be handled by a cron job)
if (typeof window !== 'undefined') {
  // Browser environment - set up periodic checking
  setInterval(() => {
    reminderService.checkAndSendReminders().catch(console.error);
  }, 24 * 60 * 60 * 1000); // Check daily
}

export default reminderService;