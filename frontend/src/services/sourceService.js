import { sources } from "../data/mockSources";
const searchSources = async (q = "") => sources.filter((s) => (s.title + s.passage + s.type).toLowerCase().includes(q.toLowerCase()));
const getSource = async (id) => sources.find((s) => s.id === id);
export {
  getSource,
  searchSources
};
