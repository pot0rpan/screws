import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}

const Button: React.FC<Props> = ({
  primary,
  children,
  ...buttonAttributes
}) => {
  return (
    <button {...buttonAttributes} className={primary && 'primary'}>
      {children}
      <style jsx>
        {`
          button {
            --color: var(--primary);
            background-color: transparent;
            border: var(--border-width) solid var(--color);
            color: var(--color);
            font-size: 1.1em;
            letter-spacing: 2px;
            padding: 0.75em;
            text-transform: uppercase;
          }
          button:disabled {
            --color: var(--danger);
          }
          button:not(:disabled):hover,
          button:not(:disabled):focus {
            background-color: var(--color);
            border-color: var(--color);
            color: var(--bg);
            cursor: pointer;
          }
        `}
      </style>
    </button>
  );
};

export default Button;
