"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchData } from '../fetchData';

export default function AddNotebook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetchData("notebooks/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      console.log(res)

      if (res.ok) {
        toast.success("Notebook created successfully!");
        setTimeout(() => {
          router.push("/notebooks");
        }, 1500);
      } else {
        const errorData = await res.json?.(); // Optional chaining in case your wrapper doesn't support .json()
        toast.error(errorData?.message || "Failed to create notebook.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error("Submission error:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" />
      <div className="card shadow-lg w-100">
        <div className="card-header bg-primary text-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Add New Notebook</h5>
          <button className="btn btn-danger btn-sm text-light" onClick={handleBack}>
            <i className="fas fa-arrow-left me-2"></i> Back
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
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
