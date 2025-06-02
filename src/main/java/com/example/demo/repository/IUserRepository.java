package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Novel;
import com.example.demo.entity.User;
import java.util.List;
import java.util.Optional;


@Repository
public interface IUserRepository extends JpaRepository<User, String>{
	User findByEmailUser(String emailUser);
	Optional<User> findByIdUser(String idUser);
    Optional<User> findByUserNameUser(String userNameUser);
}
