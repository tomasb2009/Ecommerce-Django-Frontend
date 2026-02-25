import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Settings() {
  const userData = UserData();
  const userId = userData?.user_id;

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [adress, setAdress] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (!userId) return;
    apiInstance
      .get(`user/profile/${userId}/`)
      .then((res) => {
        const p = res.data || {};
        setProfile(p);
        setFullName(p?.full_name || p?.user?.full_name || "");
        setAbout(p?.about || "");
        setGender(p?.gender || "");
        setCountry(p?.country || "");
        setState(p?.state || "");
        setCity(p?.city || "");
        setAdress(p?.adress || "");
        setCurrentImage(p?.image || "");
      })
      .catch((e) => {
        console.error(e);
        setProfile(null);
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({ icon: "error", text: "User ID not available" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("full_name", fullName);
      fd.append("about", about);
      fd.append("gender", gender);
      fd.append("country", country);
      fd.append("state", state);
      fd.append("city", city);
      fd.append("adress", adress);
      fd.append("user", userId);
      if (image) fd.append("image", image);

      const res = await apiInstance.patch(`user/profile/${userId}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setCurrentImage(res.data?.image || currentImage);
      Swal.fire({ icon: "success", text: "Profile updated" });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        text: e?.response?.data?.detail || "Could not update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <h3 className="mb-3">
            <i className="fas fa-cog text-primary" /> Settings
          </h3>

          <form className="row rounded shadow p-3" onSubmit={handleSubmit}>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Profile image</label>
                      {currentImage && (
                        <div className="mb-2">
                          <img
                            alt="Current"
                            src={currentImage}
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                        </div>
                      )}
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full name</label>
                      <input
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <input
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">About</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        className="form-control"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">State</label>
                      <input
                        className="form-control"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </form>

          {!userId && (
            <div className="row rounded shadow p-3 mt-3">
              <p className="mb-0">User ID not available.</p>
            </div>
          )}
          {userId && !profile && (
            <div className="row rounded shadow p-3 mt-3">
              <p className="mb-0">Loading profile…</p>
            </div>
          )}
        </div>
      </main>
    </VendorLayout>
  );
}

export default Settings;

