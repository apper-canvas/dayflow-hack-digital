import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const TaskItem = ({ task, onUpdate, onDelete, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      
      if (updatedTask.completed) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 800);
        toast.success('Task completed! 🎉');
      }
      
      onUpdate?.(updatedTask);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    
    setLoading(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        title: editTitle.trim()
      });
      setIsEditing(false);
      onUpdate?.(updatedTask);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      setEditTitle(task.title);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await taskService.delete(task.Id);
      onDelete?.(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    
    const date = new Date(dueDate);
    if (isPast(date) && !task.completed) return 'text-error font-medium';
    if (isToday(date)) return 'text-warning font-medium';
    return 'text-gray-500';
  };

  return (
    <motion.div
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={loading}
          />
          
          {/* Celebration particles */}
          <AnimatePresence>
            {showParticles && (
              <div className="absolute -top-1 -left-1">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent rounded-full"
                    initial={{ 
                      opacity: 1, 
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: 0,
                      scale: [0, 1, 0],
                      x: (Math.random() - 0.5) * 40,
                      y: (Math.random() - 0.5) * 40
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                autoFocus
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  loading={loading}
                  disabled={!editTitle.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 
                className={`font-medium break-words ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge priority={task.priority} size="sm">
                  {task.priority}
                </Badge>
                
                {task.category && (
                  <Badge variant="secondary" size="sm">
                    {task.category}
                  </Badge>
                )}
                
                {task.dueDate && (
                  <div className={`text-sm ${getDueDateStyle(task.dueDate)} flex items-center`}>
                    <ApperIcon name="Clock" size={14} className="mr-1" />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              icon="Edit2"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="p-2"
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-error hover:text-error hover:bg-error/5"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskItem;