"use client"; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const UserTasks = () => {
    const router = useRouter();
    const { userId } = router.query; 
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchUserTasks = async () => {
            if (!userId) return; 

            const q = query(collection(db, 'tasks'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksList);
        };

        fetchUserTasks();
    }, [userId]);

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl font-bold mb-4 text-center">Tasks for User ID: {userId}</h1>
            <table className="table-auto bg-white text-black border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 bg-gray-500">Task</th>
                        <th className="border px-4 py-2 bg-gray-500">Assigned By</th>
                        <th className="border px-4 py-2 bg-gray-500">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <tr key={task.id}>
                                <td className="border px-4 py-2">{task.task}</td>
                                <td className="border px-4 py-2">{task.assignedBy}</td>
                                <td className="border px-4 py-2">{task.createdAt.toDate().toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border px-4 py-2" colSpan="3">No tasks assigned.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTasks;
