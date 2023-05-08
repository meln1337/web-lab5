import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

const Home = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [authorization_header, setAuthorization_header] = useState(localStorage.getItem("Authorization"))

    useEffect(() => {
        fetch("http://127.0.0.1:5000/advertisement", {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": authorization_header
            }
        })
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                console.log(data)
                setAds(data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="content">
            <div className="container">
                <div className="content-head-block">
                    <h2 className="content-header">List of ads</h2>
                    <Link to="/add-ad"><button type="button" className="btn add-ad">Add ad</button></Link>
                </div>
                <div className="ads">
                        {!loading && ads.map((ad, idx) => (
                            <div className={ad.type_id == 1 ? "ad public-ad" : "ad private-ad"}>
                                <small>Author_id: {ad.author_id}</small>
                                <p>Text: {ad.text}</p>
                                <small>Type: {ad.type_id == 1 ? "Public" : "Private"}</small>
                            </div>
                        ))}
                        {loading && <h4>Loading...</h4>}
                </div>
            </div>
	    </div>
    )
}

export default Home;
