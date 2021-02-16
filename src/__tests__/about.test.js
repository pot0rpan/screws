import { render, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import AboutPage from '../pages/about';

const cookieBtnMatch = /clear cookie/i;

describe('/about page', () => {
  it('renders page with no `Clear` button if no cookies', () => {
    const { getByText, queryByText } = render(<AboutPage />);

    expect(getByText(/about screws/i)).toBeInTheDocument();
    expect(queryByText(cookieBtnMatch)).toBeNull();
  });

  it('renders page with clickable button to clear set cookies', async () => {
    const cookie = `${COOKIE_SKIP_REDIRECT_CONFIRMATION}=true`;
    document.cookie = cookie;

    const { getByText, queryByText } = render(<AboutPage />);

    const cookieBtn = getByText(cookieBtnMatch);

    expect(document.cookie).toBe(cookie);
    expect(cookieBtn).not.toBeDisabled();

    act(() => {
      user.click(cookieBtn);
    });

    expect(document.cookie).toBe('');
    expect(queryByText(cookieBtnMatch)).toBeNull();
  });
});
