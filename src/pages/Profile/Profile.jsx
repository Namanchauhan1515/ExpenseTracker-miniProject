import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile, updateUserAvatar, changeUserPassword } from "../../services/userApi";
import "./Profile.css";

function Profile() {
    const { user, updateUser, refreshUser } = useAuth();

    // ------------------------------------------
    // Profile Details State
    // ------------------------------------------
    const [profileData, setProfileData] = useState({
        username: user?.username || "",
        email: user?.email || ""
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");

    // ------------------------------------------
    // Avatar Update State
    // ------------------------------------------
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [avatarSuccess, setAvatarSuccess] = useState("");

    // ------------------------------------------
    // Password Change State
    // ------------------------------------------
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // Fetch fresh user data on mount
    useEffect(() => {
        if (refreshUser) {
            refreshUser();
        }
    }, []);

    // Sync profile form when auth user changes
    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || "",
                email: user.email || ""
            });
        }
    }, [user]);

    // ------------------------------------------
    // Handle Profile Details Submit
    // ------------------------------------------
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");

        if (!profileData.username.trim() || !profileData.email.trim()) {
            setProfileError("Username and email are required");
            return;
        }

        try {
            setProfileLoading(true);

            const response = await updateUserProfile({
                username: profileData.username.trim(),
                email: profileData.email.trim()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile details");
            }

            // Immediately update user state across the app
            if (updateUser && data.data) {
                updateUser(data.data);
            }

            setProfileSuccess("Profile details updated successfully!");
        } catch (err) {
            console.error("Update profile error:", err);
            setProfileError(err.message || "Something went wrong while updating profile");
        } finally {
            setProfileLoading(false);
        }
    };

    // ------------------------------------------
    // Handle Avatar Selection & Upload
    // ------------------------------------------
    const handleAvatarSelect = (e) => {
        setAvatarError("");
        setAvatarSuccess("");
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        setAvatarError("");
        setAvatarSuccess("");

        if (!avatarFile) {
            setAvatarError("Please select an image file first");
            return;
        }

        try {
            setAvatarLoading(true);

            const formData = new FormData();
            formData.append("avatar", avatarFile);

            const response = await updateUserAvatar(formData);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload avatar");
            }

            // Immediately update user avatar across the app
            if (updateUser && data.data) {
                updateUser(data.data);
            }

            setAvatarSuccess("Avatar updated successfully!");
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (err) {
            console.error("Update avatar error:", err);
            setAvatarError(err.message || "Failed to upload avatar");
        } finally {
            setAvatarLoading(false);
        }
    };

    // ------------------------------------------
    // Handle Change Password Submit
    // ------------------------------------------
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!passwordData.oldPassword || !passwordData.newPassword) {
            setPasswordError("Current password and new password are required");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New password and confirm password do not match");
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await changeUserPassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                conformPassword: passwordData.confirmPassword,
                confirmPassword: passwordData.confirmPassword
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }

            setPasswordSuccess("Password changed successfully!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            console.error("Change password error:", err);
            setPasswordError(err.message || "Could not change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
          })
        : null;

    return (
        <div className="profile-page">
            <Sidebar />

            <main className="profile-main-content">
                <div className="profile-header">
                    <h1>Profile & Account Settings</h1>
                    <p className="profile-subtitle">
                        Manage your profile details, avatar, and account security
                    </p>
                </div>

                {/* Profile Overview Card */}
                <div className="profile-overview-card glass-card">
                    <div className="overview-avatar-wrapper">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username || "User avatar"}
                                className="overview-avatar-img"
                            />
                        ) : (
                            <div className="overview-avatar-placeholder">
                                {(user?.username?.[0] || "U").toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="overview-info">
                        <h2>{user?.username || "User Account"}</h2>
                        <span className="overview-email">{user?.email || "No email available"}</span>
                        {joinedDate && (
                            <span className="overview-joined">📅 Member since {joinedDate}</span>
                        )}
                    </div>
                </div>

                <div className="profile-grid">
                    {/* 1. Change Avatar Card */}
                    <div className="glass-card profile-card">
                        <h3>Change Avatar</h3>
                        <p className="card-desc">Upload a new profile photo (Cloudinary)</p>

                        {avatarError && <div className="alert-error" style={{ marginBottom: 16 }}>{avatarError}</div>}
                        {avatarSuccess && <div className="alert-success" style={{ marginBottom: 16 }}>{avatarSuccess}</div>}

                        <form onSubmit={handleAvatarUpload} className="avatar-upload-form">
                            <div className="avatar-preview-container">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="avatar-preview-img"
                                    />
                                ) : user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="Current Avatar"
                                        className="avatar-preview-img"
                                    />
                                ) : (
                                    <div className="avatar-preview-placeholder">
                                        {(user?.username?.[0] || "U").toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div className="avatar-actions">
                                <label htmlFor="avatar-file-input" className="btn-secondary avatar-choose-btn">
                                    📁 Choose Image
                                </label>
                                <input
                                    id="avatar-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                    style={{ display: "none" }}
                                />

                                {avatarFile && (
                                    <span className="selected-filename">
                                        {avatarFile.name}
                                    </span>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={!avatarFile || avatarLoading}
                                >
                                    {avatarLoading ? "Uploading..." : "Save Avatar"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Edit Profile Details Card */}
                    <div className="glass-card profile-card">
                        <h3>Edit Profile Details</h3>
                        <p className="card-desc">Update your display username and email address</p>

                        {profileError && <div className="alert-error" style={{ marginBottom: 16 }}>{profileError}</div>}
                        {profileSuccess && <div className="alert-success" style={{ marginBottom: 16 }}>{profileSuccess}</div>}

                        <form onSubmit={handleProfileSubmit} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="profile-username">Username</label>
                                <input
                                    id="profile-username"
                                    type="text"
                                    className="form-control"
                                    value={profileData.username}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            username: e.target.value
                                        }))
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="profile-email">Email Address</label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    className="form-control"
                                    value={profileData.email}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            email: e.target.value
                                        }))
                                    }
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={profileLoading}
                                style={{ marginTop: 8 }}
                            >
                                {profileLoading ? "Saving Changes..." : "Save Details"}
                            </button>
                        </form>
                    </div>

                    {/* 3. Reset / Change Password Card */}
                    <div className="glass-card profile-card profile-card-full">
                        <h3>Change Password</h3>
                        <p className="card-desc">Update your login password securely</p>

                        {passwordError && <div className="alert-error" style={{ marginBottom: 16 }}>{passwordError}</div>}
                        {passwordSuccess && <div className="alert-success" style={{ marginBottom: 16 }}>{passwordSuccess}</div>}

                        <form onSubmit={handlePasswordSubmit} className="password-form">
                            <div className="password-grid">
                                <div className="form-group">
                                    <label htmlFor="old-password">Current Password *</label>
                                    <input
                                        id="old-password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter current password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) =>
                                            setPasswordData((prev) => ({
                                                ...prev,
                                                oldPassword: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new-password">New Password *</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Min. 6 characters"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData((prev) => ({
                                                ...prev,
                                                newPassword: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm New Password *</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Repeat new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData((prev) => ({
                                                ...prev,
                                                confirmPassword: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="password-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? "Updating Password..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
