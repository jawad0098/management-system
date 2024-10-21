"use client"; // Ensures this component can use client-side features
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import Link from 'next/link';

const AssignTasks = () => {
    const searchParams = useSearchParams();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [tasks, setTasks] = useState('');
    const currentUserId = "currentUserId"; // Replace with the actual current user ID

    useEffect(() => {
        const selected = searchParams.get('selected');
        if (selected) {
            setSelectedUsers(selected.split(','));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchSelectedUserDetails = async () => {
            if (selectedUsers.length === 0) return;

            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const filteredUsers = usersList.filter(user => selectedUsers.includes(user.id));
            setUserDetails(filteredUsers);
        };

        fetchSelectedUserDetails();
    }, [selectedUsers]);

    const handleAssignTasks = async () => {
        try {
            for (const user of userDetails) {
                await addDoc(collection(db, 'tasks'), {
                    userId: user.id,
                    task: tasks,
                    assignedBy: currentUserId,
                    createdAt: new Date(),
                });
            }
            console.log("Tasks assigned successfully");
            setTasks(''); // Clear the textarea after assignment
        } catch (error) {
            console.error("Error assigning tasks:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen p-4">
            <h1 className="text-xl font-bold mb-4 text-center">Assign Tasks to Selected Users</h1>
            <table className="table-auto bg-white text-black border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-gray-500">User ID</th>
                        <th className="border px-4 py-2 bg-gray-500">Email</th>
                        <th className="border px-4 py-2 bg-gray-500">View Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {userDetails.map(user => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.id}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">
                                <Link href={`/user-tasks/${user.id}`}>
                                    <span className="text-blue-500 cursor-pointer">View Tasks</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <textarea
                className="border border-gray-300 p-2 mb-4"
                placeholder="Enter tasks for selected users..."
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={4}
            />

            <button
                className="bg-green-500 text-white p-2 mt-4 rounded"
                onClick={handleAssignTasks}
            >
                Assign Tasks
            </button>
        </div>
    );
};

export default AssignTasks;
