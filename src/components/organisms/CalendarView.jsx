import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadCalendarTasks();
  }, [refreshTrigger, selectedDate]);

  const loadCalendarTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      const monthTasks = await taskService.getTasksForDateRange(monthStart, monthEnd);
      setTasks(monthTasks);
    } catch (err) {
      setError(err.message || 'Failed to load calendar tasks');
      toast.error('Failed to load calendar tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const handleTaskClick = async (task, event) => {
    event.stopPropagation();
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

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      const completedTasks = dayTasks.filter(task => task.completed);
      
      if (dayTasks.length === 0) return null;

      return (
        <div className="mt-1 space-y-1">
          {dayTasks.slice(0, 2).map(task => (
            <motion.div
              key={task.Id}
              className={`text-xs px-1 py-0.5 rounded cursor-pointer truncate ${
                task.completed 
                  ? 'bg-green-100 text-green-800 line-through' 
                  : 'bg-blue-100 text-blue-800'
              }`}
              onClick={(e) => handleTaskClick(task, e)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={task.title}
            >
              {task.title}
            </motion.div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-xs text-gray-500 text-center">
              +{dayTasks.length - 2} more
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-white rounded-lg border border-gray-100 p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load calendar</h3>
        <p className="mt-2 text-gray-500">Something went wrong. Please try again.</p>
        <motion.button
          onClick={loadCalendarTasks}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Calendar View
        </h2>
        <div className="text-sm text-gray-600">
          {tasks.length} tasks this month
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        className="bg-white rounded-lg border border-gray-100 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          className="w-full border-none"
          tileClassName="p-2 h-20 hover:bg-gray-50 transition-colors"
          navigationLabel={({ date }) => format(date, 'MMMM yyyy')}
        />
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;