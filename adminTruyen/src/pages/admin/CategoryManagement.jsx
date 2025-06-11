import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createCategory, updateCategory, deleteCategory } from '../../redux/categorySlice';
import { Star, PencilLine, Trash } from 'lucide-react';
import Select from 'react-select';

const TopOrders = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const { novels } = useSelector((state) => state.novels);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    nameCategory: '',
    novels: [], // Sẽ lưu một mảng các ID của novel
  });

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  // Tạo options cho react-select
  const novelOptions = novels?.map((novel) => ({
    value: novel.idNovel,
    label: novel.nameNovel,
  }));

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentCategoryId(null);
    setNewCategory({ nameCategory: '', novels: [] });
  };

  const handleAddNewClick = () => {
    resetForm(); // Đảm bảo form sạch sẽ
    setShowForm(true);
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setCurrentCategoryId(category.idCategory);
    setNewCategory({
      nameCategory: category.nameCategory || '',
      // Đảm bảo novels là một mảng ID, kể cả khi category.novels là null/undefined
      novels: Array.isArray(category.novels) ? category.novels.map(n => n.idNovel) : [],
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Payload cần được định dạng theo yêu cầu của backend
    // Giả sử backend cần key là `idNovels` cho mảng ID
    const payload = {
      nameCategory: newCategory.nameCategory,
      novels: newCategory.novels,
    };

    if (isEditing) {
      // Khi update, ta cần gửi cả id của category
      const updatePayload = { ...payload, idCategory: currentCategoryId };
      dispatch(updateCategory(updatePayload));
    } else {
      dispatch(createCategory(payload));
    }
    
    resetForm();
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button
        onClick={handleAddNewClick}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition-colors"
      >
        Add Category
      </button>

      {showForm && (
        <div>
          <div className="fixed inset-0 bg-gray-700 opacity-50 z-10" onClick={resetForm}></div>
          <div className="fixed inset-0 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nameCategory" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    id="nameCategory"
                    type="text"
                    value={newCategory.nameCategory}
                    onChange={(e) => setNewCategory({ ...newCategory, nameCategory: e.target.value })}
                    className="border p-2 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Novels</label>
                  <Select
                    isMulti
                    options={novelOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={novelOptions.filter(opt => newCategory.novels.includes(opt.value))}
                    onChange={(selectedOptions) =>
                      setNewCategory({ // SỬA Ở ĐÂY
                        ...newCategory,
                        novels: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
                      })
                    }
                    isLoading={!novels}
                    placeholder="Search and select novels..."
                  />
                </div>
                
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    disabled={loading}
                  >
                    {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Save Changes" : "Create Category")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">Categories</div></div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="table-row bg-gray-100">
                  <th className="table-head px-4 py-3 text-left">#</th>
                  <th className="table-head px-4 py-3 text-left">Name</th>
                  <th className="table-head px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {loading && <tr><td colSpan="3" className="text-center p-4">Loading...</td></tr>}
                {!loading && currentCategories.length > 0 ? (
                  currentCategories.map((category, index) => (
                    <tr key={category.idCategory} className="table-row border-b hover:bg-gray-50">
                      <td className="table-cell px-4 py-3">{indexOfFirstCategory + index + 1}</td>
                      <td className="table-cell px-4 py-3 font-medium">{category.nameCategory}</td>
                      <td className="table-cell px-4 py-3">
                        <div className="flex items-center gap-x-4">
                          <button onClick={() => handleEditClick(category)} className="text-blue-600 hover:text-blue-800">
                            <PencilLine size={18} />
                          </button>
                          <button onClick={() => handleDelete(category.idCategory)} className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  !loading && <tr><td colSpan="3" className="text-center p-4">No categories available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">Previous</button>
              <span className="pagination-text mx-4">Page {currentPage} of {totalPages}</span>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopOrders;