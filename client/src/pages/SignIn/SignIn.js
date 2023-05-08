import { useState, useEffect } from "react"

const SignIn = () => {
	const [form, setForm] = useState({
		username: "",
		password: ""
	})

	const [valid, setValid] = useState({
		username: false,
		password: false
	})

	const [focused, setFocused] = useState({
		username: false,
		password: false
	})

	const onFocus = e => {
		setFocused({...focused, [e.target.alt]: true})
		console.log(e.target.alt)
		console.log("focused", focused)
	}

	const onInput = e => {
		setForm({...form, [e.target.alt]: e.target.value})
	}

	useEffect(() => {
		console.log(`length username: ${form.username.length}, length password: ${form.password.length}`)
		console.log("form", form)
		

		if (form.username.length != 0) {
			// setValid({...valid, "username": true})
			setValid({...valid, username: true,
			})
			console.log('here 1')
		}
		else {
			// setValid({...valid, "username": false})
			setValid({
				...valid, username: false
			})
			console.log('here 2')
		}

		if (form.password.length >= 8) {
			setValid({...valid, password: true})
			console.log('here 3')
		}
		else {
			setValid({...valid, password: false})
			console.log('here 4')
		}

		console.log("valid", valid)
	}, [form.username, form.password])

	const sign_in = () => {
		let sign_in = document.getElementsByClassName("sign-in-checkbox")[0].checked
		let username = document.getElementsByClassName("sign-in-username")[0].value
		let password = document.getElementsByClassName("sign-in-password")[0].value
	
		console.log(sign_in)
	
		fetch("http://127.0.0.1:5000/authentication", {
			method: "POST",
	
			body: JSON.stringify({
				username,
				password
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(res => {
				if (res.status == 200) {
					alert("You are signed in")
				}
				else {
					alert("Something went wrong")
				}
				return res.json()
			})
			.then(data => {
				console.log(data)
				if (sign_in) {
					localStorage.setItem("Authorization", data["Authorization"])  
				}
				window.location.reload()
			})
	}

    return (
        <div className="container">
		<h2>Sign in</h2>
		<form>
			<div className="form-group">
				<label>Username</label>
				<input onInput={onInput} 
						alt="username" 
						onFocus={onFocus} 
						type="text" 
						className="input sign-in-username" 
						placeholder="Enter username"
						data-testid="signin-username"
						value={form.username}
				/>
				{(focused.username && !form.username) && <small data-testid="username-error">Username can't be empty</small>}
			</div>
			<div className="form-group">
				<label>Password</label>
				<input onInput={onInput} 
						alt="password" 
						onFocus={onFocus} 
						content="password"
						type="password" 
						className="input sign-in-password" 
						placeholder="Password"
						data-testid="signin-password"
						value={form.password} 
				/>
				{(focused.password && !valid.password) && <small>Password length must be greater than 7</small>}
			</div>
			<div className="check">
				<input type="checkbox" className="form-check-input sign-in-checkbox" />
				<label>Check me out</label>
			</div>
			<button data-testid="signin-submit" disabled={(!form.username || !valid.password) ? true : false} onClick={sign_in} type="reset" className={(!form.username || !valid.password) ? "btn submit sign-in-submit disabled" : "btn submit sign-in-submit"}>Submit</button>
		</form>
	</div>
    )
}

export default SignIn