import { Tag } from 'antd';

const ProfileCard = ({ title, description, user }) => {
  const role = user?.role || 'USER';

  return (
    <section className="profile-card">
      <div className="profile-card__header">
        <div>
          <p className="profile-card__badge">{role}</p>
          <h1 className="profile-card__title">{title}</h1>
          <p className="profile-card__description">{description}</p>
        </div>
        <Tag color={role === 'ADMIN' ? 'volcano' : 'blue'}>{role}</Tag>
      </div>

      <div className="profile-card__grid">
        <div className="profile-card__field">
          <span className="profile-card__label">User ID</span>
          <div className="profile-card__value">{user?.id || 'N/A'}</div>
        </div>

        <div className="profile-card__field">
          <span className="profile-card__label">Email</span>
          <div className="profile-card__value">{user?.email || 'N/A'}</div>
        </div>

        <div className="profile-card__field">
          <span className="profile-card__label">Role</span>
          <div className="profile-card__value">{role}</div>
        </div>

        <div className="profile-card__field">
          <span className="profile-card__label">Name</span>
          <div className="profile-card__value">{user?.name || 'N/A'}</div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;