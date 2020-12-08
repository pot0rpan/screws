import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import mockReact from 'react'; // Must begin with 'mock' or Jest error

global.fetch = fetchMock;

// Fix 'Warning: An update to Link inside a test was not wrapped in act(...).'
jest.mock('next/link', () => ({ children, ...rest }) =>
  mockReact.cloneElement(children, rest)
);
