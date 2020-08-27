import { render, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import { VALIDATOR_MINLENGTH } from '../../../utils/validators';
import Input from '../Input';

describe('Input component', () => {
  it('renders basic input with defaults', () => {
    const onInput = jest.fn();
    const { getByLabelText } = render(
      <Input id="id" label="Label" onInput={onInput} element="input" />
    );

    const input = getByLabelText('Label');
    expect(input).toBeInTheDocument();
  });

  it('performs basic functionality', () => {
    const onInput = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        id="id"
        label="Label"
        onInput={onInput}
        element="input"
        type="text"
        placeholder="placeholder"
      />
    );

    const input = getByPlaceholderText('placeholder');

    expect(input).toHaveAttribute('type', 'text');

    input.focus();
    user.type(input, 'input');
    act(() => {
      input.blur();
    });
    expect(onInput).toHaveBeenLastCalledWith('id', 'input', true);
    expect(input.parentElement).not.toHaveClass('invalid');
  });

  it('validates input based on provided validators', () => {
    const onInput = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <Input
        id="id"
        label="Label"
        onInput={onInput}
        element="input"
        errorText="error text"
        validators={[VALIDATOR_MINLENGTH(2)]}
      />
    );

    const input = getByLabelText('Label');

    // Type some invalid input
    act(() => {
      input.focus();
      user.type(input, '1');
    });
    expect(queryByText('error text')).not.toBeInTheDocument();

    // Blur input to trigger validation
    act(() => {
      input.blur();
    });
    expect(queryByText('error text')).toBeInTheDocument();

    // Type valid input
    act(() => {
      user.type(input, '123');
    });
    expect(queryByText('error text')).not.toBeInTheDocument();
  });

  it('renders select element if `element` is set to `select`', () => {
    const onInput = jest.fn();
    const options = [
      { value: '1', label: '1 Hour' },
      { value: '2', label: '2 Hours' },
    ];

    const { getByLabelText } = render(
      <Input
        id="id"
        label="Label"
        onInput={onInput}
        element="select"
        errorText="error text"
        options={options}
      />
    );

    // Verify it loads with first option by default
    const select = getByLabelText('Label');
    expect(select).toHaveDisplayValue(options[0].label);

    // Select second option
    user.selectOptions(select, '2');
    expect(select).toHaveDisplayValue(options[1].label);

    expect(onInput).toBeCalledTimes(2);
  });
});
