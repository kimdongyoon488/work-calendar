package com.workcalendar.controller;

import com.workcalendar.dto.TaskCardDto.*;
import com.workcalendar.service.TaskCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/task-cards")
public class TaskCardController {

    private final TaskCardService taskCardService;


    /**
     * 업무카드 등록
     */
    @PostMapping
    public ResponseEntity<InsertTaskCardResponseDto> insertTaskCard(
            @RequestBody InsertTaskCardRequestDto insertTaskCardRequestDto
    ) {
        InsertTaskCardResponseDto response = taskCardService.insertTaskCard(insertTaskCardRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * 업무카드 상세 조회
     */
    @GetMapping("/{taskCardId}")
    public ResponseEntity<TaskCardDetailResponseDto> getTaskCard(
            @PathVariable("taskCardId") Long taskCardId
    ) {
        TaskCardDetailResponseDto response = taskCardService.getTaskCard(taskCardId);

        return ResponseEntity.ok(response);
    }

    /**
     * 월별 업무카드 조회
     */
    @GetMapping
    public ResponseEntity<List<TaskCardMonthlyDto>> getMonthlyTaskCards(
            @RequestParam int year,
            @RequestParam int month
    ) {
        List<TaskCardMonthlyDto> response = taskCardService.getTaskCardsByMonth(year, month);
        return ResponseEntity.ok(response);
    }


    /**
     * 업무카드 수정
     */
    @PutMapping("/{taskCardId}")
    public ResponseEntity<UpdateTaskCardResponseDto> updateTaskCard(
            @PathVariable Long taskCardId,
            @RequestBody UpdateTaskCardRequestDto updateTaskCardRequestDto
    ) {

        updateTaskCardRequestDto.setTaskCardId(taskCardId);
        UpdateTaskCardResponseDto response = taskCardService.updateTaskCard(updateTaskCardRequestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * 업무카드 삭제
     */
    @DeleteMapping("/{taskCardId}")
    public ResponseEntity<DeleteTaskCardResponseDto> deleteTaskCard(
            @PathVariable Long taskCardId
    ) {

        DeleteTaskCardRequestDto deleteTaskCardRequestDto = DeleteTaskCardRequestDto.builder()
                .taskCardId(taskCardId)
                .build();

        DeleteTaskCardResponseDto response = taskCardService.deleteTaskCard(deleteTaskCardRequestDto);

        return ResponseEntity.ok(response);
    }
}
