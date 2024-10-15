import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', bio: '', profilePicture: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
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

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('bio', profile.bio);
            formData.append('profilePicture', selectedImage); // Include the image if uploaded
            console.log(selectedImage);

            const updatedProfile = await updateProfile(formData, token); // Adjust the API function to accept formData
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
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {selectedImage && (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Profile Preview"
                            style={{width: '100px', height: '100px', objectFit: 'cover'}}
                        />
                    )}
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleLogout}>Logout</button>
            {/* Logout Button */}
        </div>
    );
};

export default Profile;
