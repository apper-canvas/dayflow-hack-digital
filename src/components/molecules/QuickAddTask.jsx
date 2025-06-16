import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const QuickAddTask = ({ onTaskAdded, className = '' }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      // Parse natural language for quick date input
      let parsedDueDate = dueDate;
      if (!parsedDueDate && title.toLowerCase().includes('today')) {
        parsedDueDate = new Date().toISOString();
      } else if (!parsedDueDate && title.toLowerCase().includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        parsedDueDate = tomorrow.toISOString();
      } else if (parsedDueDate) {
        parsedDueDate = new Date(parsedDueDate).toISOString();
      }

      const newTask = await taskService.create({
        title: title.trim(),
        priority,
        category,
        dueDate: parsedDueDate || null
      });

      setTitle('');
      setDueDate('');
      setIsExpanded(false);
      onTaskAdded?.(newTask);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        priority: 'medium',
        category: 'work',
        dueDate: null
      });

      setTitle('');
      onTaskAdded?.(newTask);
      toast.success('Task added!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              icon="Plus"
              onFocus={() => setIsExpanded(true)}
              disabled={loading}
            />
          </div>
          
          {!isExpanded ? (
            <Button
              type="button"
              onClick={handleQuickAdd}
              disabled={!title.trim() || loading}
              loading={loading}
              icon="Plus"
              className="px-3"
            />
          ) : (
            <Button
              type="submit"
              disabled={!title.trim() || loading}
              loading={loading}
            >
              Add Task
            </Button>
          )}
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={loading}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </motion.div>

        {isExpanded && (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setDueDate('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAddTask;