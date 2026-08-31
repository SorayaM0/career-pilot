package com.careerpilot.backend.ai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

import org.springframework.stereotype.Service;

// @Service
public class AIService {

    private final OpenAIClient client;

    public AIService() {
        this.client = OpenAIOkHttpClient.fromEnv();
    }

    public String analyzeJobDescription(
            String jobDescription
    ) {

        String prompt = """
                You are an AI career assistant.

                Analyze the following job description for a software engineering candidate.

                Return a concise analysis containing:

                1. Key skills
                2. Important technologies
                3. Resume keywords
                4. Likely interview topics
                5. Preparation advice

                Job description:

                %s
                """.formatted(jobDescription);

        ResponseCreateParams params =
                ResponseCreateParams.builder()
                        .input(prompt)
                        .model(ChatModel.GPT_5_2)
                        .build();

        Response response =
                client.responses().create(params);

        StringBuilder result =
                new StringBuilder();

        response.output()
                .stream()
                .flatMap(item ->
                        item.message().stream()
                )
                .flatMap(message ->
                        message.content().stream()
                )
                .flatMap(content ->
                        content.outputText().stream()
                )
                .forEach(outputText ->
                        result.append(
                                outputText.text()
                        )
                );

        return result.toString();
    }
}