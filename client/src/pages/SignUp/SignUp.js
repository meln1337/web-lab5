	import { useState, useEffect } from "react"

	const SignUp = () => {
		const validateEmail = (email) => {
			return /\S+@\S+\.\S+/.test(email);
		}

		const [form, setForm] = useState({
			username: "",
			password: "",
			place_id: null,
			email: ""
		})

		const [valid, setValid] = useState({
			username: false,
			password: false,
			place_id: false,
			email: false
		})

		const [focused, setFocused] = useState({
			username: false,
			password: false,
			place_id: false,
			email: false
		})

		const sign_up = () => {
			let username = document.getElementsByClassName("sign-up-username")[0].value
			let password = document.getElementsByClassName("sign-up-password")[0].value
			let email = document.getElementsByClassName("sign-up-email")[0].value
			let place_id = document.getElementsByClassName("sign-up-place-id")[0].value
		
			fetch("http://127.0.0.1:5000/user", {
				method: "POST",
				body: JSON.stringify({
					username,
					password,
					email,
					"place_id": parseInt(place_id),
					"is_superuser": false
				}),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(res => {
					if (res.status == 201) {
						alert("New user is created")
					}
					else {
						alert("Something went wrong")
					}
					return res.json()
				})
				.then(data => console.log(data))
		}

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

			if (validateEmail(form.email)) {
				setValid({...valid, email: true})
			}
			else {
				setValid({...valid, email: false})
			}

			if (form.place_id != null) {
				setValid({...valid, place_id: true})
			}
			else {
				setValid({...valid, place_id: false})
			}

			console.log("valid", valid)
		}, [form.username, form.password, form.email, form.place_id])


		return (
			<div className="container">
			<h2>Sign up</h2>
			<form>
				<div className="form-group">
					<label>Email address</label>
					<input data-testid="signup-email" alt="email" onInput={onInput} onFocus={onFocus} type="email" className="input sign-up-email" placeholder="Enter email" />
					{/* <small id="emailHelp" className="never-share">We'll never share your email with anyone else.</small> */}
					{(focused.email && !(validateEmail(form.email))) && <small data-testid="email-error">You typed the wrong email</small>}

				</div>
				<div className="form-group">
					<label>Username</label>
					<input data-testid="signup-username" alt="username" onInput={onInput} onFocus={onFocus} type="text" className="input sign-up-username" placeholder="Enter username" />
					{(focused.username && !form.username) && <small data-testid="username-error">Username can't be empty</small>}
				</div>
				<div className="form-group">
					<label>Password</label>
					<input data-testid="signup-password" alt="password" onInput={onInput} onFocus={onFocus} type="password" className="input sign-up-password" placeholder="Password" />
					{(focused.password && !(form.password.length >= 8)) && <small data-testid="password-error">Password length must be greater than 7</small>}
				</div>
				<div className="form-group">
					<label>Place id</label>
					<input data-testid="signup-place-id" alt="place_id" onInput={onInput} onFocus={onFocus} type="number" className="input sign-up-place-id" placeholder="Place id" />
					{(focused.place_id && !(form.place_id != null)) && <small data-testid="place-id-error">Place id must be specified</small>}
				</div>
				<button disabled={(!form.username || !(form.password.length >= 8) || !(validateEmail(form.email)) || !(form.place_id != null)) ? true : false} data-testid="signup-submit" onClick={sign_up} type="reset" className={(!form.username || !(form.password.length >= 8) || !(validateEmail(form.email)) || !(form.place_id != null)) ? "btn submit sign-in-submit disabled" : "btn submit sign-in-submit"}>Submit</button>
			</form>
		</div>
		)
	}

	export default SignUp