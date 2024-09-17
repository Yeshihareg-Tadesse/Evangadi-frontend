//import Route for defining paths and components,Routes for grouping routes, and useNavigate for programmatically navigate to different .routes.
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Home/Login/Login.jsx";
import Register from "./pages/Home/SignIn&SIgnUp/Register.jsx";
// Imports an instance of axios (a library for making HTTP requests) configured with your settings.
import axios from "./axiosConfig.jsx";
// Imports React hooks. useState is used to manage state, and useEffect is used to perform side effects (e.g., data fetching).
import { useEffect, useState } from "react";
//Imports createContext to create a context for for sharing state across the components.
import { createContext } from "react";
// import QuestionAndAnswer from "./pages/QuestionAndAnswer.jsx";
import AskQuestionPage from "./pages/Home/AskQuestion/AskQuestionPage.jsx";
import QuestionAndAnswer from "./pages/Home/Question&Answer/QuestionAndAnswer.jsx";
// import SignUpSignInPage from "./pages/SignUpSignInPage.jsx";
import AboutPage from "./pages/About/AboutPage.jsx";
import Header from "./pages/Header/Header.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

//provide and consume state throughout the application.
export const AppState = createContext();

function App() {
  const [appErrors, setAppErrors] = useState({});
  //State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Initializes state to store user information.
  const [user, setUser] = useState({});
  //Initializes the navigate to navigate to different routes.
  const navigate = useNavigate();
  //Retrieves the token from local storage, which used for authenticated requests.
  const token = localStorage.getItem("token");

  //check if the user is authenticated.
  async function checkUser() {
    try {
      //Sends a GET request to check user authentication using the token.
      const { data } = await axios.get("/user/checkUser", {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      //Updates the user & isLoggedIn state with the received data.
      setUser(data);
      setIsLoggedIn(true);
      //Displays an alert indicating a successful login.
      navigate("/home");
      //Catches errors if the request fails. Logs the error response and redirects the user to the login page.
    } catch (error) {
      console.log(error.response.data);
      navigate("/login");
    }
  }

  const login = async (credentials) => {
    try {
      //Sends a POST request with the login credentials.
      const { data } = await axios.post("/user/login", credentials);
      // Check if the token is present in the response
      if (data.token) {
        // Save the token in local storage
        localStorage.setItem("token", data.token);
        // Update user state, isLoggedIn state, and verify login
        await checkUser();
      } else {
        // Redirect to login page if no token is present
        navigate("/login");
      }
    } catch (error) {
      console.log("Login error:", error.response);
      setAppErrors(error.response.data.msg);
       console.log(appErrors);
      navigate("/login"); //Redirects the user to the login page if there's an error.
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({});
    localStorage.removeItem("token");
    navigate("/login");
  };
  //Calls the checkUser function when the component mounts or when token changes.
  useEffect(() => {
    if (token) {
      checkUser();
    }
  }, [token]);

  return (
    //Makes the context available to all child components.
    <AppState.Provider
      value={{ user, appErrors, setUser, isLoggedIn, login, logout }}
    >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question" element={<AskQuestionPage />} />
        <Route path="/question/:id" element={<QuestionAndAnswer />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </AppState.Provider>
  );
}
export default App;
