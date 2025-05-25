package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.demo.dto.request.UserCreationByEmailRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.respone.UserRespone;
import com.example.demo.entity.User;

@Mapper(componentModel = "spring")
public interface IUserMapper {

	User toUser(UserCreationRequest request);
	User toUserUpdate(UserUpdateRequest request);
	@Mapping(target = "emailUser",source = "email") 
	User toUserByEmail(UserCreationByEmailRequest request);
	UserRespone toUserRespone(User user);
	 
	void updateUser(UserUpdateRequest request,@MappingTarget User user);

}
