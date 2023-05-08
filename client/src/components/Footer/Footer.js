import {Link} from 'react-router-dom'

const Footer = () => {

    return (
        <footer className="footer">
		    <div className="text-center p-3">
			© 2023 Copyright:
			<Link data-testid="footer-link" className="github" to="https://github.com/meln1337">Github</Link>
		    </div>
	    </footer>
    )
}

export default Footer