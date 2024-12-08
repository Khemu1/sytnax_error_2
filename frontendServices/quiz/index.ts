import { CustomError } from "@/middleware/CustomError";

export const addQuizParticipantService = async (
  quizData: FormData
): Promise<{
  id: string;
  QuizTotalScore: number | null;
  totalUserScore: number | null;
  clean: boolean;
}> => {
  try {
    const response = await fetch(`/api/quiz/add-participant`, {
      method: "POST",

      body: quizData,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const errorMessage = errorData.message ?? "Unknown Error Occurred";

      const err = new CustomError(
        errorMessage,
        response.status,
        "addQuizParticipantError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
