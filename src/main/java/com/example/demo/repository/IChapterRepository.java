package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Chapter;
import java.util.List;


@Repository
public interface IChapterRepository extends JpaRepository<Chapter, Integer>{
	Chapter findByTitleChapter(String titleChapter);
	boolean existsByTitleChapter(String titleChapter);
	
	List<Chapter> findByNovel_IdNovel(String idNovel);

}
