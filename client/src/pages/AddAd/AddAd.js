import { useEffect, useState } from "react"

const AddAd = () => {
    const [form, setForm] = useState({
        place_id: 0,
        text: "",
        type: "public"
    })
    const [authorization_header, setAuthorization_header] = useState(localStorage.getItem("Authorization"))

    const onInput = e => {
        console.log(e.target.value)
		setForm({...form, [e.target.alt]: e.target.value})
	}

    const add_ad = () => {
        let textarea = document.getElementsByClassName("textarea")[0].value
        let type = document.getElementsByClassName("select")[0].value
        fetch("http://127.0.0.1:5000/advertisement", {
			method: "POST",
			body: JSON.stringify({
                place_id: parseInt(form.place_id),
                text: textarea,
                type_id: type == "public" ? 1 : 2
            }),
			headers: {
				"Content-Type": "application/json",
                "Authorization": authorization_header
			}
		})
			.then(res => {
				if (res.status == 201) {
					alert("Ad has been created")
				}
				else {
					alert("Something went wrong")
				}
				return res.json()
			})
			.then(data => console.log(data))
    }

    useEffect(() => {
        console.log(form.type)
    }, [form.type])

    return (
        <div className="container">
            {authorization_header ? <><h2>Create ad</h2>
            <form>
                <div className="form-group">
                    <label>Example select</label>
                    <select onChange={onInput} alt="type" className="select">
                        <option value="public">Public</option>
                        <option value="local">Local</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Text</label>
                    <textarea data-testid="textarea" alt="text" onChange={onInput} className="textarea" rows="9" />
                </div>
                <div className="form-group">
                    <label>Place id</label>
                    <input data-testid="place_id" value={form.place_id} alt="place_id" onInput={onInput} type="number" className="input sign-up-place-id" placeholder="Place id" />
                </div>
                <button data-testid="add-ad-submit" onClick={add_ad} type="reset" className="btn submit">Submit</button>
            </form></> : <p data-testid="not-auth">You are not authorized"</p>}
        </div>
    )
}

export default AddAd