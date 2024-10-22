const API_URL = 'http://localhost:5000/api'; // Adjust the port as necessary

// Function to get the profile
export const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
};

// Function to create or update the profile
export const updateProfile = async (profileData, token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: profileData,
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return response.json();
};
