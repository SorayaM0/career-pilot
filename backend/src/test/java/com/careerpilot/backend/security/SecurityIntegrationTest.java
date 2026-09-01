package com.careerpilot.backend.security;

import com.careerpilot.backend.ai.AIService;
import com.careerpilot.backend.service.JobApplicationService;
import com.careerpilot.backend.service.JwtService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private JobApplicationService jobApplicationService;

    @MockitoBean
    private AIService aiService;

    @Test
    void applicationsEndpointShouldReturnUnauthorizedWithoutToken()
            throws Exception {

        mockMvc.perform(
                        get("/api/applications")
                )
                .andExpect(
                        status().isUnauthorized()
                );

        verifyNoInteractions(jobApplicationService);
    }

    @Test
    void applicationsEndpointShouldAllowRequestWithValidToken()
            throws Exception {

        String email = "soraya@example.com";

        String token =
                jwtService.generateToken(email);

        when(
                jobApplicationService.getApplications(email)
        ).thenReturn(List.of());

        mockMvc.perform(
                        get("/api/applications")
                                .header(
                                        "Authorization",
                                        "Bearer " + token
                                )
                )
                .andExpect(
                        status().isOk()
                );

        verify(jobApplicationService)
                .getApplications(email);
    }

    @Test
    void applicationsEndpointShouldRejectInvalidToken()
            throws Exception {

        mockMvc.perform(
                        get("/api/applications")
                                .header(
                                        "Authorization",
                                        "Bearer invalid-token"
                                )
                )
                .andExpect(
                        status().isUnauthorized()
                );

        verifyNoInteractions(jobApplicationService);
    }
}