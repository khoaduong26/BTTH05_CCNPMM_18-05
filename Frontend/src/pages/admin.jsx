import { useContext } from 'react';
import ProfileCard from '../components/auth/ProfileCard';
import { AuthContext } from '../components/context/auth.context';

const AdminPage = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="profile-shell">
      <ProfileCard
        title="Admin Profile"
        description="Administrator account with elevated access rights."
        user={auth.user}
      />
    </div>
  );
};

export default AdminPage;