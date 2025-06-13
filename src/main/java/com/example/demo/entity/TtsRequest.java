package com.example.demo.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tts_requests")
@Data
public class TtsRequest {
    @Id
    private String requestId;
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED
    private String audioFilePath;
    private String errorMessage;
    private Instant createdAt;
}