import axios from 'axios';

const baseURL = 'http://localhost:3001/';

export const getStudentData = async () => {
    try {
        const response = await axios.get(`${baseURL}student/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteData = async (userId) => {
    try {
        const response = await axios.delete(`${baseURL}student/${userId}`);
        console.log(response.data.message);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('User not found');
        } else {
            console.log('Error deleting user');
        }
    }
};

export const updateData = async (data, id) => {
    try {
        const response = await fetch(`${baseURL}student/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const updatedAuthor = await response.json();
            console.log(updatedAuthor);
        } else {
            console.error('Failed to update data');
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }
};

export const AddStudent = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}saveFormData`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
