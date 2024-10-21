"use client";
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../app/firebase/firebase-config'; 

const UserTasksPage = ({ currentUserId }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (!currentUserId) return; 

        const fetchUserTasks = async () => {
            try {
                const q = query(collection(db, 'tasks'), where('userId', '==', currentUserId));
                const querySnapshot = await getDocs(q);
                
                const userTasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(), 
                }));
                console.log("Fetched User Tasks:", userTasks);
                setTasks(userTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchUserTasks();
    }, [currentUserId]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Your Assigned Tasks</h2>
            {tasks.length > 0 ? (
                <ul className="list-disc pl-5">
                    {tasks.map(task => (
                        <li key={task.id} className="mb-1">
                            <strong>Task:</strong> {task.task} <br />
                            <strong>Assigned By:</strong> {task.assignedBy} <br />
                            <strong>Created At:</strong> {task.createdAt ? task.createdAt.toLocaleString() : 'N/A'} <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks assigned.</p>
            )}
        </div>
    );
};

export default UserTasksPage;
