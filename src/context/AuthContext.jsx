import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("token")
      ? jwt_decode(localStorage.getItem("token"))
      : null
  );

  const [staffMembers, setStaffMembers] = useState([]);
  const [cities, setCities] = useState([]);
  const [companyPositions, setCompanyPositions] = useState([]);
  const [offices, setOffices] = useState([]);

  let [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  // -------------- AUTH LOGIC ---------------
  let loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/user/login/",
        {
          email: e.target.email.value,
          password: e.target.password.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.data.message;
      if (response.status === 200) {
        console.log(jwt_decode(data));
        localStorage.setItem("token", JSON.stringify(data));
        setUser(jwt_decode(data));
        navigate("/");
        toast.success("Has iniciado sesión");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Email o contraseña incorrectos");
    }
  };

  let logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");

    toast.warning("Se ha cerrado la sesión");
  };

  // ------------ SEND REQUEST TO CREATE INSTANCES ------------

  let createUser = async (e) => {
    e.preventDefault();
    console.log(e.target.telephone.value);
    console.log(e.target.cedula.value);
    let response = await axios.post(
      "http://localhost:8000/user/signup/",
      {
        email: e.target.email.value,
        name: e.target.name.value,
        last_name: e.target.last_name.value,
        document: e.target.cedula.value,
        phone_number: e.target.telephone.value,
        document_type_id: 1,
        password: e.target.password.value,
        user_type_id: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.data;
    console.log("data: ", data);
    if (response.status === 201) {
      let response = await fetch("http://localhost:8000/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      let data = await response.json();
      console.log("data2: ", data);
      setUser(jwt_decode(data.message));
      localStorage.setItem("token", data.message);
      navigate("/");
      toast.success("¡Bienvenido! la creación de tu usuario fue un éxito");
    } else {
      alert("Algo ha salido mal!");
    }
  };

  // let createStaffMember = async (e) => {
  //   e.preventDefault();
  //   let response = await axios.post(
  //     "http://localhost:8000/api/staff_member/create/",
  //     {
  //       email: e.target.email.value,
  //       name: e.target.name.value,
  //       last_name: e.target.last_name.value,
  //       cedula: e.target.cedula.value,
  //       telephone: e.target.telephone.value,
  //       password: e.target.password.value,
  //       company_position: e.target.company_position.value,
  //       office: e.target.office.value,
  //       city: e.target.city.value,
  //       active: e.target.active.value,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   let data = await response.data;
  //   console.log("data: ", data);
  //   if (response.status === 201) {
  //     let response = await fetch("http://localhost:8000/api/token/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: e.target.email.value,
  //         password: e.target.password.value,
  //       }),
  //     });
  //     let data = await response.json();
  //     console.log("data: ", data);
  //     setAuthTokens(data);
  //     setUser(jwt_decode(data.access));
  //     localStorage.setItem("authTokens", JSON.stringify(data));
  //     navigate("/staff_members");
  //     toast.success("¡La creación del empleado ha sido exitosa!");
  //   } else {
  //     alert("Something went wrong!");
  //   }
  // };

  // -------------- LIST MODELS -----------------
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/staff_members/"
        );
        setStaffMembers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaffMembers();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/cities/");
        setCities(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCompanyPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/company_positions/"
        );
        setCompanyPositions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyPositions();
  }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/offices/");
        setOffices(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOffices();
  }, []);

  // ---------------- TOKENS MANAGE ------------------

  let updateToken = async () => {
    let response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens.refresh,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
  };

  useEffect(() => {
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // ----------------- CONTEXT DATA ------------------

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    createUser: createUser,
    staffMembers: staffMembers,
    cities: cities,
    companyPositions: companyPositions,
    offices: offices,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const fetchStaffMember = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/staff_member/${id}/edit`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchClient = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/client/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
