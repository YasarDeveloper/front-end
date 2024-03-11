import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        if (isEditForm) {
            setFormData({
                name: data.name,
                age: data.age,
                subject1: data.subject1,
                mark1: data.mark1,
                subject2: data.subject2,
                mark2: data.mark2,
            });
        }
    }, [isEditForm, data]);

    const validateField = (name, value) => {
        let fieldErrors = {};
        // Check for empty fields for name and subjects
        if (['name', 'subject1', 'subject2'].includes(name) && !value) {
            fieldErrors[name] = `${name} is required.`;
        }

        // Validate age, mark1, and mark2 to be integers not exceeding 100
        if (['age', 'mark1', 'mark2'].includes(name)) {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
                fieldErrors[name] = `${name} must be an integer between 0 and 100.`;
            }
        }

        return fieldErrors;
    };

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        Object.keys(formData).forEach(key => {
            const fieldErrors = validateField(key, formData[key]);
            if (Object.keys(fieldErrors).length > 0) {
                formIsValid = false;
                errors = { ...errors, ...fieldErrors };
            }
        });

        setErrors(errors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Validate field in real-time
        const fieldErrors = validateField(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: fieldErrors[name] ? fieldErrors[name] : "",
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveFormData(formData);
        }
    };

    return (
        <div className="form-container">
            <form>
                <label>Student Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                {errors.name && <div className='error'>{errors.name}</div>}

                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                {errors.age && <div className='error'>{errors.age}</div>}

                <label>Subject 1:</label>
                <input type="text" name="subject1" value={formData.subject1} onChange={handleInputChange} />
                {errors.subject1 && <div className='error'>{errors.subject1}</div>}

                <label>Mark 1:</label>
                <input type="number" name="mark1" value={formData.mark1} onChange={handleInputChange} />
                {errors.mark1 && <div className='error'>{errors.mark1}</div>}

                <label>Subject 2:</label>
                <input type="text" name="subject2" value={formData.subject2} onChange={handleInputChange} />
                {errors.subject2 && <div className='error'>{errors.subject2}</div>}

                <label>Mark 2:</label>
                <input type="number" name="mark2" value={formData.mark2} onChange={handleInputChange} />
                {errors.mark2 && <div style={{ color: "red" }}>{errors.mark2}</div>}

                {isEditForm ? null : (
                    <button className="button" onClick={handleSave}>
                        Save
                    </button>
                )}
                <button type="button" onClick={closeForm}>Cancel</button>
            </form>
        </div>
    );
}

export default StudentForm;
