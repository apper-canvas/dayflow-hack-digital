import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TimeBlock from '@/components/molecules/TimeBlock';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';
import { format, isToday } from 'date-fns';

const TimeBlockView = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workingHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  useEffect(() => {
    loadTodaysTasks();
  }, [refreshTrigger]);

  const loadTodaysTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const todaysTasks = await taskService.getTodaysTasks();
      setTasks(todaysTasks);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load today\'s tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTasksForHour = (hour) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isToday(taskDate) && taskDate.getHours() === hour;
    });
  };

  const handleTaskClick = async (task) => {
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      
      setTasks(prev => prev.map(t => 
        t.Id === task.Id ? updatedTask : t
      ));

      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {workingHours.map(hour => (
          <div key={hour} className="bg-white rounded-lg border border-gray-100 p-3 h-20">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load schedule</h3>
        <p className="mt-2 text-gray-500">Something went wrong. Please try again.</p>
        <motion.button
          onClick={loadTodaysTasks}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try again
        </motion.button>
      </motion.div>
    );
  }

  const totalScheduledTasks = tasks.filter(task => task.dueDate).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Schedule
        </h2>
        <div className="text-sm text-gray-600">
          {totalScheduledTasks} scheduled tasks
        </div>
      </div>

      {/* Time Blocks */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
        {workingHours.map((hour, index) => (
          <motion.div
            key={hour}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TimeBlock
              hour={hour}
              tasks={getTasksForHour(hour)}
              onTaskClick={handleTaskClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {totalScheduledTasks === 0 && (
        <motion.div
          className="text-center py-8 bg-surface/30 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No scheduled tasks today
          </h3>
          <p className="text-gray-500 text-sm">
            Add due dates to your tasks to see them in your daily schedule.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TimeBlockView;