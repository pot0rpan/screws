import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}

const Button: React.FC<Props> = ({
  primary = true,
  children,
  ...buttonAttributes
}) => {
  return (
    <button {...buttonAttributes} className={primary && 'primary'}>
      {children}
      <style jsx>
        {`
          button {
            --color: var(--danger);
            background-color: transparent;
            border: var(--border-width) solid var(--color);
            color: var(--color);
            font-size: 1.1em;
            letter-spacing: 2px;
            padding: 0.75em;
            text-transform: uppercase;
          }
          button.primary {
            --color: var(--primary);
          }
          button:disabled {
            --color: var(--danger);
            opacity: 0.8;
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
