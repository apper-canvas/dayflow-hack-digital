import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { taskService, dayProgressService } from '@/services';
import { format } from 'date-fns';

const Header = () => {
  const [progress, setProgress] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const tasks = await taskService.getTodaysTasks();
      const completed = tasks.filter(task => task.completed).length;
      const total = tasks.length;
      const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setCompletedTasks(completed);
      setTotalTasks(total);
      setProgress(progressPercent);
      
      // Update day progress
      const today = format(new Date(), 'yyyy-MM-dd');
      await dayProgressService.updateByDate(today, {
        totalTasks: total,
        completedTasks: completed,
        productivityScore: progressPercent
      });
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <motion.header
      className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                DayFlow
              </h1>
              <p className="text-sm text-gray-600">{currentDate}</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          {/* Task Stats */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 gradient-primary rounded-full"></div>
              <span className="text-gray-600">
                {completedTasks} of {totalTasks} completed
              </span>
            </div>
          </div>

          {/* Progress Ring */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                Today's Progress
              </p>
              <p className="text-xs text-gray-500">
                {totalTasks === 0 ? 'No tasks yet' : `${completedTasks}/${totalTasks} tasks`}
              </p>
            </div>
            
            <ProgressRing
              progress={loading ? 0 : progress}
              size={56}
              strokeWidth={5}
            />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;