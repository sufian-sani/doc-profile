import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', bio: '', profilePicture: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token'); // Assuming you're storing the JWT in localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(token);
                setProfile(data);
            } catch (err) {
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProfile = await updateProfile(profile, token);
            setProfile(updatedProfile);
            alert('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to the login page
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>User Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Bio:</label>
                    <input
                        type="text"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Profile Picture URL:</label>
                    <input
                        type="text"
                        name="profilePicture"
                        value={profile.profilePicture}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
        </div>
    );
};

export default Profile;
