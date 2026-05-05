package com.maheensayuru.backend.controller;

import com.maheensayuru.backend.model.Assignment;
import com.maheensayuru.backend.repository.AssignmentRepository;
import com.maheensayuru.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Get all assignments for a specific course
    @GetMapping("/courses/{courseId}/assignments")
    public List<Assignment> getAssignmentsByCourse(@PathVariable Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    // Create an assignment for a specific course
    @PostMapping("/courses/{courseId}/assignments")
    public ResponseEntity<Assignment> createAssignment(@PathVariable Long courseId, @RequestBody Assignment assignment) {
        return courseRepository.findById(courseId).map(course -> {
            assignment.setCourse(course);
            return ResponseEntity.ok(assignmentRepository.save(assignment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NEW TOGGLE ENDPOINT ---
    @PutMapping("/assignments/{id}/toggle")
    public ResponseEntity<Assignment> toggleAssignmentStatus(@PathVariable Long id) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setCompleted(!assignment.isCompleted()); // Flips true to false, or false to true
            return ResponseEntity.ok(assignmentRepository.save(assignment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a specific assignment
    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignmentRepository.delete(assignment);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}