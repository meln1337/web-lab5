import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile';
import AddPlace from './pages/AddPlace/AddPlace';
import AddAd from './pages/AddAd/AddAd'
import Places from './pages/Places/Places'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Users from './pages/Users/Users';
import './App.css'

const App = () => {
    return (
        <>
            <Router>
                <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/add-place" element={<AddPlace />} />
                        <Route path="/add-ad" element={<AddAd />} />
                        <Route path="/places" element={<Places />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/users" element={<Users />} />
                    </Routes>
                <Footer />
            </Router>
        </>
    )
}

export default App
