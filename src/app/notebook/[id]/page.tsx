'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { apiPost, apiGet, apiPut } from "@/src/lib/api";

export default function NotebookDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; 
  const [notebook, setNotebook] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const response = await apiGet(`/notebooks/${id}`);
          setNotebook(response?.data);
        } catch (error) {
          console.error("Failed to fetch notebook:", error);
        }
      }
    };

    loadData();
  }, [id]);

  if (!notebook) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-light d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Notebook Details</h5>
          <Link href="/">
            <button className="btn btn-danger"><i className="fas fa-arrow-left"></i>
             Back</button>
          </Link>
        </div>
        <div className="card-body">
          <h5>{notebook.title}</h5>
          <p>{notebook.description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
}
