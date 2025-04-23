// src/pages/AddNotebook.tsx
"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddNotebook() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Example: Send notebook data to backend or local state
    console.log("New notebook:", { title, description });

    // Redirect back to home page
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg w-100">
        <div className="card-header bg-primary text-light">
          <h5 className="mb-0">Add New Notebook</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
