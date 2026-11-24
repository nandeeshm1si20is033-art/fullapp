package com.example.todo.service;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import com.example.todo.web.TodoNotFoundException;
import com.example.todo.web.TodoRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional 
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Todo> findAll(String status) {
        if ("active".equalsIgnoreCase(status)) {
            return repository.findByCompletedOrderByCreatedAtDesc(false);
        }
        if ("completed".equalsIgnoreCase(status)) {
            return repository.findByCompletedOrderByCreatedAtDesc(true);
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Todo findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    }

    public Todo create(TodoRequest request) {
        Todo todo = new Todo(request.title().trim());
        if (request.completed() != null) {
            todo.setCompleted(request.completed());
        }
        return repository.save(todo);
    }

    public Todo update(Long id, TodoRequest request) {
        Todo todo = findById(id);
        todo.setTitle(request.title().trim());
        if (request.completed() != null) {
            todo.setCompleted(request.completed());
        }
        return repository.save(todo);
    }

    public Todo toggle(Long id) {
        Todo todo = findById(id);
        todo.setCompleted(!todo.isCompleted());
        return repository.save(todo);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new TodoNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public long clearCompleted() {
        return repository.deleteByCompletedTrue();
    }
}
