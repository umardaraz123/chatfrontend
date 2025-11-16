import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { Upload } from "lucide-react";
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",

    bio: "",
    location: "",
    interests: [],
    lookingFor: "",
    preferredAgeRange: "",
    phoneNumber: "",
    profilePic: "",
    hairs:"",
    eyes:"",
    height:"",
    weight:"",
    sociability:"",
    relationship:"",
    orientation:"",
    smoking:"",
    alcohol:"",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.firstName.trim())
      return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!formData.dateOfBirth) return toast.error("Date of birth is required");
    if (!formData.gender) return toast.error("Gender is required");

    if (!formData.bio.trim()) return toast.error("Bio is required");
    if (!formData.location.trim()) return toast.error("Location is required");
    if (formData.interests.length === 0)
      return toast.error("Select at least one interest");
    if (!formData.lookingFor.trim())
      return toast.error("Looking for is required");

    if (!formData.phoneNumber.trim())
      return toast.error("Phone number is required");

    return true;
  };
  const interestsOptions = [
    { value: "Music", label: "Music" },
    { value: "Travel", label: "Travel" },
    { value: "Sports", label: "Sports" },
    { value: "Movies", label: "Movies" },
    { value: "Art", label: "Art" },
    { value: "Reading", label: "Reading" },
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleInterestsChange = (e) => {
  //   const options = Array.from(e.target.options);
  //   const selected = options.filter(option => option.selected).map(option => option.value);
  //   setFormData({ ...formData, interests: selected });
  // };

  return (
    <div className="signup-container">
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Left Side Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="w-100">
              <h1 className="title">Sign Up and Start Your Love Story</h1>
              <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="row">
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    {/* Last Name */}
                    <div className="input-wrapper">
                      <label className="">Last Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Email</label>
                      <input
                        type="email"
                        className="input"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Password</label>
                      <div className="input-password-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="input"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className=""
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    {/* Date of Birth */}
                    <div className="input-wrapper">
                      <label className="">Date of Birth</label>
                      <input
                        type="date"
                        className="input"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    {/* Gender */}
                    <div className="input-wrapper">
                      <label className="">Gender</label>
                      <select
                        className="input"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Looking for</label>
                      <select
                        className="input"
                        value={formData.lookingFor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lookingFor: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    {/* Location */}
                    <div className="input-wrapper">
                      <label className="">Location</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    {/* Preferred Age Range */}
                    <div className="input-wrapper">
                      <label className="">Preferred Age Range</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.preferredAgeRange}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredAgeRange: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    {/* Phone Number */}
                    <div className="input-wrapper">
                      <label className="">Phone Number</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    {/* Interests (multi-select) */}
                    <div className="input-wrapper">
                      <label className="">Interests</label>
                      <CreatableSelect
                        isMulti
                        options={interestsOptions}
                        value={formData.interests.map((interest) => ({
                          value: interest,
                          label: interest,
                        }))}
                        onChange={(selected) =>
                          setFormData({
                            ...formData,
                            interests: selected.map((opt) => opt.value),
                          })
                        }
                        placeholder="Type or select interests"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    {/* Bio */}
                    <div className="input-wrapper">
                      <label className="">Bio</label>
                      <textarea
                        className="input"
                        rows="3"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <h1 className="subtitle">Lifestyle & Traits</h1>
                  </div>
                  <div className="col-12 col-md-4">
                    {/* Location */}
                    <div className="input-wrapper">
                      <label className="">Hairs color</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.hairs}
                        onChange={(e) =>
                          setFormData({ ...formData, hairs: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Eyes color</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.eyes}
                        onChange={(e) =>
                          setFormData({ ...formData, eyes: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Height(in cm)</label>
                      <input
                        type="number"
                        className="input"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({ ...formData, height: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Weight (in kgs)</label>
                      <input
                        type="number"
                        className="input"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Sociability</label>
                      <select
                        className="input"
                        value={formData.sociability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sociability: e.target.value,
                          })
                        }
                      >
                        <option value="">Select </option>
                        <option value="Very social">Very social</option>
                        <option value="Social">Social</option>
                        <option value="Selective">Selective</option>
                        <option value="Introverted">Introverted</option>
                        <option value="Shy">Shy</option>
                        <option value="Depends on mood">Depends on mood</option>
                      </select>
                    </div>
                  </div>
                    <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Relationship</label>
                      <select
                        className="input"
                        value={formData.relationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            relationship: e.target.value,
                          })
                        }
                      >
                        <option value="">Select </option>
                        <option value="Single">Single</option>
                        <option value="In a relationship">In a relationship</option>
                        <option value="Married">Married</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="It's complicated">It's complicated</option>
                        <option value="Separated">Separated</option>
                        <option value="Open relationship">Open relationship</option>
                        <option value="Free">Free</option>
                        <option value="Looking for something serious">Looking for something serious</option>
                      </select>
                    </div>
                  </div>
                    <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Orientation</label>
                      <select
                        className="input"
                        value={formData.orientation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            orientation: e.target.value,
                          })
                        }
                      >
                        <option value="">Select </option>
                        <option value="Hetero ">Hetero </option>
                        <option value="Homo">Homo</option>
                        <option value="Bi">Bi</option>
                        <option value="Pansexual">Pansexual</option>
                        <option value="Asexual">Asexual</option>
                        
                      </select>
                    </div>
                  </div>
                    <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Smoking</label>
                      <select
                        className="input"
                        value={formData.smoking}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smoking: e.target.value,
                          })
                        }
                      >
                        <option value="">Select </option>
                        <option value="No">No </option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Socially">Socially</option>
                        <option value="Regularly">Regularly</option>
                        <option value="Trying to quit">Trying to quit</option>
                         <option value="Yes">Yes</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                    <div className="col-12 col-md-4">
                    <div className="input-wrapper">
                      <label className="">Alcohol</label>
                      <select
                        className="input"
                        value={formData.alcohol}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            alcohol: e.target.value,
                          })
                        }
                      >
                        <option value="">Select </option>
                        <option value="No">No </option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Socially">Socially</option>
                        <option value="Regularly">Regularly</option>
                        <option value="Trying to quit">Trying to quit</option>
                         <option value="Yes">Yes</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    {/* Profile Picture */}
                    <div className="input-wrapper">
                      <label className="">Profile Picture</label>
                      
                     <div className="profile">
                      <Upload />
                       <input
                        type="file"
                        className="input"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                      />
                     </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="button w-100"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* Already have account */}
              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="col-lg-6  mt-4 mt-lg-0 d-lg-block">
            <AuthImagePattern
              title="Join our community"
              subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
