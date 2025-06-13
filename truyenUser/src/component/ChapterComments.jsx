// src/components/ChapterComments.jsx
import React, { useEffect, useState, useRef } from 'react';
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
  updateCommentContent
} from '../redux/commentSlice'; // Đảm bảo đường dẫn đúng
import {
    Send as LucideSend,
    ThumbsUp as LucideThumbsUp,
    ThumbsDown as LucideThumbsDown,
    Trash2 as LucideTrash,
    Edit3 as LucideEdit,
    Loader2 as LucideSpinner,
    MoreVertical as LucideMoreVertical
} from 'lucide-react';

const formatCommentDate = (dateArray) => {
  if (!dateArray || dateArray.length < 6) return ''; // Trả về chuỗi rỗng nếu không có ngày
  try {
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Thời gian không hợp lệ';
    }
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Error formatting date:", e, dateArray);
    return 'Không rõ thời gian';
  }
};


const ChapterComments = ({ chapterId, novelId }) => {
  const dispatch = useDispatch();
  const { commentsByChapter, loading, error } = useSelector((state) => state.comments);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const dropdownRefs = useRef({});

  useEffect(() => {
    if (chapterId) {
      dispatch(getCommentsByChapter(chapterId));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, chapterId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId) {
        const currentDropdownRef = dropdownRefs.current[openDropdownId];
        if (currentDropdownRef && !currentDropdownRef.contains(event.target)) {
          setOpenDropdownId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

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
    } catch (err) { console.error("Lỗi khi gửi bình luận:", err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    // QUAN TRỌNG: Kiểm tra quyền xóa dựa trên ID người dùng khi backend trả về
    // Hiện tại, chỉ có thể dựa vào userName (không an toàn) hoặc user hiện tại phải là admin
    const commentToDelete = commentsByChapter.find(c => c.idComment === commentId);
    if (!commentToDelete) return;

    // TODO: Thay thế điều kiện này khi backend trả về idUser trong comment object
    const canDelete = currentUser && (currentUser.userNameUser === commentToDelete.userName /* || currentUser.role === 'ADMIN' */);

    if (!canDelete) {
        alert("Bạn không có quyền xóa bình luận này.");
        setOpenDropdownId(null);
        return;
    }

    if (window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
        setOpenDropdownId(null);
      } catch (err) { console.error("Lỗi khi xóa bình luận:", err); }
    }
  };

  const handleLike = async (comment) => {
    if (!currentUser?.idUser || !chapterId) {
      alert("Vui lòng đăng nhập để thích bình luận.");
      return;
    }
    try {
      await dispatch(likeComment({ idComment: comment.idComment, idChapter: chapterId, idUser: currentUser.idUser })).unwrap();
    } catch (err) { console.error("Lỗi khi thích bình luận:", err); }
  };

  const handleDislike = async (comment) => {
    if (!currentUser?.idUser || !chapterId) {
      alert("Vui lòng đăng nhập để không thích bình luận.");
      return;
    }
    try {
      await dispatch(dislikeComment({ idComment: comment.idComment, idChapter: chapterId, idUser: currentUser.idUser })).unwrap();
    } catch (err) { console.error("Lỗi khi không thích bình luận:", err); }
  };

  const handleStartEdit = (comment) => {
    // Tương tự handleDeleteComment, cần kiểm tra quyền dựa trên idUser khi có
    const canEdit = currentUser && (currentUser.userNameUser === comment.userName /* || currentUser.role === 'ADMIN' */);
    if (!canEdit) {
        alert("Bạn không có quyền sửa bình luận này.");
        setOpenDropdownId(null);
        return;
    }
    setEditingComment(comment);
    setEditedContent(comment.contentComment);
    setOpenDropdownId(null);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditedContent('');
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editedContent.trim() || !editingComment || !currentUser?.idUser) return;

    setIsUpdating(true);
    try {
      // API updateCommentContent của bạn cần idChapter và idUser trong payload
      await dispatch(updateCommentContent({
        idComment: editingComment.idComment,
        contentComment: editedContent,
        idChapter: chapterId,
        idUser: currentUser.idUser // Gửi idUser của người đang thực hiện hành động
      })).unwrap();
      handleCancelEdit();
    } catch (err) {
      console.error("Lỗi khi cập nhật bình luận:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const assignDropdownRef = (el, commentId) => {
    if (el) {
      dropdownRefs.current[commentId] = el;
    }
  };

  return (
    <div className="mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-sky-400 mb-4 border-b border-gray-700 pb-2">
        Bình luận ({commentsByChapter?.length || 0})
      </h3>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 resize-none"
            rows="3"
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            disabled={isSubmitting}
          />
          {error && typeof error === 'string' && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
      {!loading && commentsByChapter && commentsByChapter.length === 0 && !error && (
        <p className="text-gray-500 text-center py-4">Chưa có bình luận nào cho chương này.</p>
      )}
      {error && typeof error === 'string' && (!commentsByChapter || commentsByChapter.length === 0) && (
         <p className="text-red-500 text-center py-4">{error}</p>
      )}


      <div className="space-y-4">
        {commentsByChapter && commentsByChapter.map((comment) => (
          editingComment && editingComment.idComment === comment.idComment ? (
            <form key={`edit-${comment.idComment}`} onSubmit={handleUpdateComment} className="bg-gray-750 p-3 rounded-md shadow border border-sky-500">
                <textarea
                    className="w-full p-3 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400 resize-none"
                    rows="3"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    required
                    disabled={isUpdating}
                />
                <div className="mt-2 flex items-center space-x-2">
                    <button
                        type="submit"
                        disabled={isUpdating || !editedContent.trim()}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-60 flex items-center"
                    >
                        {isUpdating && <LucideSpinner size={14} className="animate-spin mr-1.5" />}
                        Lưu thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-60"
                    >
                        Hủy
                    </button>
                </div>
            </form>
          ) : (
            <div key={comment.idComment} className="bg-gray-700 p-3 rounded-md shadow">
              <div className="flex items-start space-x-3">
                 {/* Sử dụng avatar mặc định hoặc chữ cái đầu của userName */}
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-400 text-sm font-semibold flex-shrink-0">
                    {comment.userName ? comment.userName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sky-300 text-sm">
                        {comment.userName || "Người dùng ẩn danh"} {/* SỬA Ở ĐÂY */}
                    </p>
                    {/* Điều kiện hiển thị nút ba chấm (TẠM THỜI DỰA VÀO USERNAME) */}
                    {/* TODO: THAY BẰNG currentUser.idUser === comment.idUser KHI BACKEND CẬP NHẬT */}
                    {currentUser && currentUser.userNameUser === comment.userName && (
                      <div className="relative" ref={(el) => assignDropdownRef(el, comment.idComment)}>
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === comment.idComment ? null : comment.idComment)}
                          className="p-1 text-gray-400 hover:text-gray-200 rounded-full focus:outline-none"
                          aria-label="Tùy chọn bình luận"
                        >
                          <LucideMoreVertical size={16} />
                        </button>
                        {openDropdownId === comment.idComment && (
                          <div className="absolute right-0 mt-1 w-32 bg-gray-600 border border-gray-500 rounded-md shadow-lg z-10 py-1">
                            <button
                              onClick={() => handleStartEdit(comment)}
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
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <button
                        onClick={() => handleLike(comment)}
                        className="hover:text-sky-400 flex items-center disabled:opacity-50"
                        disabled={!currentUser || isSubmitting}
                        title="Thích"
                    >
                      <LucideThumbsUp size={14} className="mr-1" /> {comment.likeComment || 0}
                    </button>
                    <button
                        onClick={() => handleDislike(comment)}
                        className="hover:text-red-400 flex items-center disabled:opacity-50"
                        disabled={!currentUser || isSubmitting}
                        title="Không thích"
                    >
                      <LucideThumbsDown size={14} className="mr-1" /> {comment.dislikeComment || 0}
                    </button>
                    {/* API của bạn không trả về timeComment, nên tạm ẩn */}
                    {/* <span className="text-gray-500 text-xs">
                      {comment.timeComment ? formatCommentDate(comment.timeComment) : ''}
                    </span> */}
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