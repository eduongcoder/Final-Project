import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllChapters, createChapter, deleteChapter, updateChapter } from '../../redux/chapterSlice';
import { PencilLine, Trash } from 'lucide-react';

const ChapterManagement = ({novel}) => {
  const dispatch = useDispatch();
  const { chapters, loading, error } = useSelector((state) => state.chapters);
//   const { novels } = useSelector((state) => state.novels); // Assuming you have novels from Redux

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editChapterId, setEditChapterId] = useState(null);
  const [file, setFile] = useState(null);
  const [chapterData, setChapterData] = useState({
    titleChapter: '',
    viewChapter: 0,
    novel: '',
  });
  ;
  const [chapterId, setChapterId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 5;
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirstChapter, indexOfLastChapter);
  
  useEffect(() => {
    if(novel) {
    dispatch(getAllChapters(novel.idNovel));
    }
  }, [dispatch, novel]);

  const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    ...chapterData,
    idChapter: isEditing ? chapterId : null,
    novel: novel?.idNovel,  // 👈 Gán đúng id novel
  };

  if (isEditing) {
    console.log(payload);
  dispatch(updateChapter({ request: payload, textFile: file }));
} else {
  dispatch(createChapter({ request: payload, textFile: file }));
}

  // Reset form
  setChapterData({
    titleChapter: '',
    viewChapter: 0,
    novel: '',
  });
  // setChapterDataEdit({
  //   idChapter: null,
  //   titleChapter: '',
  //   viewChapter: 0,
  //   novel: '',
  // });
  setShowForm(false);
  setChapterId('')
  setIsEditing(false);
  setEditChapterId(null);
};


  const handleEdit = (chapter) => {
    setChapterData({
        titleChapter: chapter.titleChapter,
        viewChapter: chapter.viewChapter,
        novel: novel?.idNovel,
    });
    setChapterId(chapter.idChapter);
    setEditChapterId(chapter.idChapter);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteChapter(id));
  };

  const paginate = (page) => setCurrentPage(page);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chapter Management {novel?.nameNovel}</h1>

      <button onClick={() => setShowForm(true)} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Chapter
      </button>

      {showForm && (
  <div>
    {/* Overlay click để đóng form */}
    <div className="fixed inset-0 bg-gray-700 opacity-50 z-10" onClick={() => setShowForm(false)}></div>

    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Chapter' : 'Create New Chapter'}</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label htmlFor="titleChapter" className="block mb-2">Title</label>
          <input
            id="titleChapter"
            type="text"
            value={chapterData.titleChapter}
            onChange={(e) => setChapterData({ ...chapterData, titleChapter: e.target.value })}
            placeholder="Chapter Title"
            className="border p-2 w-full mb-4"
            required
          />

          {/* Content */}
          {/* <label htmlFor="contentChapter" className="block mb-2">Content</label>
          <textarea
            id="contentChapter"
            value={chapterData.contentChapter}
            onChange={(e) => setChapterData({ ...chapterData, contentChapter: e.target.value })}
            placeholder="Chapter Content"
            className="border p-2 w-full mb-4"
            rows={5}
            required
          /> */}

          {/* View Count */}
          <label htmlFor="viewChapter" className="block mb-2">View Count</label>
          <input
            id="viewChapter"
            type="number"
            value={chapterData.viewChapter}
            onChange={(e) => setChapterData({ ...chapterData, viewChapter: parseInt(e.target.value) || 0 })}
            placeholder="View Count"
            className="border p-2 w-full mb-4"
          />
            <label htmlFor="chapterFile" className="block mb-2">Upload File</label>
            <input
            id="chapterFile"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full mb-4"
            />
         
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full mb-2"
            disabled={loading}
          >
            {loading
              ? isEditing ? "Updating..." : "Creating..."
              : isEditing ? "Save Changes" : "Create Chapter"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-red-500 text-white p-2 rounded w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
)}


      <table className="table-auto w-full mt-4 border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Views</th>
            <th className="px-4 py-2">Novel</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentChapters.map((chapter, index) => (
            <tr key={chapter.idChapter} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{chapter.titleChapter}</td>
              <td className="px-4 py-2">{chapter.viewChapter}</td>
              <td className="px-4 py-2">{novel?.nameNovel||NaN}</td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => handleEdit(chapter)} className="text-blue-500">
                  <PencilLine size={18} />
                </button>
                <button onClick={() => handleDelete(chapter.idChapter)} className="text-red-500">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded mr-2"
        >
          Previous
        </button>
        <span className="px-2 py-2">Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastChapter >= chapters.length}
          className="px-4 py-2 bg-gray-300 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChapterManagement;
