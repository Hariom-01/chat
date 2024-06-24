import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { storage, auth, db } from "../firebase";
import Add from "../img/addAvatar.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate,Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate=useNavigate()
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    // Log the user inputs
    console.log("User Input:");
    console.log("Display Name:", displayName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("File:", file);

    if (!displayName || !email || !password || !file) {
      setErr(true);
      setErrMsg("All fields are required");
      return;
    }

    try {
      console.log("Creating user...");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", res.user);

      const storageRef = ref(storage, `avatars/${res.user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload error:", error);
          setErr(true);
          setErrMsg("File upload failed");
        },
        async () => {
          try {
            console.log("File uploaded, getting download URL...");
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL:", downloadURL);

            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            console.log("Profile updated");

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid),{});
            navigate("/")
            console.log("User data saved to Firestore");
          } catch (err) {
            console.error("Error updating profile or saving user data:", err);
            setErr(true);
            setErrMsg("Error updating profile or saving user data");
          }
        }
      );
    } catch (err) {
      console.error("Error during user creation:", err);
      setErr(true);
      setErrMsg("Error during user creation");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>{errMsg}</span>}
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
