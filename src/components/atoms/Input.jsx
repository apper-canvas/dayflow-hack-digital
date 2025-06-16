import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || '');

  const handleChange = (e) => {
    setHasValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const inputClasses = `
    w-full px-4 py-3 bg-white border-2 rounded-lg
    transition-all duration-200
    placeholder-transparent
    focus:outline-none focus:ring-0
    ${error 
      ? 'border-error focus:border-error' 
      : focused 
        ? 'border-primary focus:border-primary' 
        : 'border-gray-200 hover:border-gray-300'
    }
    ${icon ? 'pl-12' : ''}
    ${className}
  `.trim();

  const labelClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    ${focused || hasValue 
      ? 'top-2 text-xs text-primary font-medium' 
      : 'top-3.5 text-sm text-gray-500'
    }
    ${icon && !(focused || hasValue) ? 'left-12' : ''}
    ${error ? 'text-error' : ''}
  `.trim();

  return (
    <div className={`relative ${containerClassName}`}>
      {icon && (
        <div className="absolute left-4 top-3.5 z-10">
          <ApperIcon 
            name={icon} 
            size={18} 
            className={error ? 'text-error' : focused ? 'text-primary' : 'text-gray-400'} 
          />
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        placeholder={label}
        {...props}
      />
      
      {label && (
        <motion.label
          className={labelClasses}
          animate={{
            y: focused || hasValue ? -8 : 0,
            scale: focused || hasValue ? 0.85 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;