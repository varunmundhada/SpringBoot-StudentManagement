package com.studentproject.demo.studentproject.demo.entity;

import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentRepository extends JpaRepository<Student,Long>  {

}