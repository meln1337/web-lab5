import { useEffect, useState } from "react"

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/user")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setUsers(data)
            })
    }, [])


    return (
        <div className="container">
            <h2>Users</h2>
            {users.map((user, idx) => {
                return (
                    <div data-testid={`user-${idx}`} className="ad public-ad">
                        <p>username: {user.username}</p>
                        <p>user id: {user.id}</p>
                        <p>email: {user.email}</p>
                        <p>id: {user.id}</p>
                        <p>place_id: {user.place_id}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Users