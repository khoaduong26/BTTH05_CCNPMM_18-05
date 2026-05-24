import { Card } from 'antd';

const AuthPageShell = ({ eyebrow, title, description, footer, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-page__panel">
        <section className="auth-page__hero">
          <span className="auth-page__eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>

        <Card className="auth-page__card" bordered={false}>
          {children}
          {footer}
        </Card>
      </div>
    </div>
  );
};

export default AuthPageShell;