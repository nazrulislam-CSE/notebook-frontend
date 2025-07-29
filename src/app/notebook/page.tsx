"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiPost, apiGet, apiPut } from "@/src/lib/api";

export default function AddNotebook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiPost("/notebooks", {
        title: title.trim(),
        description: description.trim(),
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Notebook created successfully!");
        router.push(`/`);
      } else {
        toast.error(response.data?.message || "Failed to create notebook.");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container py-5">
      <ToastContainer />
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
                value={title}
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success" disabled={loading}>
                <i className="fas fa-plus mr-2"></i>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
