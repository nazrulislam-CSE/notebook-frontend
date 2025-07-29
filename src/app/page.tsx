"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { apiGet, apiDelete } from "@/src/lib/api";

export default function Home() {
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [deletingNotebook, setDeletingNotebook] = useState<any | null>(null);

  const pathname = usePathname();
  const isActive = pathname === "/notebook";

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiGet("/notebooks");
        setNotebooks(response?.data || []);
      } catch (error) {
        toast.error("Failed to load notebooks.");
        console.error(error);
      }
    };
    loadData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.title.toLowerCase().includes(search.toLowerCase()) ||
    notebook.description?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedNotebooks = filteredNotebooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredNotebooks.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    if (!deletingNotebook) return;

    try {
      const response = await apiDelete(`/notebooks/${deletingNotebook.id}`);
      if (response.status === 200) {
        toast.success("Notebook deleted successfully!");
        setNotebooks(notebooks.filter((n) => n.id !== deletingNotebook.id));
        closeDeleteModal();
      } else {
        toast.error("Failed to delete notebook.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting.");
      console.error(error);
    }
  };

  const openDeleteModal = (notebook: any) => {
    setDeletingNotebook(notebook);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setDeletingNotebook(null);
  };
  
  return (
    <div className="container py-5">
      <ToastContainer />
      <main className="flex flex-col gap-32 items-center">
        <div className="card shadow-lg w-100">
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-light">
            <h5 className="card-title mb-0">Notebook List</h5>
            <Link href="/notebook" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i> Add Notebook
            </Link>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="w-30">
                <select
                  className="form-select"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
              <div className="w-40">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Notebooks"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <table className="table table-striped table-responsive table-bordered">
              <thead>
                <tr>
                  <th scope="col">Sl</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotebooks.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No notebooks found</td>
                  </tr>
                ) : (
                  paginatedNotebooks.map((notebook: any, index: number) => (
                    <tr key={notebook.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{notebook.title}</td>
                      <td>{notebook.description || "No description"}</td>
                      <td className="text-end">
                        <Link href={`/notebook/${notebook.id}`} className="btn btn-sm btn-info me-2" title="View">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link href={`/notebook/${notebook.id}/edit`} className="btn btn-sm btn-warning me-2" title="Edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          title="Delete"
                          onClick={() => openDeleteModal(notebook)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    key={index}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeDeleteModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{deletingNotebook?.title}</strong>?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
