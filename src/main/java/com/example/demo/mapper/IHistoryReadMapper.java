package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.demo.dto.respone.HistoryReadRespone;
import com.example.demo.entity.HistoryRead;

@Mapper(componentModel = "spring")
public interface IHistoryReadMapper {
 
	@Mapping(target = "nameNovel",ignore = true)
	HistoryReadRespone toHistoryReadRespone(HistoryRead historyRead); 
	
	void updateHistoryRead(HistoryRead updateHistoryRead,@MappingTarget HistoryRead historyRead); 
}
  