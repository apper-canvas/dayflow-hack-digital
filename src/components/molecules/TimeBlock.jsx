import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TimeBlock = ({ 
  hour, 
  tasks = [], 
  onTaskClick,
  className = '' 
}) => {
  const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h:mm a');
  
  return (
    <motion.div
      className={`bg-white rounded-lg border border-gray-100 p-3 min-h-[80px] ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ shadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{timeLabel}</span>
        {tasks.length > 0 && (
          <Badge variant="primary" size="sm">
            {tasks.length}
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <ApperIcon name="Calendar" size={20} className="mx-auto mb-1 opacity-50" />
            <p className="text-xs">No tasks scheduled</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.Id}
              className={`
                p-2 rounded-lg border-l-4 cursor-pointer
                transition-all duration-200
                ${task.completed 
                  ? 'bg-gray-50 border-l-gray-300 opacity-60' 
                  : task.priority === 'high'
                    ? 'bg-red-50 border-l-red-400 hover:bg-red-100'
                    : task.priority === 'medium'
                      ? 'bg-blue-50 border-l-blue-400 hover:bg-blue-100'
                      : 'bg-green-50 border-l-green-400 hover:bg-green-100'
                }
              `}
              onClick={() => onTaskClick?.(task)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <p className={`text-sm font-medium break-words ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </p>
                
                {task.completed && (
                  <ApperIcon name="CheckCircle" size={16} className="text-success ml-2 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge priority={task.priority} size="sm">
                  {task.priority}
                </Badge>
                
                {task.category && (
                  <span className="text-xs text-gray-500 capitalize">
                    {task.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TimeBlock;