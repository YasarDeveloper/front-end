import React, { useState, useEffect } from 'react';
import "../styles/StudentStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faPencilAlt, faTrash, faUser, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import StudentForm from './StudentForm';
import { getStudentData, deleteData, updateData } from '../services/StudentService.js';
import AuthForm from './AuthForm';
import "../styles/StudentGrid.css";

Modal.setAppElement("#root");


const StudentList = () => {
    const [initialData, setInitialData] = useState([]);
    const [data, setData] = useState(initialData);
    const [editableRow, setEditableRow] = useState(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const [isEditForm, setIsEditForm] = useState(true);
    const [selectdIndex, setselectdIndex] = useState(-1);
    const [isAuthFormVisible, setAuthFormVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        getStudentData()
            .then(data => {
                console.log(data)
                setInitialData(data);
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleEdit = (index) => {
        setEditableRow(index);
    };

    const handleAuthSuccess = (userData) => {
        setAuthFormVisible(false);
        setUserId(userData.userId || null)
        setUserName(userData.userName || null)
        getStudentData()
            .then(data => {
                setInitialData(data);
                setData(data);
            })
        setMessageText(` ${ userId == null ? 'Login' : 'Register' } successfully!`);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 2000);
    };

    const handleDelete = async (index, recordId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this record?");

        if (isConfirmed) {
            try {
                await deleteData(recordId);
                const updatedData = [...data];
                updatedData.splice(index, 1);
                setData(updatedData);
                setMessageText('Deleted successfully!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };


    const handleSave = async (index) => {
        try {
            const updatedData = data[index];
            const id = updatedData.id;
            delete updatedData.id;
            updatedData.updateduser = userId;
            console.log(updatedData);
            await updateData(updatedData, id)
            setEditableRow(null);
            setMessageText('Updated successfully!');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
            getStudentData()
                .then(data => {
                    setInitialData(data);
                    setData(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };



    const handleAdd = (index, id) => {
        if (id != null) {
            setIsEditForm(true)
            setselectdIndex(index)
        }
        else { setIsEditForm(false) };
        setFormVisible(true);
    };

    const closeForm = () => {
        setFormVisible(false);
    };

    const saveFormData = async (formData) => {
        const dataToSend = { ...formData, "createduser": userId }
        try {
            const response = await fetch('http://localhost:3001/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                getStudentData()
                    .then(data => {
                        console.log(data)
                        setInitialData(data);
                        setData(data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
                closeForm()
                setMessageText('Student Added successfully!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            } else {
                console.error('Failed to submit student data');
            }
        } catch (error) {
            console.error('Error submitting student data:', error);
        }
    };

    return (
        <div className='student-grid'>
            <div className='profile'>
                {userId === null && <p className='click' onClick={() => setAuthFormVisible(true)}>Login/Register</p>}
                <p className='profile-name' ><FontAwesomeIcon icon={faUser} /> {userName || 'Guest'} </p>
            </div>
            <Modal
                isOpen={isAuthFormVisible}
                onRequestClose={() => setAuthFormVisible(false)}
                contentLabel="Auth Form"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    content: {
                        position: 'relative',
                        margin: 'auto',
                        width: '30%',
                        maxHeight: '80%', // You can adjust the maximum height as needed
                        overflow: 'auto',
                    },
                }}
            >
                <AuthForm onClose={() => setAuthFormVisible(false)} onAuthSuccess={(userData) => handleAuthSuccess(userData)} />

            </Modal>
            <h1>Student List</h1>
            <p className="add click" onClick={() => handleAdd()}>
                <FontAwesomeIcon icon={faPlusCircle} /> Add
            </p>
            <Modal
                isOpen={isFormVisible}
                onRequestClose={closeForm}
                contentLabel="Add Form"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    content: {
                        position: 'relative',
                        margin: 'auto',
                        width: 'fit-content',
                        maxHeight: '80%',
                        overflow: 'auto',
                    },
                }}
            >
                <StudentForm closeForm={closeForm} saveFormData={saveFormData} isEditForm={isEditForm} data={data[selectdIndex]} />
            </Modal>

            <table>
                <thead>
                    <tr>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Student Name</th>
                        <th>Age</th>
                        <th>Created Use</th>
                        <th>Updated User</th>
                        <th>Subject 1</th>
                        <th>Mark 1</th>
                        <th>Subject 2</th>
                        <th>Mark 2</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className='FontAwesomeIcon'>
                                <FontAwesomeIcon icon={faTable} onClick={() => handleAdd(index, item.id)} />
                            </td >
                            <td className='FontAwesomeIcon'>
                                <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(index)} />
                            </td>
                            <td className='FontAwesomeIcon'>
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index, item.id)} />
                            </td>
                            {editableRow === index ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="StudentName"
                                            value={data[index].name}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].name = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="age"
                                            value={data[index].age}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].age = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>{item.createdUsername}</td>
                                    <td>{item.updatedUsername}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Subject1"
                                            value={data[index].subject1}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].subject1 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Mark1"
                                            value={data[index].mark1}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].mark1 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Subject2"
                                            value={data[index].subject2}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].subject2 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="Mark2"
                                            value={data[index].mark2}
                                            onChange={(e) => {
                                                const updatedData = [...data];
                                                updatedData[index].mark2 = e.target.value;
                                                setData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td className='save-row'>
                                        <button className='save-button' onClick={() => handleSave(index)}>Save</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.createdUsername}</td>
                                    <td>{item.updatedUsername}</td>
                                    <td>{item.subject1}</td>
                                    <td>{item.mark1}</td>
                                    <td>{item.subject2}</td>
                                    <td>{item.mark2}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showMessage && (
                <div className={`message-box ${!showMessage ? 'hidden' : ''}`}>
                    {messageText}
                </div>
            )}
        </div>
    );
}



export default StudentList;