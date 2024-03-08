import React, { useState } from 'react';

function StudentForm({ closeForm, saveFormData, isEditForm, data }) {
    const [formData, setFormData] = useState({
        name: "",
        age: 0,
        subject1: "",
        mark1: "",
        subject2: "",
        mark2: "",
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};
        if (!formData.name) {
            formIsValid = false;
            errors["name"] = "Student Name is required.";
        }
        if (!formData.subject1) {
            formIsValid = false;
            errors["subject1"] = "Subject 1 is required.";
        }
        if (!formData.mark1) {
            formIsValid = false;
            errors["mark1"] = "Mark 1 is required.";
        }
        if (!formData.subject2) {
            formIsValid = false;
            errors["subject2"] = "Subject 2 is required.";
        }
        if (!formData.mark2) {
            formIsValid = false;
            errors["mark2"] = "Mark 2 is required.";
        }

        // Validate age, mark1, and mark2 to be integers not exceeding 100
        ['age', 'mark1', 'mark2'].forEach(field => {
            if (formData[field]) {
                const value = parseInt(formData[field], 10);
                if (isNaN(value) || value < 0 || value > 100) {
                    formIsValid = false;
                    errors[field] = `${field} must be an integer between 0 and 100.`;
                }
            }
        });

        setErrors(errors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (validateForm()) {
            saveFormData(formData);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Form</h2>
            <form>
                <label>Student Name:</label>
                <input type="text" name="name" disabled={isEditForm} value={isEditForm ? data.name : formData.name} onChange={handleInputChange} />
                {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}

                <label>Age:</label>
                <input type="number" name="age" disabled={isEditForm} value={isEditForm ? data.age : formData.age} onChange={handleInputChange} />
                {errors.age && <div style={{ color: "red" }}>{errors.age}</div>}

                <label>Subject 1:</label>
                <input type="text" name="subject1" disabled={isEditForm} value={isEditForm ? data.subject1 : formData.subject1} onChange={handleInputChange} />
                {errors.subject1 && <div style={{ color: "red" }}>{errors.subject1}</div>}

                <label>Mark 1:</label>
                <input type="text" name="mark1" disabled={isEditForm} value={isEditForm ? data.mark1 : formData.mark1} onChange={handleInputChange} />
                {errors.mark1 && <div style={{ color: "red" }}>{errors.mark1}</div>}

                <label>Subject 2:</label>
                <input type="text" name="subject2" disabled={isEditForm} value={isEditForm ? data.subject2 : formData.subject2} onChange={handleInputChange} />
                {errors.subject2 && <div style={{ color: "red" }}>{errors.subject2}</div>}

                <label>Mark 2:</label>
                <input type="text" name="mark2" disabled={isEditForm} value={isEditForm ? data.mark2 : formData.mark2} onChange={handleInputChange} />
                {errors.mark2 && <div style={{ color: "red" }}>{errors.mark2}</div>}

                {!isEditForm && (
                    <button type="button" onClick={handleSave}>Save</button>
                )}
                <button type="button" onClick={closeForm}>Cancel</button>
            </form>
        </div>
    );
}

export default StudentForm;
