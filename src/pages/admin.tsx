import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';

import { SessionType, AdminUserType } from '../types/auth';
import Layout from '../components/Layout';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Dashboard from '../components/admin/Dashboard';

const AdminPage: NextPage = () => {
  const [session, loading]: [SessionType, boolean] = useSession();

  const fixedUser: AdminUserType | null = session?.user
    ? {
        name: session.user.name,
        discriminator: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <Layout title="/admin">
      <div className="container">
        {loading ? (
          <LoadingSpinner asOverlay />
        ) : session ? (
          <Dashboard user={fixedUser} signOut={signOut} />
        ) : (
          <div id="login">
            <h2>Please log in first</h2>
            <Button onClick={signIn}>Log in</Button>
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
