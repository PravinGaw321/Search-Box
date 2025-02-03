import React, { useEffect, useState } from "react";
import axios from "axios";


// user interface
interface Users {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    gender: number,
    age: number,
    email: string,
    image: string,
}

const UsersList: React.FC = () => {
    // states
    const [users, setUsers] = useState<Users[]>([{
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        gender: 0,
        age: 0,
        email: '',
        image: '',
    }]);

    const [loading, setLoading] = useState<boolean>(false);
    const [filterUsers, setFilterUsers] = useState<Users[]>([]);
    const [username, setUserName] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<Users[]>([]);
    const [inputFocus, setInputFocus] = useState<boolean>(false);

    // fetch users data
    useEffect(() => {
        setLoading(true);
        try {
            axios.get('https://dummyjson.com/users')
                .then((res) => {
                    setUsers(res?.data?.users);
                    setFilterUsers(res?.data?.users);
                })
                .catch((error) => {
                    console.log('request error', error);
                });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        const findUsers = users.filter((item) => item.firstName.toLowerCase().includes(username.toLowerCase()) || item.lastName.toLowerCase().includes(username.toLowerCase()));
        setFilterUsers([...findUsers])
    }, [username])

    // search users
    const searchUsers = (e: React.FormEvent<HTMLInputElement>) => {
        setUserName(e.currentTarget.value);
    }

    // add users in list
    const handleAddUser = (item: Users) => {
        setSelectedUser([...selectedUser, item])
    }

    // delete user
    const deleteUser = (id: string) => {
        const deleteUser = selectedUser.filter((item) => item.id !== id);
        setSelectedUser(deleteUser);
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setInputFocus(false);
        }, 200);
    };

    const handleInputFocus = () => {
        setInputFocus(true);
    };

    // display selected list
    const displaySelectedList = () => {
        return (
            <ul>
                {
                    selectedUser?.map((item, index) => {
                        return (
                            <>
                                <li className="userDescription" key={item?.id}>
                                    <img src={item?.image} alt="profile-img" className="userImage" />
                                    <span className="username">{item?.firstName + item?.lastName}</span>
                                    <span className="deleteUser" onClick={() => deleteUser(item?.id)}>&#x2715;</span>
                                </li>
                            </>
                        )
                    })
                }
            </ul>
        )
    }
    return (
        <>
            <div className="container">
                <div className="searchBox">
                    <div className="selectedUser">
                        {displaySelectedList()}
                    </div>
                    <div className="searcharea">
                        <input type="text" placeholder="Search Users..." value={username} onChange={(e) => searchUsers(e)} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                    </div>


                    {
                        inputFocus ?
                            loading ? <span className="loading">Loading...</span> :
                                <div className="usersList">
                                    <ul>
                                        {
                                            filterUsers.length ?
                                                filterUsers.map((item) => {
                                                    return <>
                                                        <li className="userDescription" onClick={() => handleAddUser(item)} key={item?.id}>
                                                            <img src={item?.image} alt="profile-img" className="userImage" />
                                                            <span className="username">{item?.firstName + item?.lastName}</span>
                                                            <span className="useremail" >{item?.email}</span>
                                                        </li>
                                                    </>
                                                })
                                                : 'No Users Found'
                                        }
                                    </ul>
                                </div> : <span className="note">Focus on user input for the list.</span>
                    }

                </div>
            </div>
        </>
    )
}

export default UsersList;