package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Category;


@Repository
public interface ICategoryRepository extends JpaRepository<Category, String>{
	 Category findByNameCategory(String nameCategory);
	 boolean existsByNameCategory(String nameCategory);
}
