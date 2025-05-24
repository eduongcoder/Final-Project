// src/components/ChapterComments.jsx
import React, { useEffect, useState } from 'react';
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
  // updateCommentContent // Nếu bạn triển khai edit
} from '../redux/commentSlice'; // Điều chỉnh đường dẫn
import {
    Send as LucideSend,
    ThumbsUp as LucideThumbsUp,
    ThumbsDown as LucideThumbsDown,
    Trash2 as LucideTrash,
    Edit3 as LucideEdit, // Hoặc Pencil
    Loader2 as LucideSpinner // Icon loading của Lucide
} from 'lucide-react';

const ChapterComments = ({ chapterId, novelId, currentUserId }) => {
  const dispatch = useDispatch();
  const { commentsByChapter, loading, error } = useSelector((state) => state.comments);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (chapterId) {
      dispatch(getCommentsByChapter(chapterId));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, chapterId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser?.idUser || !chapterId) {
      return;
    }
    setIsSubmitting(true);
    dispatch(clearCommentError());
    try {
      await dispatch(createComment({
        contentComment: newComment,
        idUser: currentUser.idUser,
        idChapter: chapterId
      })).unwrap();
      setNewComment('');
    } catch (rejectedValueOrSerializedError) {
      console.error("Failed to submit comment:", rejectedValueOrSerializedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
      } catch (err) {
        console.error("Failed to delete comment", err);
      }
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser?.idUser || !chapterId) return;
    try {
      await dispatch(likeComment({ idComment: commentId, idChapter: chapterId, idUser: currentUser.idUser })).unwrap();
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  const handleDislike = async (commentId) => {
     if (!currentUser?.idUser || !chapterId) return;
    try {
      await dispatch(dislikeComment({ idComment: commentId, idChapter: chapterId, idUser: currentUser.idUser })).unwrap();
    } catch (err) {
      console.error("Failed to dislike comment", err);
    }
  };

  return (
    <div className="mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-sky-400 mb-4 border-b border-gray-700 pb-2">Bình luận ({commentsByChapter.length})</h3>

      {currentUser && (
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
          {error && <p className="text-red-500 text-xs mt-1">{typeof error === 'string' ? error : error.message}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting
              ? <LucideSpinner size={18} className="animate-spin mr-2" />
              : <LucideSend size={16} className="mr-2" />
            }
            Gửi bình luận
          </button>
        </form>
      )}
      {!currentUser && (
         <p className="mb-6 text-gray-400 text-sm">Vui lòng <Link to="/login" className="text-sky-400 hover:underline">đăng nhập</Link> để bình luận.</p>
      )}

      {loading && commentsByChapter.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          <LucideSpinner size={24} className="animate-spin inline mr-2" /> Đang tải bình luận...
        </div>
      )}
      {!loading && commentsByChapter.length === 0 && !error && (
        <p className="text-gray-500 text-center py-4">Chưa có bình luận nào cho chương này.</p>
      )}

      <div className="space-y-4">
        {commentsByChapter.map((comment) => (
          <div key={comment.idComment} className="bg-gray-700 p-3 rounded-md shadow">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <p className="font-semibold text-sky-300 text-sm">{comment.userName || "Người dùng ẩn danh"}</p>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{comment.contentComment}</p>
                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                  <button onClick={() => handleLike(comment.idComment)} className="hover:text-sky-400 flex items-center disabled:opacity-50" disabled={!currentUser}>
                    <LucideThumbsUp size={14} className="mr-1" /> {comment.likeComment || 0}
                  </button>
                  <button onClick={() => handleDislike(comment.idComment)} className="hover:text-red-400 flex items-center disabled:opacity-50" disabled={!currentUser}>
                    <LucideThumbsDown size={14} className="mr-1" /> {comment.dislikeComment || 0}
                  </button>
                  {currentUser && currentUser.idUser === comment.user && (
                    <>
                      <button className="hover:text-yellow-400" onClick={() => alert("Chức năng sửa chưa hoạt động")}>
                        <LucideEdit size={14} />
                      </button>
                      <button onClick={() => handleDeleteComment(comment.idComment)} className="hover:text-red-400">
                        <LucideTrash size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterComments;