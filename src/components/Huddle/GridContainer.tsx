import clsx from 'clsx';
import { FC } from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

const GridContainer: FC<GridContainerProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'bg-gray-100 relative rounded-lg flex flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GridContainer;
