import './App.css';

import { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase-config';

function App() {
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const usersCollectionRef = collection(db, 'users');

  // create part of crud functionality
  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
    nameRef.current.value = '';
    ageRef.current.value = '';
  };

  // update part of crud functionality
  const updateUser = async (id, prevAge) => {
    const userDoc = doc(db, 'users', id);
    const newFields = { age: prevAge + 1 };
    await updateDoc(userDoc, newFields);
  };

  // delete part of crud functionality
  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };

  // read part of crud functionality
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
    // eslint-disable-next-line
  }, [users]);

  return (
    <div className='App'>
      <input
        type='text'
        placeholder='Name..'
        onChange={(event) => {
          setNewName(event.target.value);
        }}
        ref={nameRef}
      />
      <input
        type='number'
        placeholder='Age..'
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
        ref={ageRef}
      />
      <button onClick={createUser}>Create User</button>
      <h1>CRUD Functionality</h1>
      {users.map((user) => {
        return (
          <div>
            <h2>{user.name}</h2>
            <h2>{user.age}</h2>
            <button
              className='increase'
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
            <button className='delete' onClick={() => deleteUser(user.id)}>
              Delete User
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
