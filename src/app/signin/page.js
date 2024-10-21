"use client"
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from '../firebase/firebase-config';
import { useRouter } from 'next/navigation';

function Page() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();

        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Signed in user:", user);

            router.push('/managment');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);
        }

        setEmail('');
        setPassword('');
    }

    return (
        <div className='flex h-screen justify-center items-center bg-gray-600'>
            <div className='w-[300px] bg-green-300 p-6 flex gap-4 justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <div className='flex flex-col p-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col p-2'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className='bg-gray-700 p-3 text-white mt-2' type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Page;
