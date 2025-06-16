import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        
        <motion.div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200
            ${checked 
              ? 'gradient-primary border-transparent' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ApperIcon 
              name="Check" 
              size={14} 
              className="text-white font-bold" 
            />
          </motion.div>
        </motion.div>
      </div>
      
      {label && (
        <span className={`ml-3 text-sm ${checked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;