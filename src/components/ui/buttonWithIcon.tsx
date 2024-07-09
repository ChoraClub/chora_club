import clsx from 'clsx';

interface ButtonWithIconProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const ButtonWithIcon = ({
  children,
  onClick,
  className,
  disabled,
}: ButtonWithIconProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'bg-gray-600/50 p-2.5 rounded-lg hover:bg-gray-600',
        className ? className : ''
      )}
      disabled={disabled ? disabled : false}
    >
      {children}
    </button>
  );
};

export default ButtonWithIcon;
