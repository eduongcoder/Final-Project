package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.mapper.ICommentMapper;
import com.example.demo.repository.ICommentRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CommentService {

	ICommentRepository commentRepository;
	ICommentMapper commentMapper;
}
