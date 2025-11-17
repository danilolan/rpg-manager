interface EmptyStateProps {
  className?: string;
  type?: 'uncategorized' | 'date' | 'generic';
  text?: string;
}

export function EmptyState({ className, type = 'generic', text }: EmptyStateProps) {
  const getDefaultText = () => {
    switch (type) {
      case 'uncategorized':
        return 'Uncategorized';
      case 'date':
        return 'No date';
      default:
        return 'Not specified';
    }
  };

  return (
    <span className={`italic text-yellow-500 dark:text-yellow-400 ${className || ''}`}>
      {text || getDefaultText()}
    </span>
  );
}
