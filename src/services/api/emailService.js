import nodemailer from 'nodemailer';

// Mock email transporter for development
const createTransporter = () => {
  // In production, configure with real SMTP settings
  return nodemailer.createTestAccount().then(testAccount => {
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const emailTemplates = {
  taskAssignment: (task, assignedTo) => ({
    subject: `Task Assigned: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">You've been assigned a new task</h2>
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1F2937;">${task.title}</h3>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Priority:</strong> ${task.priority}</p>
          <p style="margin: 5px 0; color: #6B7280;"><strong>Category:</strong> ${task.category}</p>
          ${task.dueDate ? `<p style="margin: 5px 0; color: #6B7280;"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
        </div>
        <p style="color: #4B5563;">You can manage this task in your DayFlow dashboard.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="font-size: 12px; color: #9CA3AF;">This is an automated message from DayFlow.</p>
      </div>
    `
  }),

  taskReminder: (task) => ({
    subject: `Reminder: ${task.title} is due tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">Task Reminder</h2>
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <h3 style="margin: 0 0 10px 0; color: #92400E;">${task.title}</h3>
          <p style="margin: 5px 0; color: #92400E;"><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0; color: #92400E;"><strong>Priority:</strong> ${task.priority}</p>
        </div>
        <p style="color: #4B5563;">Don't forget to complete this task! You can mark it as done in your DayFlow dashboard.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="font-size: 12px; color: #9CA3AF;">This is an automated reminder from DayFlow.</p>
      </div>
    `
  })
};

const emailService = {
  async sendTaskAssignment(task, assignedEmails) {
    await delay(500); // Simulate network delay
    
    try {
      console.log('Sending task assignment emails:', {
        task: task.title,
        assignedTo: assignedEmails
      });
      
      // In a real implementation, send actual emails
      const template = emailTemplates.taskAssignment(task);
      
      for (const email of assignedEmails) {
        console.log(`Email sent to ${email}:`, template.subject);
      }
      
      return { success: true, sentCount: assignedEmails.length };
    } catch (error) {
      console.error('Failed to send assignment emails:', error);
      throw new Error('Failed to send assignment emails');
    }
  },

  async sendTaskReminder(task, email) {
    await delay(300);
    
    try {
      console.log('Sending task reminder email:', {
        task: task.title,
        to: email,
        dueDate: task.dueDate
      });
      
      const template = emailTemplates.taskReminder(task);
      console.log(`Reminder email sent to ${email}:`, template.subject);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      throw new Error('Failed to send reminder email');
    }
  },

  async sendBulkReminders(taskReminders) {
    await delay(400);
    
    try {
      let successCount = 0;
      
      for (const { task, emails } of taskReminders) {
        for (const email of emails) {
          await this.sendTaskReminder(task, email);
          successCount++;
        }
      }
      
      return { success: true, sentCount: successCount };
    } catch (error) {
      console.error('Failed to send bulk reminders:', error);
      throw new Error('Failed to send bulk reminders');
    }
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateEmails(emails) {
    return emails.every(email => this.validateEmail(email));
  }
};

export default emailService;