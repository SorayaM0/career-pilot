package com.careerpilot.backend;

import  com.careerpilot.backend.ai.AIService;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
        properties = {
                "JWT_SECRET=Y2FyZWVyLXBpbG90LXRlc3Qtc2VjcmV0LWtleS0xMjM0NTY3ODkwMTIzNDU2",
                "spring.datasource.url=jdbc:h2:mem:careerpilot_test",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop"
        }
)
class BackendApplicationTests {

    @MockitoBean
    private AIService aiService;

    @Test
    void contextLoads() {
    }
}