import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';

import { AdminUserType } from '../types/auth';
import Layout from '../components/layout/Layout';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Dashboard from '../components/admin/Dashboard';

const AdminPage: NextPage = () => {
  const [session, loading] = useSession();

  const fixedUser: AdminUserType | null = session?.user
    ? {
        name: session.user.name || '',
        discriminator: session.user.email || '',
        image: session.user.image || '',
      }
    : null;

  const handleLogin = () => {
    signIn();
  };

  return (
    <Layout title="/admin">
      <div className="container">
        {loading ? (
          <LoadingSpinner asOverlay />
        ) : fixedUser ? (
          <Dashboard user={fixedUser} signOut={signOut} />
        ) : (
          <div id="login">
            <h2>Please log in first</h2>
            <Button onClick={handleLogin}>Log in</Button>
          </div>
        )}
      </div>

      <style jsx>
        {`
          #login {
            text-align: center;
          }
        `}
      </style>
    </Layout>
  );
};

export default AdminPage;
