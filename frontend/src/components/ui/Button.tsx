interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'w-full px-4 py-2 rounded-lg font-medium transition focus:ring-4 focus:ring-blue-300';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
  };

  return (
    <button
      type={props.type || 'button'}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${props.disabled ? 'opacity-50 disabled:cursor-not-allowed' : ''}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
