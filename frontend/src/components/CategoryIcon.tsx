import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon = ({ name, className = 'w-5 h-5', size, color }: CategoryIconProps) => {
  // @ts-expect-error - Dynamic lucide icon indexing
  const IconComponent = Icons[name] || Icons.HelpCircle;

  return <IconComponent className={className} size={size} style={color ? { color } : undefined} />;
};
