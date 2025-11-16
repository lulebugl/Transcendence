import { useRouterContext } from './context';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  state?: unknown;
}

export const Link = ({
  to,
  replace = false,
  state,
  children,
  onClick,
  ...props
}: LinkProps) => {
  const { navigate } = useRouterContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to, { replace, state });
    onClick?.(e);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

