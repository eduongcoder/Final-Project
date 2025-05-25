package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.HistoryId;
import com.example.demo.entity.HistoryRead;
import com.example.demo.entity.Novel;
import com.example.demo.entity.User;
import com.example.demo.entity.Chapter;



@Repository
public interface IHistoryReadRepository extends JpaRepository<HistoryRead, HistoryId>{

	@Query(value = "SELECT * FROM history_read WHERE id_User = :idUser", nativeQuery = true)
	List<HistoryRead> findByIDUser(String idUser);

	List<HistoryRead> findByNovel(Novel novel);
}
