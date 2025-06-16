import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  priority,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'gradient-primary text-white',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  };

  const priorityVariants = {
    high: 'gradient-high text-white',
    medium: 'gradient-medium text-white', 
    low: 'gradient-low text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const badgeVariant = priority ? priorityVariants[priority] : variants[variant];
  
  const badgeClasses = `
    ${baseClasses}
    ${badgeVariant}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <motion.span
      className={badgeClasses}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;