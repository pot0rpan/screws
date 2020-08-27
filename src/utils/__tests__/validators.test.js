import * as validators from '../validators';

const { validate } = validators;

describe('validate function', () => {
  it('validates required', () => {
    const validator = validators.VALIDATOR_REQUIRE();

    expect(validate('', [validator])).toBe(false);
    expect(validate(' ', [validator])).toBe(false);

    expect(validate('a', [validator])).toBe(true);
  });

  it('validates min length', () => {
    const validator = validators.VALIDATOR_MINLENGTH('2');

    expect(validate('', [validator])).toBe(false);
    expect(validate('a ', [validator])).toBe(false);

    expect(validate('ab', [validator])).toBe(true);
  });

  it('validates max length', () => {
    const validator = validators.VALIDATOR_MAXLENGTH(2);

    expect(validate('abc', [validator])).toBe(false);

    expect(validate('', [validator])).toBe(true);
    expect(validate(' ab ', [validator])).toBe(true);
  });

  it('validates min number', () => {
    const validator = validators.VALIDATOR_MIN(2);

    expect(validate('0', [validator])).toBe(false);
    expect(validate('1', [validator])).toBe(false);

    expect(validate('2', [validator])).toBe(true);
  });

  it('validates max number', () => {
    const validator = validators.VALIDATOR_MAX(2);

    expect(validate('3', [validator])).toBe(false);

    expect(validate('1', [validator])).toBe(true);
    expect(validate('2', [validator])).toBe(true);
  });

  it('validates url', () => {
    const validator = validators.VALIDATOR_URL();

    expect(validate('http://example', [validator])).toBe(false);
    expect(validate('https://example.c', [validator])).toBe(false);
    expect(validate('javascript:alert(1)', [validator])).toBe(false);
    expect(validate('localhost:3000', [validator])).toBe(false);

    expect(validate('example.com', [validator])).toBe(true);
    expect(validate('http://example.co', [validator])).toBe(true);
    expect(validate('https://example.com', [validator])).toBe(true);
  });

  it('validates safe url code', () => {
    const validator = validators.VALIDATOR_SAFECODE();

    expect(validate('no spaces', [validator])).toBe(false);
    expect(validate('no$ymbols', [validator])).toBe(false);

    expect(validate('only-DASHES-a110w3d', [validator])).toBe(true);
  });
});
