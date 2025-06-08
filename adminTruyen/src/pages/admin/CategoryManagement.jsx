import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  createCategory,updateCategory,deleteCategory  } from '../../redux/categorySlice';
import { Star, PencilLine, Trash } from 'lucide-react';

import Select from 'react-select';

const TopOrders = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
const [showForm, setShowForm] = useState(false);
const [newCategory, setNewCategory] = useState({
  nameCategory: '',
  
  novels: [],
});

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
const [isEditing, setIsEditing] = useState(false); // true nếu đang sửa
const { novels } = useSelector((state) => state.novels);
const novelOptions = novels?.map((novel) => ({
  value: novel.idNovel,
  label: novel.nameNovel,
}));

const [idCategory,setIdcategory]=useState(null);
  const CategorisPerPage = 5; // Number of authors per page
  const totalCategoris = categories.length;

  // Calculate the indices of the authors to show for the current page
  const indexOfLastCategory = currentPage * CategorisPerPage;
  const indexOfFirstCategory = indexOfLastCategory - CategorisPerPage;
  const currentCategory = categories.slice(indexOfFirstCategory, indexOfLastCategory);

 const handleSubmit = (e) => {
  e.preventDefault();


    const payload = {
      idCategory: isEditing ? idCategory : null,
    nameCategory: newCategory.nameCategory,
    novels: newCategory.novels.map(id => ({ idNovel: id })) // nếu backend cần dạng object
    // Nếu chỉ cần danh sách ID: novels: newCategory.novels
  };

  if (isEditing) {
    dispatch(updateCategory(payload));
  } else {
    dispatch(createCategory(payload));
  }
  // Reset
  setNewCategory({
    nameCategory: '',
    novels: [],
  });
  setIsEditing(false);
  setIdcategory(null)
  setShowForm(false);
};

//hack handleEditClick
const handleEditClick = (category) => {
  setNewCategory({
     nameCategory: category.nameCategory || '',
    novels: Array.isArray(category.novels) ? category.novels.map(n => n.idNovel) : [],
  });
  console.log(category);
  setIdcategory(category.idCategory)
  setIsEditing(true); // Đặt trạng thái là đang chỉnh sửa
  setShowForm(true);
  // Nếu bạn cần tracking ID để update sau này:
};

  // Handle delete author
  const handleDelete = (id) => {
    console.log('Deleting author with ID:', id);
    dispatch(deleteCategory(id));
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
{loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Save Changes" : "Create Novel")}

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div>
        {/* Button mở form */}
<button
  onClick={() => setShowForm(true)}
  className="bg-green-500 text-white px-4 py-2 rounded mb-4"
>
Add Category  </button>

{showForm && (
  <div>
    <div className="fixed inset-0 bg-gray-700 opacity-50 z-10" onClick={() => setShowForm(false)}></div>
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
<h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Category ' : 'Create New Category '}
              </h2>
        {[
          ['nameCategory', 'CategoryName'],
         
        ].map(([key, label, type = 'text']) => (
          <div key={key} className="mb-3">
            <label className="block mb-1">{label}</label>
            <input
              type={type}
              value={newCategory[key]}
              onChange={(e) => setNewCategory({ ...newCategory, [key]: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
        ))}

       <label className="block mb-2">Select Novels</label>
        <Select
          isMulti
          options={novelOptions}
          value={novelOptions.filter((opt) =>
            newCategory.novels.includes(opt.value)
          )}
          onChange={(selectedOptions) =>
            setnewCategory({
              ...newCategoris,
              novels: selectedOptions.map((opt) => opt.value),
            })
          }
        />



        {/* Submit */}
        <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded mb-2 w-full"
                disabled={loading}
              >
                {loading
                  ? isEditing ? "Updating..." : "Creating..."
                  : isEditing ? "Save Changes" : "Create Novel"}
              </button>

        <button
          onClick={() => setShowForm(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    <div className="card">
      
      <div className="card-header">
        <div className="card-title">Top Orders</div>
      </div>
    

      {/* Product Table */}
      <div className="card-body p-0">
        <div className="relative  w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">NameCategory</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>

            <tbody className="table-body">
              {/* Ensure authors is an array before mapping */}
              {Array.isArray(currentCategory) && currentCategory.length > 0 ? (
                currentCategory.map((category, index) => (
                  <tr key={category.idCategory} className="table-row">
                    <td className="table-cell">{index + 1}</td> {/* Use index for numbering */}
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                       
                          <p>{category.nameCategory}</p>
                      </div>
                    </td>
                   
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className="text-blue-500 dark:text-blue-600"
                        onClick={() => {handleEditClick(category)} }// Open edit form
                        >
                          <PencilLine size={20} />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(category.idCategory)}
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No Category available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-text">
            Page {currentPage} of {Math.ceil(totalCategoris / CategorisPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalCategoris / CategorisPerPage)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div></div>
  );
};

export default TopOrders;
