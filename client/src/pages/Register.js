import { useState, useEffect } from "react";
import { FormRow, Logo, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState(initialState);
  const { isLoading, showAlert, displayAlert, setupUser, user } =
    useAppContext();

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, password, email, isMember } = value;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Successful! Redirecting...",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
    // console.log(value);
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  const toggleMember = () => {
    setValue({ ...value, isMember: !value.isMember });
  };
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        <div style={{ marginLeft: "70px" }}>
          <Logo />
        </div>
        <h3>{value.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!value.isMember && (
          <FormRow
            name="name"
            type="text"
            value={value.name}
            handleChange={handleChange}
            labelText="Name"
          />
        )}
        {/* email input */}
        <FormRow
          name="email"
          type="email"
          value={value.email}
          handleChange={handleChange}
          labelText="Email"
        />
        {/* password input */}
        <FormRow
          name="password"
          type="password"
          value={value.password}
          handleChange={handleChange}
          labelText="Password"
        />
        <button className="btn btn-block" type="submit" disabled={isLoading}>
          Submit
        </button>
        <p>
          {value.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {value.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
