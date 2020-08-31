import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LookupUrl from '../LookupUrl';

const _fetchResponse = {
  redirected: false,
  requestUrl: 'https://example.com',
  responseUrl: 'https://example.com',
  preview: null,
};

const inputLabelMatch = /url/i;
const buttonTextMatch = /unscrew/i;

const submitUrl = async (url, input, submitBtn) => {
  userEvent.type(input, url);
  await act(async () => {
    await userEvent.click(submitBtn);
  });
};

beforeEach(() => {
  fetch.resetMocks();
});

describe('LookupUrl Component', () => {
  it('has an input and button to lookup a URL', () => {
    const { getByLabelText, getByText } = render(<LookupUrl />);

    expect(getByLabelText(inputLabelMatch)).toBeInTheDocument();
    expect(getByText(buttonTextMatch)).toBeInTheDocument();
  });

  it('has the submit button disabled until form is filled out', () => {
    const { getByText } = render(<LookupUrl />);
    expect(getByText(buttonTextMatch)).toBeDisabled();
  });

  it('enables submit button once input has valid url', () => {
    const { getByLabelText, getByText } = render(<LookupUrl />);

    const input = getByLabelText(inputLabelMatch);
    const button = getByText(buttonTextMatch);

    userEvent.type(input, 'not-a-url');
    expect(button).toBeDisabled();

    userEvent.type(input, 'example.com');
    expect(button).not.toBeDisabled();
  });

  it('posts url to api upon form submission', async () => {
    fetch.mockResponseOnce(JSON.stringify(_fetchResponse));

    const { getByLabelText, getByText } = render(<LookupUrl />);

    const input = getByLabelText(inputLabelMatch);
    const button = getByText(buttonTextMatch);

    await submitUrl('example.com', input, button);

    expect(fetch).toBeCalledTimes(1);
  });

  it('disables submit button if url input has not changed', async () => {
    fetch.mockResponseOnce(JSON.stringify(_fetchResponse));

    const { getByLabelText, getByText } = render(<LookupUrl />);

    const input = getByLabelText(inputLabelMatch);
    const button = getByText(buttonTextMatch);

    await submitUrl('example.com', input, button);

    expect(fetch).toBeCalledTimes(1);
    expect(button).toBeDisabled();

    userEvent.type(input, 'example.co');
    expect(button).not.toBeDisabled();
  });

  it('renders plain link to url once url is fetched if no preview data', async () => {
    fetch.mockResponseOnce(JSON.stringify(_fetchResponse));

    const { getByLabelText, getByText } = render(<LookupUrl />);

    await submitUrl(
      'example.com',
      getByLabelText(inputLabelMatch),
      getByText(buttonTextMatch)
    );

    expect(fetch).toBeCalledTimes(1);

    expect(getByText(/example.com/)).toHaveAttribute('href');
    expect(getByText('No preview available')).toBeInTheDocument();
  });

  it('renders redirected warning box if url was redirected', async () => {
    const fetchResponse = {
      ..._fetchResponse,
      redirected: true,
      responseUrl: 'https://www.example.com',
    };
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { getByLabelText, getByText } = render(<LookupUrl />);

    await submitUrl(
      'example.com',
      getByLabelText(inputLabelMatch),
      getByText(buttonTextMatch)
    );

    expect(fetch).toBeCalledTimes(1);

    expect(getByText(/redirected/i)).toBeInTheDocument();
    expect(getByText(fetchResponse.requestUrl)).toHaveAttribute(
      'href',
      fetchResponse.requestUrl
    );
    expect(
      getByText(fetchResponse.requestUrl).nextSibling.nextSibling
    ).toHaveAttribute('href', fetchResponse.responseUrl);
    expect(getByText('No preview available')).toBeInTheDocument();
  });

  it('renders preview data if available', async () => {
    const fetchResponse = {
      ..._fetchResponse,
      preview: {
        title: 'title',
        description: 'description',
        image: { url: 'https://scre.ws/screws.png' },
      },
    };
    fetch.mockResponseOnce(JSON.stringify(fetchResponse));

    const { getByLabelText, getByText, getByAltText } = render(<LookupUrl />);

    await submitUrl(
      'example.com',
      getByLabelText(inputLabelMatch),
      getByText(buttonTextMatch)
    );

    expect(fetch).toBeCalledTimes(1);

    expect(getByText(fetchResponse.preview.title)).toHaveAttribute(
      'href',
      fetchResponse.responseUrl
    );
    expect(getByText(fetchResponse.preview.description)).toBeInTheDocument();
    expect(getByAltText(/preview image/i)).toBeInTheDocument();
  });
});
