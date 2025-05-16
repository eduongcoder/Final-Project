import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllNovels, createNovel, deleteNovel,updateNovel } from '../../redux/novelSlice';
import { PencilLine, Trash ,Star,BookMarked } from 'lucide-react';
import Select from 'react-select';

const NovelManager = () => {
  const dispatch = useDispatch();
  const { novels, loading, error } = useSelector((state) => state.novels);
const { authors } = useSelector((state) => state.authors);
const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
const authorOptions = authors.map(author => ({
  value: author.idAuthor,
  label: author.nameAuthor,
}));

  // State for the form and new novel data
  const [newNovel, setNewNovel] = useState({
    nameNovel: '',
    descriptionNovel: '',
    totalChapter: 0,
    rating: 0,
    statusNovel: 'CONTINUE', // default status
    authors: selectedAuthorIds, // Chỉ mảng ID
  });

  const [image, setImage] = useState(null); // For image upload
  const [showForm, setShowForm] = useState(false); // For showing the form
const [isEditing, setIsEditing] = useState(false); // true nếu đang sửa
const [editNovelId, setEditNovelId] = useState(null); // lưu id của novel đang sửa

{loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Save Changes" : "Create Novel")}

  const [currentPage, setCurrentPage] = useState(1);
const [currentNovel, setCurrentNovel] = useState(null);

  
  const novelsPerPage = 5;
  const totalNovels = novels.length;

  // Pagination calculation
  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = novels.slice(indexOfFirstNovel, indexOfLastNovel);
useEffect(() => {
  setNewNovel(prev => ({
    ...prev,
    authors: selectedAuthorIds,
  }));
}, [selectedAuthorIds]);
  // Fetch all novels when component mounts
  // useEffect(() => {
  //   dispatch(getAllNovels());
  // }, [dispatch]);

  // Handle create novel
 const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    nameNovel: newNovel.nameNovel,
    descriptionNovel: newNovel.descriptionNovel,
    totalChapter: newNovel.totalChapter,
    rating: String(newNovel.rating),
    statusNovel: newNovel.statusNovel,
    authors: newNovel.authors.map(String),
    imageNovel: currentNovel?.imageNovel || "",
    publicIDNovel: currentNovel?.publicIDNovel || "",
    idNovel: currentNovel?.idNovel || "",
  };

  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (image) formData.append("image", image);

  if (isEditing) {
    dispatch(updateNovel(formData)); // ✅ Không cần truyền { id, formData }
  } else {
    dispatch(createNovel(formData));
    
  }

  // Reset
  setNewNovel({
    nameNovel: '',
    descriptionNovel: '',
    totalChapter: 0,
    rating: 0,
    statusNovel: 'CONTINUE',
    authors: [],
  });
  setImage(null);
  setShowForm(false);
  setIsEditing(false);
  setEditNovelId(null);
  setCurrentNovel(null);
};




  // Handle delete novel
  const handleDeleteNovel = (id) => {
    dispatch(deleteNovel(id));
  };
const handleEditClick = (novel) => {
  const authorIds = Array.isArray(novel.authors)
    ? novel.authors.map(author => author.idAuthor)
    : [];

  setNewNovel({
    nameNovel: novel.nameNovel,
    descriptionNovel: novel.descriptionNovel,
    totalChapter: novel.totalChapter,
    rating: novel.rating,
    statusNovel: novel.statusNovel,
    authors: authorIds,
  });
  setSelectedAuthorIds(authorIds); // đồng bộ hóa select
  setCurrentNovel(novel);
  setEditNovelId(novel.idNovel); // dùng idNovel chứ không phải id
  setIsEditing(true);
  setImage(null); // không auto fill ảnh
  setShowForm(true);
};


  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Novel Manager</h1>

      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Novel
      </button>

      {/* Modal form for adding new novel */}
      {showForm && (
        <div>
          <div className="fixed inset-0 bg-gray-700 opacity-50 z-10" onClick={() => setShowForm(false)}></div>
          <div className="fixed inset-0 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'Edit Novel' : 'Create New Novel'}
              </h2>

              {/* Novel Name */}
              <label htmlFor="nameNovel" className="block mb-2">Novel Name</label>
              <input
                id="nameNovel"
                type="text"
                value={newNovel.nameNovel}
                onChange={(e) => setNewNovel({ ...newNovel, nameNovel: e.target.value })}
                placeholder="Novel Name"
                className="border p-2 w-full mb-4"
              />

              {/* Description */}
              <label htmlFor="descriptionNovel" className="block mb-2">Description</label>
              <input
                id="descriptionNovel"
                type="text"
                value={newNovel.descriptionNovel}
                onChange={(e) => setNewNovel({ ...newNovel, descriptionNovel: e.target.value })}
                placeholder="Novel Description"
                className="border p-2 w-full mb-4"
              />

              {/* Total Chapters */}
              <label htmlFor="totalChapter" className="block mb-2">Total Chapters</label>
              <input
                id="totalChapter"
                type="number"
                value={newNovel.totalChapter}
                onChange={(e) => setNewNovel({ ...newNovel, totalChapter: e.target.value })}
                placeholder="Total Chapters"
                className="border p-2 w-full mb-4"
              />

              {/* Rating */}
              <label htmlFor="rating" className="block mb-2">Rating</label>
              <input
                id="rating"
                type="number"
                value={newNovel.rating}
                onChange={(e) => setNewNovel({ ...newNovel, rating: e.target.value })}
                placeholder="Rating"
                className="border p-2 w-full mb-4"
              />

              {/* Status */}
              <label htmlFor="statusNovel" className="block mb-2">Status</label>
              <select
                id="statusNovel"
                value={newNovel.statusNovel}
                onChange={(e) => setNewNovel({ ...newNovel, statusNovel: e.target.value })}
                className="border p-2 w-full mb-4"
              >
                 <option value="CONTINUE">Continue</option>
                <option value="COMPLETED">Completed</option>
                <option value="DROP">Drop</option>
              </select>

              {/* Authors */}
              <label htmlFor="authors" className="block mb-2">Authors (comma separated)</label>
              
              <Select
                isMulti
                options={authorOptions}
                value={authorOptions.filter(option => selectedAuthorIds.includes(option.value))}
                onChange={(selectedOptions) => {
                  const ids = selectedOptions.map(option => option.value);
                  setSelectedAuthorIds(ids);
                }}
                placeholder="Chọn tác giả..."
              />

              {/* Image Upload */}
              <label htmlFor="image" className="block mb-2">Upload Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border p-2 w-full mb-4"
              />

              {/* Submit Button */}
             <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded mb-2 w-full"
                disabled={loading}
              >
                {loading
                  ? isEditing ? "Updating..." : "Creating..."
                  : isEditing ? "Save Changes" : "Create Novel"}
              </button>


              {/* Cancel Button */}
              <button
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white p-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display list of novels in table format */}
      <div className="card-body p-0">
        <div className="relative overflow-x-auto rounded-lg shadow-md">
          <table className="table-auto w-full text-sm text-left ">
          <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
              <tr className='text-[16px] shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]'>
                <th className="px-6 py-3 table-head table-row"><BookMarked  className='m-[5px] text-yellow'></BookMarked ></th>
                <th className="px-6 py-3 table-head">Novel Name</th>
                <th className="px-6 py-3 table-head">Description</th>
                <th className="px-6 py-3 table-head">Status</th>
                <th className="px-6 py-3 table-head">Total Chapters</th>
                <th className="px-6 py-3 table-head">Rating</th>
                <th className="px-6 py-3 table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentNovels.map((novel, index) => (
                <tr key={novel.id} className="border-b text-[16px] font-normal	">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex w-max gap-x-4">
                      <img
                          src={novel.imageNovel} // Correct image field
                          alt={novel.nameNovel}
                          className="size-14 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <p>{novel.nameNovel}</p>
                          {/* <p className="font-normal text-slate-600 dark:text-shadow-slate-400">{author.descriptionAuthor}</p> */}
                        </div>
                    </div>
                    
                   </td>
                  <td className="px-6 py-4">{novel.descriptionNovel}</td>
                   <td className="px-6 py-4">
                    <div className="flex items-center gap-x-2">
                                            {novel.statusNovel || 'N/A'}
                                          </div>
  
                  </td>
                  <td className="px-6 py-4 text-center">{novel.totalChapter}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-x-2">
                     <Star size={18} className="fill-yellow-600 stroke-yellow-600" />
                     {/* Display N/A if rating is not available */}
                     {novel.rating || 'N/A'}
                   </div>

                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                  <div className="flex items-center gap-x-4">
                        <button className="text-blue-500 dark:text-blue-600" 
                          onClick={() => handleEditClick(novel)}>
                            <PencilLine size={20} />
                        </button>
                        <button className="text-red-500"
                         onClick={() => handleDeleteNovel(novel.id)}>
                          <Trash size={20} />
                        </button>
                    </div>                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
        >
          Previous
        </button>
        <span className="pagination-text text-lg">
          Page {currentPage} of {Math.ceil(totalNovels / novelsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalNovels / novelsPerPage)}
          className="pagination-btn px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NovelManager;
