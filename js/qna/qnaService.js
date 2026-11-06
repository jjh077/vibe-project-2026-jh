import {
  collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc,
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { db } from "../notice/firebase/firebaseConfig.js";

export const QNA_CATEGORIES = ["배송문의", "계정문의", "교환/환불", "시스템오류", "기타"];
const questions = () => collection(db, "questions");
const questionRef = (id) => doc(db, "questions", id);
const contentRef = (id) => doc(db, "questionContents", id);
const answers = (id) => collection(db, "questions", id, "answers");
const normalized = (snap) => ({ id: snap.id, ...snap.data() });

export const qnaService = {
  async getList({ page = 1, pageSize = 10, keyword = "" } = {}) {
    const snapshot = await getDocs(query(questions(), orderBy("createdAt", "desc")));
    const all = snapshot.docs.map(normalized).filter((item) =>
      !keyword || item.title.toLowerCase().includes(keyword.toLowerCase())
      || item.category.toLowerCase().includes(keyword.toLowerCase()));
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    return { items: all.slice((safePage - 1) * pageSize, safePage * pageSize), total, page: safePage, totalPages };
  },
  async getById(id) {
    const snapshot = await getDoc(questionRef(id));
    return snapshot.exists() ? normalized(snapshot) : null;
  },
  async getContent(id) {
    const snapshot = await getDoc(contentRef(id));
    return snapshot.exists() ? snapshot.data() : null;
  },
  async getAnswers(id) {
    const snapshot = await getDocs(query(answers(id), orderBy("createdAt", "asc")));
    return snapshot.docs.map(normalized);
  },
  async create({ title, category, body, isPrivate, authorUid, authorName }) {
    const ref = doc(questions());
    const now = new Date().toISOString();
    await runTransaction(db, async (tx) => {
      tx.set(ref, { title, category, authorUid, authorName, isPrivate, answerCount: 0, createdAt: now, updatedAt: now });
      tx.set(contentRef(ref.id), { body, authorUid, updatedAt: now });
    });
    return { id: ref.id };
  },
  async update(id, { title, category, body, isPrivate }) {
    const now = new Date().toISOString();
    await runTransaction(db, async (tx) => {
      tx.update(questionRef(id), { title, category, isPrivate, updatedAt: now });
      tx.update(contentRef(id), { body, updatedAt: now });
    });
    return { id };
  },
  async addAnswer(id, { body, adminUid, adminName }) {
    const answerRef = doc(answers(id));
    const now = new Date().toISOString();
    await runTransaction(db, async (tx) => {
      const parent = await tx.get(questionRef(id));
      if (!parent.exists()) throw new Error("qna/not-found");
      tx.set(answerRef, { body, adminUid, adminName, createdAt: now });
      tx.update(questionRef(id), { answerCount: (parent.data().answerCount || 0) + 1, updatedAt: now });
    });
  },
  async delete(id) {
    const answerSnapshot = await getDocs(answers(id));
    await Promise.all(answerSnapshot.docs.map((answer) => deleteDoc(answer.ref)));
    await deleteDoc(contentRef(id));
    await deleteDoc(questionRef(id));
  },
};
