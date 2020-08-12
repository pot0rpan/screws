/*
 * Usage:
 *
 * const [formState, inputHandler, setFormData] = useForm(
 *   {
 *     email: { value: '', isValid: false },
 *     password: { value: '', isValid: false },
 *   },
 *   false
 * );
 */

import { useReducer, useCallback } from 'react';

type FormStateType = {
  inputs: FormInputsType;
  isValid: boolean;
};

type FormInputsType = {
  [key: string]: FormInputType;
};

type FormInputType = {
  value: string | null;
  isValid: boolean;
};

type FormActionType = {
  type: string;
  isValid: boolean;
  inputId?: string;
  value?: string;
  inputs?: FormInputsType;
};

export type InputHandlerType = (
  id: string,
  value: string,
  isValid: boolean
) => void;

type SetFormDataType = (
  inputData: FormInputsType,
  formValidity: boolean
) => void;

const formReducer: (
  state: FormStateType,
  action: FormActionType
) => FormStateType = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      if (!action.inputId) return state;

      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) continue;

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      const newState: FormStateType = {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };

      return newState;

    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};

export const useForm = (
  initialInputs: FormInputsType,
  initialFormValidity: boolean
) => {
  const [formState, dispatch] = useReducer<
    (state: FormStateType, action: FormActionType) => FormStateType
  >(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      dispatch({ type: 'INPUT_CHANGE', value, isValid, inputId: id });
    },
    []
  );

  const setFormData = useCallback(
    (inputData: FormInputsType, formValidity: boolean) => {
      dispatch({ type: 'SET_DATA', inputs: inputData, isValid: formValidity });
    },
    []
  );

  const typedReturnArr: [FormStateType, InputHandlerType, SetFormDataType] = [
    formState,
    inputHandler,
    setFormData,
  ];

  return typedReturnArr;
};
