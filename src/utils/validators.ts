import { BASE_URL } from '../config';
import { UrlRegExp } from './urls';

const SafeCodeRegExp = new RegExp(/^[a-zA-Z0-9-]+$/);

const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_URL = 'URL';
const VALIDATOR_TYPE_SAFECODE = 'SAFECODE';

export type ValidatorType = {
  type: string;
  val?: number;
};

type ValidatorFunctionType = (val?: number) => ValidatorType;

export const VALIDATOR_REQUIRE: ValidatorFunctionType = () => ({
  type: VALIDATOR_TYPE_REQUIRE,
});
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH: ValidatorFunctionType = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val,
});
export const VALIDATOR_MAXLENGTH: ValidatorFunctionType = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val,
});
export const VALIDATOR_MIN: ValidatorFunctionType = (val) => ({
  type: VALIDATOR_TYPE_MIN,
  val,
});
export const VALIDATOR_MAX: ValidatorFunctionType = (val) => ({
  type: VALIDATOR_TYPE_MAX,
  val,
});
export const VALIDATOR_EMAIL: ValidatorFunctionType = () => ({
  type: VALIDATOR_TYPE_EMAIL,
});
export const VALIDATOR_URL: ValidatorFunctionType = () => ({
  type: VALIDATOR_TYPE_URL,
});
export const VALIDATOR_SAFECODE: ValidatorFunctionType = () => ({
  type: VALIDATOR_TYPE_SAFECODE,
});

export const validate = (value: string, validators: ValidatorType[]) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= (validator.val || 0);
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= (validator.val || Infinity);
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= (validator.val || 0);
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= (validator.val || Infinity);
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_URL) {
      isValid =
        isValid &&
        UrlRegExp.test(value) &&
        value.toLowerCase().indexOf(BASE_URL.replace(/^https?:\/\//, '')) ===
          -1;
    }
    if (validator.type === VALIDATOR_TYPE_SAFECODE) {
      isValid = isValid && (value === '' || SafeCodeRegExp.test(value));
    }
  }
  return isValid;
};
