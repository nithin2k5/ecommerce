package com.ecommerce.exception;

import org.hibernate.exception.SQLGrammarException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SQLGrammarException.class)
    public ResponseEntity<Object> handleSQLGrammarException(SQLGrammarException ex) {
        Map<String, Object> body = new HashMap<>();
        
        // Extract useful information
        String message = ex.getMessage();
        String sqlState = ex.getSQLException().getSQLState();
        
        // Check if this is a "column not found" error
        if (message.contains("column") || message.contains("field") || 
            message.contains("doesn't exist") || message.contains("unknown")) {
            
            body.put("error", "Database schema issue detected");
            body.put("message", "The database schema might be missing required columns");
            body.put("sqlState", sqlState);
            body.put("details", message);
            body.put("suggestion", "Please contact the administrator or check the migration scripts");
            
            return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        // Generic SQL error response
        body.put("error", "Database error");
        body.put("message", message);
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        
        // Extract useful information
        String message = ex.getMessage();
        
        // Format a more user-friendly message
        if (message.contains("Duplicate entry")) {
            body.put("error", "Duplicate data");
            body.put("message", "This record already exists in the database");
        } else if (message.contains("foreign key constraint")) {
            body.put("error", "Reference error");
            body.put("message", "This operation violates a database relationship constraint");
        } else {
            body.put("error", "Data integrity error");
            body.put("message", "The data cannot be processed due to integrity issues");
        }
        
        body.put("details", message);
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<Object> handleSQLException(SQLException ex) {
        Map<String, Object> body = new HashMap<>();
        
        String message = ex.getMessage();
        String sqlState = ex.getSQLState();
        
        body.put("error", "Database error");
        body.put("message", message);
        body.put("sqlState", sqlState);
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 