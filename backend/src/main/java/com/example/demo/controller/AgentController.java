package com.example.demo.controller;

import com.example.demo.entity.Agent;
import com.example.demo.repo.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AgentController {

    @Autowired
    private AgentRepository repo;

    @PostConstruct
    public void initAgents() {
        if (repo.count() == 0) {
            repo.saveAll(Arrays.asList(
                new Agent(2L, "Agent Smith", "available"),
                new Agent(4L, "Agent Jones", "available")
            ));
        }
    }

    @GetMapping("/available")
    public List<Agent> getAvailableAgents() {
        return repo.findByStatus("available");
    }
}
