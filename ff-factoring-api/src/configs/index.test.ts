import { stringFromEnv, intFromEnv, stringArrayFromEnv } from '@/configs';

describe('Config', () => {
  const variableName = 'FOOBAR123';
  const getStringValue = stringFromEnv(variableName);
  const getIntValue = intFromEnv(variableName);
  const getStringArrayValue = stringArrayFromEnv(variableName);

  test('should return the env value', () => {
    process.env[variableName] = 'testtest';
    expect(getStringValue()).toEqual('testtest');
  });

  test('should throw if the env value is not set', () => {
    process.env[variableName] = '';
    expect(getStringValue).toThrow('Missing FOOBAR123 variable');
  });

  test('should get a string array', () => {
    process.env[variableName] = 'a  ,b, c, ,';
    expect(getStringArrayValue()).toEqual(['a', 'b', 'c']);
  });

  test('should get an integer value', () => {
    process.env[variableName] = '42';
    expect(getIntValue()).toEqual(42);
  });
});
