import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const registerUser = async () => {
    if (submitting) return;

    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("profileImage", image);

    setSubmitting(true);

    try{

      const res = await axios.post(
        "http://127.0.0.1:5000/register",
        data
      );

      alert(res.data.message);
      navigate("/");

    }
    catch(err){
      alert(err.response?.data?.message || "Registration failed");
    }
    finally {
      setSubmitting(false);
    }

  };

  return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">

<div className="bg-white p-10 rounded-2xl shadow-xl w-[430px]">

<h1 className="text-3xl font-bold text-center mb-6">
Create Account
</h1>

<input
type="text"
placeholder="Full Name"
className="w-full border rounded-lg p-3 mb-4"
onChange={(e)=>
setFormData({...formData,name:e.target.value})
}
/>

<input
type="email"
placeholder="Email"
className="w-full border rounded-lg p-3 mb-4"
onChange={(e)=>
setFormData({...formData,email:e.target.value})
}
/>

<input
type="password"
placeholder="Password"
className="w-full border rounded-lg p-3 mb-4"
onChange={(e)=>
setFormData({...formData,password:e.target.value})
}
/>

<label className="font-semibold">
Profile Photo
</label>

<input
type="file"
accept="image/*"
className="w-full mt-2 mb-6"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button
onClick={registerUser}
disabled={submitting}
className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
>
{submitting ? "Creating Account..." : "Register"}
</button>

<p className="text-center mt-5">

Already have an account?

<Link
to="/"
className="text-blue-600 ml-2 font-semibold"
>

Login

</Link>

</p>

</div>

</div>

  );
}

export default Register;