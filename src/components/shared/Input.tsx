import {
  useReducer,
  useEffect,
  Reducer,
  useRef,
  MutableRefObject,
} from 'react';

import { validate, ValidatorType } from '../../utils/validators';

const inputReducer = (
  state: InputStateType,
  action: InputActionType
): InputStateType => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val || '',
        isValid: validate(action.val || '', action.validators || []),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

type InputStateType = {
  value: string;
  isValid: boolean;
  isTouched: boolean;
};

type InputActionType = {
  type: string;
  val?: string;
  validators?: ValidatorType[];
};

type InputType = HTMLInputElement | HTMLSelectElement;

interface Props extends React.InputHTMLAttributes<InputType> {
  id: string;
  label: string;
  onInput: any;
  validators?: ValidatorType[];
  errorText?: string;
  initialValue?: string;
  initialValidity?: boolean;
  element: 'input' | 'select';
  options?: { value: any; label: string }[];
  autoFocus?: boolean;
}

const Input: React.FC<Props> = ({
  id,
  label,
  type,
  validators = [],
  errorText,
  onInput,
  initialValue,
  initialValidity,
  element,
  options,
  autoFocus = false,
  ...inputAttributes
}) => {
  const [inputState, dispatch] = useReducer<
    Reducer<InputStateType, InputActionType>
  >(inputReducer, {
    value: initialValue || '',
    isValid: initialValidity || false,
    isTouched: false,
  });
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null!);

  const { value, isValid } = inputState;

  // Make sure input gets focused if applicable
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  // Send changes to parent
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // Handle change locally
  const changeHandler = (e: React.ChangeEvent<InputType>) => {
    dispatch({ type: 'CHANGE', val: e.target.value, validators });
  };

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' });
  };

  if (element === 'input') {
    return (
      <div
        className={`input ${
          !inputState.isValid && inputState.isTouched && 'invalid'
        }`}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          onChange={changeHandler}
          value={inputState.value}
          onBlur={touchHandler}
          ref={inputRef as MutableRefObject<HTMLInputElement>}
          autoFocus={autoFocus}
          {...inputAttributes}
        />
        {!inputState.isValid && inputState.isTouched && (
          <small className="error-text">{errorText}</small>
        )}

        <style jsx>
          {`
            .input {
              color: var(--text);
              display: flex;
              flex-direction: column;
              font-weight: bold;
              padding: 0.5rem 0;
            }
            .input input {
              background-color: var(--primary);
              border: var(--border-width) solid var(--primary);
              color: var(--bg);
              font-size: inherit;
              margin: 0.5rem 0;
              outline: none;
              padding: 0.5rem;
            }
            .input input:focus {
              background-color: var(--primary-muted);
            }
            .error-text {
              color: var(--danger);
            }

            .input input ::-webkit-input-placeholder {
              /* Chrome/Opera/Safari */
              color: var(--text-placeholder);
            }
            .input input ::-moz-placeholder {
              /* Firefox 19+ */
              color: var(--text-placeholder);
              opacity: 1;
            }
            .input input :-moz-placeholder {
              /* Firefox 18- */
              color: var(--text-placeholder);
              opacity: 1;
            }
            .input input :-ms-input-placeholder {
              /* IE 10+ */
              color: var(--text-placeholder);
            }
          `}
        </style>
      </div>
    );
  } else if (element === 'select' && options?.length) {
    return (
      <div className="input">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          name={id}
          onChange={changeHandler}
          ref={inputRef as MutableRefObject<HTMLSelectElement>}
          autoFocus={autoFocus}
          defaultValue={initialValue}
        >
          {options.map((opt) => (
            <option id={opt.value} value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <style jsx>
          {`
            .input {
              color: var(--text);
              display: flex;
              flex-direction: column;
              font-weight: bold;
              padding: 0.5rem 0;
            }
            .input select {
              background-color: var(--primary);
              border: var(--border-width) solid var(--primary);
              color: var(--bg);
              font-size: inherit;
              margin: 0.5rem 0;
              outline: none;
              padding: 0.5rem;
              appearance: none;
              background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
              background-repeat: no-repeat, repeat;
              background-position: right 0.7em top 50%, 0 0;
              background-size: 0.65em auto, 100%;
            }
            .input option {
              background-color: var(--primary);
            }
            .input select:focus {
              background-color: var(--primary-muted);
            }
          `}
        </style>
      </div>
    );
  } else {
    return null;
  }
};

export default Input;
