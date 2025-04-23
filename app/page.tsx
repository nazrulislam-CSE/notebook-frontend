"use client";
import { useEffect, useState } from "react";
import { fetchData } from './fetchData';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function Home() {
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const pathname = usePathname();
  const isActive = pathname === '/notebook'

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData("notebooks");
      setNotebooks(data);
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

  return (
    <div className="container py-5">
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
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
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
                    <td colSpan={4}>No notebooks found</td>
                  </tr>
                ) : (
                  paginatedNotebooks.map((notebook: any, index: number) => (
                    <tr key={notebook.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{notebook.title}</td>
                      <td>{notebook.description || "No description"}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-info me-2" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-warning me-2" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" title="Delete">
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
    </div>
  );
}
