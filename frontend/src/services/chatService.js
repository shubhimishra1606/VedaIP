import { mockAnswers } from "../data/mockSources";
const askQuestion = (q, j, _lang) => new Promise((res) => setTimeout(() => res(mockAnswers.find((a) => a.jurisdiction === j && a.match.test(q))?.answer ?? null), 1e3));
export {
  askQuestion
};
