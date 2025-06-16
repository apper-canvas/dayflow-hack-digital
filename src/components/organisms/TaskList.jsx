import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskItem from '@/components/molecules/TaskItem';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import ApperIcon from '@/components/ApperIcon';
import { taskService, categoryService } from '@/services';

const EmptyState = ({ selectedCategories, onClearFilters }) => (
  <motion.div
    className="text-center py-12"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
    </motion.div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">
      {selectedCategories.length > 0 ? 'No tasks in selected categories' : 'No tasks yet'}
    </h3>
    <p className="mt-2 text-gray-500">
      {selectedCategories.length > 0 
        ? 'Try selecting different categories or create a new task.'
        : 'Create your first task to get started with DayFlow!'}
    </p>
    {selectedCategories.length > 0 && (
      <motion.button
        onClick={onClearFilters}
        className="mt-4 px-4 py-2 text-primary hover:text-primary/80 font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Clear filters
      </motion.button>
    )}
  </motion.div>
);

const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <div className="animate-pulse flex items-start gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <motion.div
    className="text-center py-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load tasks</h3>
    <p className="mt-2 text-gray-500">Something went wrong. Please try again.</p>
    <motion.button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Try again
    </motion.button>
  </motion.div>
);

const TaskList = ({ onTaskUpdate, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
    onTaskUpdate?.(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
    onTaskUpdate?.();
  };

  const handleCategoryToggle = (categoryName) => {
    if (categoryName === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(categoryName)
          ? prev.filter(cat => cat !== categoryName)
          : [...prev, categoryName]
      );
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(task.category);
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by selected criteria
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  if (loading) {
    return <SkeletonLoader count={5} />;
  }

  if (error) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="created">Created</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <EmptyState 
            selectedCategories={selectedCategories}
            onClearFilters={() => setSelectedCategories([])}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {sortedTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TaskItem
                  task={task}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleTaskDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Task Summary */}
      {sortedTasks.length > 0 && (
        <motion.div
          className="bg-surface/50 rounded-lg p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600">
            Showing {sortedTasks.length} of {tasks.length} tasks
            {selectedCategories.length > 0 && (
              <span> in {selectedCategories.join(', ')}</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;