package com.example.demo.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Author;
import com.example.demo.entity.Novel;

@Repository
public interface IAuthorRepository extends JpaRepository<Author, String> {

//	@Query(value = "SELECT n.* FROM novel n JOIN novel_authors na ON n.id_novel = na.novel_id_novel WHERE na.authors_id_author = :idAuthor", nativeQuery = true)
//	Set<Novel> getNovelByIdAuthor(@Param("idAuthor") String idAuthor);

	@Query("SELECT DISTINCT a FROM Author a LEFT JOIN FETCH a.novels")
	List<Author> findAllWithNovels();

}
