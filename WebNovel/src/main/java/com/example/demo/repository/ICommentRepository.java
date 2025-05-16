package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Comment;
import com.example.demo.entity.Novel;
import com.example.demo.entity.User;

@Repository
public interface ICommentRepository extends JpaRepository<Comment, Integer>{

}
