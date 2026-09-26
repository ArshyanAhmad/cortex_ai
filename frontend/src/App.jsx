import { signInWithPopup } from "firebase/auth";
import React, { useEffect } from "react";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import Home from "./pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import { ThemeProvider } from "./theme/ThemeContext";

function App() {
   const dispatch = useDispatch();
   useEffect(() => {
      const getUser = async () => {
         const data = await getCurrentUser();
         dispatch(setUserdata(data));
      };
      getUser();
   }, []);

   return (
      <ThemeProvider>
         <Home />
      </ThemeProvider>
   );
}

export default App;
