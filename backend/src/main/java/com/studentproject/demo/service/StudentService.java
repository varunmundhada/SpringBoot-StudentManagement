package com.studentproject.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.studentproject.demo.studentproject.demo.entity.Student;
import com.studentproject.demo.studentproject.demo.entity.StudentRepository;


@Service
public class StudentService {

    private StudentRepository studentRepository;
  //constructor dependency injection - passing object through constructor
    public StudentService(StudentRepository studentRepository)
    {
    	this.studentRepository = studentRepository; 
    }
    public Student saveStudent(Student student){
    	return studentRepository.save(student);
    }
    public List<Student> getAllStudent(){
    	return studentRepository.findAll();
    	}
    public Student getStudentById(Long id) {
    	return studentRepository.findById(id)
    			.orElseThrow(() ->new RuntimeException("Employee not found"));
    }
    
    public Student updateStudent(Long id, Student studentDetails) {
    	Student student = getStudentById(id);
    	student.setName(studentDetails.getName());
    	student.setBranch(studentDetails.getBranch());
    	student.setRollno(studentDetails.getRollno());
		return studentRepository.save(student);
    }
    public void deleteStudent(Long id) {
    	studentRepository.deleteById(id);
    }
}
