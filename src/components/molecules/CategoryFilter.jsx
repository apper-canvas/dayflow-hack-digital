import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const CategoryFilter = ({ 
  categories = [], 
  selectedCategories = [], 
  onCategoryToggle,
  className = '' 
}) => {
  const allCategories = [
    { name: 'all', color: '#6B7280', taskCount: categories.reduce((sum, cat) => sum + cat.taskCount, 0) },
    ...categories
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allCategories.map((category) => {
        const isSelected = category.name === 'all' 
          ? selectedCategories.length === 0 
          : selectedCategories.includes(category.name);

        return (
          <motion.button
            key={category.name}
            onClick={() => onCategoryToggle?.(category.name)}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
              transition-all duration-200 border-2
              ${isSelected 
                ? 'gradient-primary text-white border-transparent shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className={`w-3 h-3 rounded-full ${isSelected ? 'bg-white/30' : ''}`}
              style={{ 
                backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : category.color 
              }}
            />
            
            <span className="capitalize">
              {category.name === 'all' ? 'All Tasks' : category.name}
            </span>
            
            <Badge 
              variant={isSelected ? 'secondary' : 'default'}
              size="sm"
              className={isSelected ? 'bg-white/20 text-white' : ''}
            >
              {category.taskCount}
            </Badge>
          </motion.button>
        );
      })}
      
      {selectedCategories.length > 0 && (
        <motion.button
          onClick={() => onCategoryToggle?.('all')}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="X" size={14} />
          Clear
        </motion.button>
      )}
    </div>
  );
};

export default CategoryFilter;