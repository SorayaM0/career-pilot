package com.careerpilot.backend.config;

import com.careerpilot.backend.ai.AIService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        properties = {
                "JWT_SECRET=Y2FyZWVyLXBpbG90LXRlc3Qtc2VjcmV0LWtleS0xMjM0NTY3ODkwMTIzNDU2",
                "spring.datasource.url=jdbc:h2:mem:careerpilot_security_test",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop"
        }
)
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AIService aiService;

    @Test
    void authEndpointShouldBePublic() throws Exception {

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {
                                    "email": "test@example.com",
                                    "password": "wrong-password"
                                }
                                """)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void applicationsEndpointShouldRejectRequestWithoutJwt()
            throws Exception {

        mockMvc.perform(
                get("/api/applications")
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void otherProtectedEndpointShouldRejectRequestWithoutJwt()
            throws Exception {

        mockMvc.perform(
                get("/api/hello")
        )
        .andExpect(status().isUnauthorized());
    }
}