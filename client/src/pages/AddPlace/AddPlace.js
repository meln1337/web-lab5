import {useState} from 'react'

const AddPlace = () => {
    const [authorization_header, setAuthorization_header] = useState(localStorage.getItem("Authorization"))

    return (
        <div className="container">
        {authorization_header ? <><h2>Create place</h2>
        <form>
            <div className="form-group">
              <label>Name</label>
              <input data-testid="add-place" type="text" className="input add-place" placeholder="name" />
            </div>
			<button data-testid="add-place-submit" type="reset" className="btn submit add-place-submit">Submit</button>
          </form></> : <p data-testid="non-auth">You are not authorized</p>}
    </div>
    )
}

export default AddPlace