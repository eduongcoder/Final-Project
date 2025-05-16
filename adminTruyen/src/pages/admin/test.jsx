import React, { useEffect } from "react";

const CreateNovelTest = () => {
  useEffect(() => {
    const createNovel = async () => {
      const payload = {
        nameNovel: "Truyện test",
        descriptionNovel: "Mô tả thử nghiệm",
        totalChapter: 20,
        rating: "8.5",
        statusNovel: "CONTINUE",
        authors: ['xnnxxn'], // ví dụ ID tác giả
      };

      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      // File ảnh thật hoặc giả đều được
      const dummyFile = new File(["fake content"], "image.jpg", { type: "image/jpeg" });
      formData.append("image", dummyFile);

      try {
        const res = await fetch("https://truongthaiduongphanthanhvu.onrender.com/novel/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("✅ Tạo truyện thành công:", data);
      } catch (error) {
        console.error("❌ Lỗi khi tạo truyện:", error);
      }
    };

    createNovel();
  }, []);

  return null; // không cần giao diện
};

export default CreateNovelTest;
