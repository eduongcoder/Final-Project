package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Novel;

@Repository
public interface INovelRepository extends JpaRepository<Novel, String>{

}
