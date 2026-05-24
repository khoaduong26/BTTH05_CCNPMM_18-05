import { useContext } from "react";
import ProfileCard from "../components/auth/ProfileCard";
import { AuthContext } from "../components/context/auth.context";

const UserPage = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="profile-shell">
            <ProfileCard
                title="User Profile"
                description="User account verified by the backend JWT middleware."
                user={auth.user}
            />
        </div>
    )
}

export default UserPage;