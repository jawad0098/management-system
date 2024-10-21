"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTasks from '../../components/UserTasks';
import { auth } from '../firebase/firebase-config'; 
import { onAuthStateChanged } from 'firebase/auth';

const Page = () => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userTasks, setUserTasks] = useState([]); 
    const [hasJoinedTeam, setHasJoinedTeam] = useState(false); 
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid); 
            } else {
                setCurrentUserId(null); 
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCreateTeam = () => {
        router.push('/create');
    };

    const handleJoinTeam = () => {
        const tasks = [
            { id: 1, title: "Task 1", description: "This is task 1" },
            { id: 2, title: "Task 2", description: "This is task 2" },
        ];
        setUserTasks(tasks);
        setHasJoinedTeam(true); 
    };

    if (!currentUserId) {
        return <div className="text-white">Loading...</div>; 
    }

    return (
        <div className='flex h-screen items-center justify-center gap-3 bg-gray-800'>
            {hasJoinedTeam ? (
                <div className="bg-gray-700 p-4 rounded-2xl text-white">
                    <h2 className="text-xl mb-4">Assigned Tasks</h2>
                    {userTasks.map(task => (
                        <div key={task.id} className="mb-2">
                            <h3 className="text-lg font-bold">{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <UserTasks currentUserId={currentUserId} />
                    <div className='bg-green-400 p-4 rounded-2xl text-white'>
                        <button onClick={handleCreateTeam}>Create Team</button>
                    </div>
                    <div className='bg-green-400 p-4 rounded-2xl text-white'>
                        <button onClick={handleJoinTeam}>Join Team</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Page;
