import {AuthContext} from "@/providers/auth-provider";
import { useContext } from 'react'

export default function LogoutButton() {
    const { setAccessToken } = useContext(AuthContext);

    const logout = () => {
        setAccessToken(undefined)
        localStorage.removeItem('access_token');
    }

    return (
        <button onClick={logout}>Log Out</button>
    )
}