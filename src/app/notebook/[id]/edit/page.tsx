'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiGet, apiPut } from "@/src/lib/api";

export default function EditNotebook() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiGet(`/notebooks/${id}`);
        const data = response?.data;
        setTitle(data?.title || "");
        setDescription(data?.description || "");
      } catch (error) {
        toast.error("Failed to load notebook data.");
        console.error("Fetch error:", error);
      }
    };

    if (id) loadData();
  }, [id]);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiPut(`/notebooks/${id}`, {
        title: title.trim(),
        description: description.trim(),
      });

      if (response.status === 200) {
        toast.success("Notebook updated successfully!");
        router.push("/");
      } else {
        toast.error(response?.data?.message || "Update failed.");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-light d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Edit Notebook</h5>
          <Link href="/">
            <button className="btn btn-danger"><i className="fas fa-arrow-left"></i>
             Back</button>
          </Link>
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
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success" disabled={loading}>
                <i className="fas fa-sync mr-2"></i>
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
