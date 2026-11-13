import { openaiCompatibleText } from "@tanstack/ai-openai/compatible";

// TanStack AI chat adapter on the platform's OpenAI-compatible AI gateway.
// Called as the app (service role), so authenticate the caller first.
// "automatic" lets the platform pick the model.
export const gatewayModel = (client, model = "automatic") => {
  const { baseURL, token, headers } = client.asServiceRole.aiGateway.connection();
  return openaiCompatibleText(model, { name: "base44", baseURL, apiKey: token, defaultHeaders: headers });
};
