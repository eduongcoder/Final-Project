// src/components/ChapterComments.jsx
import React, { useEffect, useState, useRef } from 'react'; // Thêm useRef
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommentsByChapter,
  createComment,
  deleteComment,
  likeComment,
  dislikeComment,
  clearComments,
  clearCommentError,
  updateCommentContent // Sẽ dùng cho chức năng sửa
} from '../redux/commentSlice';
import {
    Send as LucideSend,
    ThumbsUp as LucideThumbsUp,
    ThumbsDown as LucideThumbsDown,
    Trash2 as LucideTrash,
    Edit3 as LucideEdit,
    Loader2 as LucideSpinner,
    MoreVertical as LucideMoreVertical // Icon ba chấm
} from 'lucide-react';

const ChapterComments = ({ chapterId, novelId }) => { // Bỏ currentUserId vì có thể lấy từ currentUser
  const dispatch = useDispatch();
  const { commentsByChapter, loading, error } = useSelector((state) => state.comments);
  const currentUser = useSelector((state) => state.user.currentUser); // Lấy thông tin người dùng hiện tại

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State để quản lý dropdown menu của từng comment
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // State để quản lý việc sửa comment
  const [editingComment, setEditingComment] = useState(null); // { idComment: string, contentComment: string }
  const [editedContent, setEditedContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const dropdownRef = useRef(null); // Ref cho dropdown để xử lý click outside

  useEffect(() => {
    if (chapterId) {
      dispatch(getCommentsByChapter(chapterId));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, chapterId]);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser?.idUser || !chapterId) return;
    setIsSubmitting(true);
    dispatch(clearCommentError());
    try {
      await dispatch(createComment({
        contentComment: newComment,
        idUser: currentUser.idUser,
        idChapter: chapterId
      })).unwrap();
      setNewComment('');
    } catch (err) { console.error("Failed to submit comment:", err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
        setOpenDropdownId(null); // Đóng dropdown sau khi xóa
      } catch (err) { console.error("Failed to delete comment", err); }
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser?.idUser || !chapterId) return;
    try {
      await dispatch(likeComment({ idComment, idChapter, idUser: currentUser.idUser })).unwrap();
    } catch (err) { console.error("Failed to like comment", err); }
  };

  const handleDislike = async (commentId) => {
    if (!currentUser?.idUser || !chapterId) return;
    try {
      await dispatch(dislikeComment({ idComment, idChapter, idUser: currentUser.idUser })).unwrap();
    } catch (err) { console.error("Failed to dislike comment", err); }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.contentComment);
    setOpenDropdownId(null); // Đóng dropdown
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedContent('');
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editedContent.trim() || !editingComment) return;
    setIsUpdating(true);
    try {
      await dispatch(updateCommentContent({
        idComment: editingComment.idComment,
        contentComment: editedContent,
        idChapter: chapterId, // API của bạn yêu cầu idChapter và user
        idUser: currentUser.idUser
      })).unwrap();
      handleCancelEdit(); // Đóng form sửa
    } catch (err) {
      console.error("Failed to update comment", err);
      // Hiển thị lỗi cho người dùng nếu cần
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-sky-400 mb-4 border-b border-gray-700 pb-2">
        Bình luận ({commentsByChapter?.length || 0})
      </h3>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          {/* ... Form tạo comment ... */}
          <textarea
            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 resize-none"
            rows="3"
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            disabled={isSubmitting}
          />
          {error && typeof error === 'object' && error.from === 'create' && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? <LucideSpinner size={18} className="animate-spin mr-2" /> : <LucideSend size={16} className="mr-2" />}
            Gửi bình luận
          </button>
        </form>
      ) : (
         <p className="mb-6 text-gray-400 text-sm">Vui lòng <Link to="/login" className="text-sky-400 hover:underline">đăng nhập</Link> để bình luận.</p>
      )}

      {loading && (!commentsByChapter || commentsByChapter.length === 0) && (
        <div className="text-center text-gray-400 py-4">
          <LucideSpinner size={24} className="animate-spin inline mr-2" /> Đang tải bình luận...
        </div>
      )}
      {!loading && (!commentsByChapter || commentsByChapter.length === 0) && !error && (
        <p className="text-gray-500 text-center py-4">Chưa có bình luận nào cho chương này.</p>
      )}
      {error && (!commentsByChapter || commentsByChapter.length === 0) && typeof error === 'object' && error.from === 'fetch' && (
         <p className="text-red-500 text-center py-4">{error.message}</p>
      )}


      <div className="space-y-4">
        {commentsByChapter && commentsByChapter.map((comment) => (
          editingComment && editingComment.idComment === comment.idComment ? (
            // Form sửa comment
            <form key={`edit-${comment.idComment}`} onSubmit={handleUpdateComment} className="bg-gray-700 p-3 rounded-md shadow">
                <textarea
                    className="w-full p-3 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400 resize-none"
                    rows="3"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    required
                    disabled={isUpdating}
                />
                {/* Hiển thị lỗi update nếu có */}
                <div className="mt-2 flex items-center space-x-2">
                    <button
                        type="submit"
                        disabled={isUpdating || !editedContent.trim()}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-60"
                    >
                        {isUpdating ? <LucideSpinner size={16} className="animate-spin mr-1.5" /> : null}
                        Lưu
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded-md transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </form>
          ) : (
            // Hiển thị comment bình thường
            <div key={comment.idComment} className="bg-gray-700 p-3 rounded-md shadow">
              <div className="flex items-start space-x-3">
                {/* Avatar (tùy chọn) */}
                {/* <img src={comment.userAvatar || 'default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" /> */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sky-300 text-sm">{comment.userName || "Người dùng ẩn danh"}</p>
                    {/* Nút ba chấm và Dropdown */}
                    {currentUser && currentUser.idUser === comment.idUser && ( // API của bạn trả về idUser trong mỗi comment
                      <div className="relative" ref={openDropdownId === comment.idComment ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === comment.idComment ? null : comment.idComment)}
                          className="p-1 text-gray-400 hover:text-gray-200 rounded-full"
                        >
                          <LucideMoreVertical size={16} />
                        </button>
                        {openDropdownId === comment.idComment && (
                          <div className="absolute right-0 mt-1 w-32 bg-gray-600 border border-gray-500 rounded-md shadow-lg z-10 py-1">
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-500 flex items-center"
                            >
                              <LucideEdit size={14} className="mr-2" /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.idComment)}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-700 hover:text-white flex items-center"
                            >
                              <LucideTrash size={14} className="mr-2" /> Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-200 text-sm whitespace-pre-wrap mt-0.5">{comment.contentComment}</p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                    <button onClick={() => handleLike(comment.idComment)} className="hover:text-sky-400 flex items-center disabled:opacity-50" disabled={!currentUser}>
                      <LucideThumbsUp size={14} className="mr-1" /> {comment.likeComment || 0}
                    </button>
                    <button onClick={() => handleDislike(comment.idComment)} className="hover:text-red-400 flex items-center disabled:opacity-50" disabled={!currentUser}>
                      <LucideThumbsDown size={14} className="mr-1" /> {comment.dislikeComment || 0}
                    </button>
                    {/* Hiển thị thời gian comment (nếu có) */}
                    {/* <span className="text-gray-500">{formatTimeAgo(comment.createdAt)}</span> */}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ChapterComments;