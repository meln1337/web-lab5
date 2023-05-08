import { useState, useEffect } from "react"

const Profile = () => {
	const [user, setUser] = useState({
		"email": "",
		"id": "",
		"is_superuser": "",
		"place_id": "",
		"username": ""
	})
	const [loading, setLoading] = useState(true)
	const [authorization_header, setAuthorization_header] = useState(localStorage.getItem("Authorization"))

	const logout = () => {
		localStorage.removeItem("Authorization")
		window.location.reload()
	}

	const deleteUser = () => {
		fetch(`http://127.0.0.1:5000/user/${user.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": authorization_header
			}
		})
			.then(res => res.json())
			.then(data => {
				console.log(data)
				alert("User has been deleted")
				localStorage.removeItem("Authorization")
				window.location.reload()
			})
	}

	useEffect(() => {
		// const authorization_header = localStorage.getItem("Authorization")
		if (authorization_header) {
			fetch("http://127.0.0.1:5000/me", {
				headers: {
					"Authorization": authorization_header
				}
			})
				.then(res => res.json())
				.then(data => {
					console.log(data)
					setLoading(false)
					setUser(data)
				})
		}
	}, [])

	const emailChange = e => {
		setUser({
			...user,
			email: e.target.value
		})
	}

	const usernameChange = e => {
		setUser({
			...user,
			username: e.target.value
		})
	}

	useEffect(() => {
		console.log(`email: ${user.email}`)
	}, [user.email])


	useEffect(() => {
		console.log(`username: ${user.username}`)
	}, [user.username])

	const update = () => {
		// const header = localStorage.getItem("Authorization")
		fetch("http://127.0.0.1:5000/user_change", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
			.then(res => res.json())
			.then(data => {
				console.log(data)
			})
	}

	

    return (
        <div className="container">
			<h2>Profile</h2>
			{!authorization_header && <p data-testid="non-auth">You are not authorized</p>}
			{!loading && authorization_header && <form>
				<div className="form-group">
					<label>Email address</label>
					<input onChange={emailChange} type="email" className="input" value={user.email} />
				</div>
				<div className="form-group">
					<label>Username</label>
					<input onChange={usernameChange} type="text" className="input" value={user.username} readOnly />
				</div>
				<div className="form-group">
					<label>Role</label>
					<input type="text" className="input" value={user.is_superuser == 1 ? "admin" : "regular user"} readOnly />
				</div>
				<p className="change-password">Change password</p>
				<div className="form-group">
					<label>Password</label>
					<input type="password" className="input" placeholder="Enter your old password" />
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password" className="input" placeholder="Enter new password" />
				</div>
				<div>
					<button data-testid="profile-submit" onClick={update} type="button" className="btn submit">Submit</button>
					<button onClick={logout} type="button" className="btn logout">Logout</button>
					<button type="button" className="btn delete" onClick={deleteUser}>Delete</button>
				</div>
			</form>}
			{loading && authorization_header && "Loding..."}
		</div>
    )
}

export default Profile