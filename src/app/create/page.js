"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase/firebase-config';
import { useRouter } from 'next/navigation';

const CreateTeam = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        }

        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId) 
                : [...prevSelectedUsers, userId] 
        );
    };

    const handleAddUsers = () => {
        if (selectedUsers.length > 0) {
            const selectedUsersQuery = selectedUsers.join(',');

            router.push(`/assign-tasks?selected=${selectedUsersQuery}`);
        } else {
            alert('Please select at least one user');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-xl font-bold mb-4">Select Users for the Team</h1>
            <table className="table-auto bg-white text-black border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-green-600">Select</th>
                        <th className="border px-4 py-2 bg-green-600">User ID</th>
                        <th className="border px-4 py-2 bg-green-600">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user.id)} 
                                    onChange={() => handleSelectUser(user.id)} 
                                />
                            </td>
                            <td className="border px-4 py-2 bg-red-100">{user.id}</td>
                            <td className="border px-4 py-2 bg-red-100">{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                className="bg-blue-500 text-white p-2 mt-4 rounded" 
                onClick={handleAddUsers}
            >
                Add
            </button>
        </div>
    );
};

export default CreateTeam;
