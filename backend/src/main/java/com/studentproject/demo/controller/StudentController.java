package com.studentproject.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studentproject.demo.service.StudentService;
import com.studentproject.demo.studentproject.demo.entity.Student;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/Student")
public class StudentController {

    private StudentService studentService;

    // Constructor Dependency Injection
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Create Student
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // Create Multiple Students
    @PostMapping("/bulk")
    public List<Student> createStudents(@RequestBody List<Student> students) {
        return students.stream()
                .map(studentService::saveStudent)
                .toList();
    }

    // Get All Students
    @GetMapping
    public List<Student> getAllStudent() {
        return studentService.getAllStudent();
    }

    // Get Student By ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Update Student
    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // Delete Student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return "Student deleted successfully";
    }
}