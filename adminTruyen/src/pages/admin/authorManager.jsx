import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAuthors, deleteAuthor,updateAuthor  } from '../../redux/authorSlice';
import { Star, PencilLine, Trash } from 'lucide-react';

import { createAuthor } from '../../redux/authorSlice'; // Đảm bảo đã import
import Select from 'react-select';

const TopOrders = () => {
  const dispatch = useDispatch();
  const { authors, loading, error } = useSelector((state) => state.authors);
const [showForm, setShowForm] = useState(false);
const [image, setImage] = useState(null);
const [newAuthor, setNewAuthor] = useState({
  publicIDAuthor: '',
  nameAuthor: '',
  descriptionAuthor: '',
  nationalityAuthor: '',
  dobAuthor: '',
  dodAuthor: '',
  genderAuthor: 'MALE',
  novels: [],
});

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
const [isEditing, setIsEditing] = useState(false); // true nếu đang sửa
{loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Save Changes" : "Create Novel")}
const { novels } = useSelector((state) => state.novels);
const novelOptions = novels?.map((novel) => ({
  value: novel.idNovel,
  label: novel.nameNovel,
}));


  const authorsPerPage = 5; // Number of authors per page
  const totalAuthors = authors.length;

  // Calculate the indices of the authors to show for the current page
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

 const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  const jsonPayload = new Blob([JSON.stringify({
    publicIDAuthor: newAuthor.publicIDAuthor,
    nameAuthor: newAuthor.nameAuthor,
    descriptionAuthor: newAuthor.descriptionAuthor,
    nationalityAuthor: newAuthor.nationalityAuthor,
    dobAuthor: newAuthor.dobAuthor,
    dodAuthor: newAuthor.dodAuthor,
    genderAuthor: newAuthor.genderAuthor,
    novels: newAuthor.novels.map(String), // nếu có
  })], { type: 'application/json' });

  formData.append('request', jsonPayload);
  if (image) {
    formData.append("image", image);
  }

     if (isEditing) {
        dispatch(updateAuthor(formData))  }
      else {
        dispatch(createAuthor(formData))
  }
  // Reset
  setNewAuthor({
    publicIDAuthor: '',
    nameAuthor: '',
    descriptionAuthor: '',
    nationalityAuthor: '',
    dobAuthor: '',
    dodAuthor: '',
    genderAuthor: 'MALE',
    novels: [],
  });
  setImage(null);
  setIsEditing(false);

  setShowForm(false);
};

//hack handleEditClick
const handleEditClick = (author) => {
  setNewAuthor({
    publicIDAuthor: author.publicIDAuthor || '',
    nameAuthor: author.nameAuthor || '',
    descriptionAuthor: author.descriptionAuthor || '',
    nationalityAuthor: author.nationalityAuthor || '',
    dobAuthor: author.dobAuthor || '',
    dodAuthor: author.dodAuthor || '',
    genderAuthor: author.genderAuthor || 'MALE',
    novels: Array.isArray(author.novels) ? author.novels.map(n => n.idNovel) : [],
  });
  console.log(author);
  setImage(null); // không auto fill ảnh khi edit
  setIsEditing(true); // Đặt trạng thái là đang chỉnh sửa
  setShowForm(true);
  // Nếu bạn cần tracking ID để update sau này:
};

  // Handle delete author
  const handleDelete = (id) => {
    console.log('Deleting author with ID:', id);
    dispatch(deleteAuthor(id));
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div>
        {/* Button mở form */}
<button
  onClick={() => setShowForm(true)}
  className="bg-green-500 text-white px-4 py-2 rounded mb-4"
>
  Add Author
</button>

{showForm && (
  <div>
    <div className="fixed inset-0 bg-gray-700 opacity-50 z-10" onClick={() => setShowForm(false)}></div>
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
<h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Author' : 'Create New Author'}
              </h2>
        {[
          ['publicIDAuthor', 'Public ID'],
          ['nameAuthor', 'Name'],
          ['descriptionAuthor', 'Description'],
          ['nationalityAuthor', 'Nationality'],
          ['dobAuthor', 'Date of Birth', 'date'],
          ['dodAuthor', 'Date of Death', 'date']
        ].map(([key, label, type = 'text']) => (
          <div key={key} className="mb-3">
            <label className="block mb-1">{label}</label>
            <input
              type={type}
              value={newAuthor[key]}
              onChange={(e) => setNewAuthor({ ...newAuthor, [key]: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
        ))}

        {/* Gender */}
        <label className="block mb-2">Gender</label>
        <select
          value={newAuthor.genderAuthor}
          onChange={(e) => setNewAuthor({ ...newAuthor, genderAuthor: e.target.value })}
          className="border p-2 w-full mb-4"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
       <label className="block mb-2">Select Novels</label>
        <Select
          isMulti
          options={novelOptions}
          value={novelOptions.filter((opt) =>
            newAuthor.novels.includes(opt.value)
          )}
          onChange={(selectedOptions) =>
            setNewAuthor({
              ...newAuthor,
              novels: selectedOptions.map((opt) => opt.value),
            })
          }
        />


        {/* Image Upload */}
        <label className="block mb-2">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 w-full mb-4"
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
        <div className="relative h-[500px] w-full shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">Author</th>
                <th className="table-head">Biography</th>
                <th className="table-head">Author Rating</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>

            <tbody className="table-body">
              {/* Ensure authors is an array before mapping */}
              {Array.isArray(currentAuthors) && currentAuthors.length > 0 ? (
                currentAuthors.map((author, index) => (
                  <tr key={author.idAuthor} className="table-row">
                    <td className="table-cell">{index + 1}</td> {/* Use index for numbering */}
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                        <img
                          src={author.imageAuthor} // Correct image field
                          alt={author.nameAuthor}
                          className="size-14 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <p>{author.nameAuthor}</p>
                          <p className="font-normal text-slate-600 dark:text-shadow-slate-400">{author.descriptionAuthor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{author.descriptionAuthor}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star size={18} className="fill-yellow-600 stroke-yellow-600" />
                        {/* Display N/A if rating is not available */}
                        {author.rating || 'N/A'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className="text-blue-500 dark:text-blue-600"
                        onClick={() => {handleEditClick(author)} }// Open edit form
                        >
                          <PencilLine size={20} />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(author.idAuthor)}
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No authors available</td>
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
            Page {currentPage} of {Math.ceil(totalAuthors / authorsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalAuthors / authorsPerPage)}
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
