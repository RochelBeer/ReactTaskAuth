import React, { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';

const Context = createContext();

const ContextComponent = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await axios.get('/api/account/getcurrentuser');
            setUser(data);
            setIsLoading(false);
        }
        loadUser();
    }, []);

    if(isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <Context.Provider value={{user, setUser}}>
            {children}
        </Context.Provider>
    )
}

const useAuth = () => useContext(Context);

export { ContextComponent, useAuth };