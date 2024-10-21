"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, createUserWithEmailAndPassword, collection, db, addDoc } from '../firebase/firebase-config'

const Page = () => {
    const route = useRouter ();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = await addDoc(collection(db, "users"), {
                name: name,
                email: email,
                userId: user.uid, 
            });

            console.log("Document written with ID: ", docRef.id);
            setName('');
            setEmail('');
            setPassword('');
            route.push('/signin')
        } catch (error) {
            console.error("Error adding document or creating user: ", error);
        }
    }

    return (
        <div className='flex h-screen justify-center items-center bg-gray-600'>
            <div className='w-[300px] bg-green-300 p-6 flex gap-4 justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <div className='flex flex-col p-2'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <button className='bg-gray-700 p-2 text-white mt-2' type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Page;
