export async function getQuestions(amount, category, difficulty) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`,
      { method: "GET" }
    );
    if (response.ok) {
      const questions = await response.json();
      return questions;
    } else {
      const error = await response.json();

      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
}
