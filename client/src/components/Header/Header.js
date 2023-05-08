import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Header = () => {
	const [loggedIn, setoggedIn] = useState(false)

	useEffect(() => {
		if (localStorage.getItem("Authorization")) {
			setoggedIn(true)
		}
	}, [])

    return (
        <nav className="navbar">
			<div className="navbar-left">
				<Link className="navbar-name" to="/">Ad service</Link>
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link data-testid="home" className="nav-link" to="/">Home</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/profile">Profile</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/places">Places</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/users">Users</Link>
					</li>
				</ul>
			</div>


			{!loggedIn && <div className="navbar-btns">
				<Link to="/sign-in"><button type="button" className="btn sign-in">Sign
						in</button></Link>

				<Link to="/sign-up"><button type="button" className="btn sign-up">Sign
						up</button></Link>
			</div>}
		</nav>
    )
}

export default Header