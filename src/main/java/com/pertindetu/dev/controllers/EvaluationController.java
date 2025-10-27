package com.pertindetu.dev.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Evaluation;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.EvaluationRequestDTO;
import com.pertindetu.dev.models.dtos.EvaluationResponseDTO;
import com.pertindetu.dev.services.EvaluationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "*")
@Tag(name = "Evaluations", description = "Endpoints for managing service evaluations and ratings")
public class EvaluationController {

  @Autowired
  private EvaluationService evaluationService;

  @Operation(summary = "List all evaluations")
  @ApiResponse(responseCode = "200", description = "List of evaluations successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<EvaluationResponseDTO>>> findAll() {
    List<EvaluationResponseDTO> list = evaluationService.findAll().stream().map(EvaluationResponseDTO::new).toList();
    return ResponseEntity.ok(new ApiResponseDTO<>(true, list, null));
  }

  @Operation(summary = "Get an evaluation by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Evaluation found"),
      @ApiResponse(responseCode = "404", description = "Evaluation not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<EvaluationResponseDTO>> findById(@PathVariable Long id) {
    EvaluationResponseDTO response = new EvaluationResponseDTO(evaluationService.findById(id));
    return ResponseEntity.ok(new ApiResponseDTO<>(true, response, null));
  }

  @Operation(summary = "Create a new evaluation")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Evaluation created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid evaluation data")
  })
  @PostMapping
  public ResponseEntity<ApiResponseDTO<EvaluationResponseDTO>> create(@Valid @RequestBody EvaluationRequestDTO dto) {
    Evaluation saved = evaluationService.save(dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new EvaluationResponseDTO(saved), null));
  }

  @Operation(summary = "Update an existing evaluation")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Evaluation updated successfully"),
      @ApiResponse(responseCode = "404", description = "Evaluation not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<EvaluationResponseDTO>> update(@PathVariable Long id,
      @Valid @RequestBody EvaluationRequestDTO dto) {
    Evaluation updated = evaluationService.update(id, dto);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, new EvaluationResponseDTO(updated), null));
  }

  @Operation(summary = "Delete an evaluation by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Evaluation deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Evaluation not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<Void>> delete(@PathVariable Long id) {
    evaluationService.deleteById(id);
    return ResponseEntity.ok(new ApiResponseDTO<>(true, null, null));
  }
}