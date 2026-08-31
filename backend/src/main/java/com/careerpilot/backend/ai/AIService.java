package com.careerpilot.backend.ai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final OpenAIClient client;

    public AIService() {
        this.client =
                OpenAIOkHttpClient.fromEnv();
    }

    public String analyzeJobDescription(
            String company,
            String position,
            String jobDescription
    ) {

        if (
                jobDescription == null ||
                jobDescription.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Job description is required for AI analysis."
            );
        }

        String prompt = """
                You are CareerPilot's AI career assistant.

                Analyze this job opportunity for a software engineering candidate.

                Company:
                %s

                Position:
                %s

                Job Description:
                %s

                Provide a concise and practical analysis with these sections:

                KEY SKILLS
                Identify the most important skills required for this role.

                TECHNOLOGIES
                Identify programming languages, frameworks, databases,
                cloud platforms, tools, and technologies.

                RESUME KEYWORDS
                Identify useful keywords from the posting that the candidate
                should consider including if they accurately reflect their experience.

                INTERVIEW TOPICS
                Identify technical areas the candidate should prepare for.

                PREPARATION ADVICE
                Give 3 to 5 practical preparation recommendations.

                Do not invent requirements that are not supported by the job description.
                Keep the analysis specific to this opportunity.
                """.formatted(
                company,
                position,
                jobDescription
        );

        ResponseCreateParams params =
                ResponseCreateParams.builder()
                        .input(prompt)
                        .model("gpt-5.6-terra")
                        .build();

        Response response =
                client.responses()
                        .create(params);

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

        if (result.isEmpty()) {
            throw new IllegalStateException(
                    "OpenAI returned an empty response."
            );
        }

        return result.toString();
    }
}