import { Tooltip } from "@nextui-org/react";
import clsx from "clsx";

interface ButtonWithIconProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  content?: string;
}

const ButtonWithIcon = ({
  children,
  onClick,
  className,
  disabled,
  content,
}: ButtonWithIconProps) => {
  return (
    <Tooltip
      showArrow
      content={content}
      placement="top"
      className="rounded-md bg-opacity-90 max-w-96"
      closeDelay={1}
    >
      <button
        onClick={onClick}
        className={clsx("p-2.5 rounded-lg", className ? className : "")}
        disabled={disabled ? disabled : false}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default ButtonWithIcon;
