import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const Places = () => {
    const [places, setPlaces] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch("http://127.0.0.1:5000/place")
			.then(response => {
				console.log(response)
				return response.json()
			})
			.then(data => {
				console.log(data)
				setPlaces(data)
				setLoading(false)
			})
	}, [])

    return (
        <div className="content">
			<div className="container">
				<div className="content-head-block">
					<h2 className="content-header">List of places</h2>
					<Link to="/add-place"><button type="button" className="btn add-ad">Add place</button></Link>
				</div>
				<div className="places">
					{!loading && places.map((place, idx) => (
						<div className="ad public-ad" key={idx}>
							<p>Name: {place.name}</p>
							<p>Id: {place.id}</p>
						</div>
					))}
					{loading && <h4>Loading...</h4>}
				</div>
			</div>
		</div>
    )
}
export default Places