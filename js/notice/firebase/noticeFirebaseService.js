/**
 * 공지사항 Repository - Firebase Firestore 구현체 (전환용 템플릿, 현재 미사용)
 *
 * 사용 방법
 *  1) firebaseConfig.js 를 만들어 `db` (getFirestore) 를 export
 *  2) 이 파일의 import 경로를 프로젝트 방식(번들러 / CDN)에 맞게 조정
 *  3) js/notice/noticeService.js 의 export 한 줄을 이 구현체로 교체
 *
 * 시그니처는 noticeMockService 와 동일해야 합니다. (UI 수정 불필요)
 * Firestore 컬렉션: "notices"  (문서 ID = doc.id, 번호(no)는 저장하지 않음)
 */
import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, increment,
  query, orderBy, getCountFromServer, where,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const COLLECTION = "notices";
const col = () => collection(db, COLLECTION);
const toNotice = (snap) => ({ id: snap.id, ...snap.data() });
const summarize = (n) => (n ? { id: n.id, title: n.title } : null);

export const noticeFirebaseService = {
  /**
   * 간단 구현: 전체를 가져와 클라이언트에서 필터/정렬/페이징 (공지 수백 건 이하 가정).
   * 글이 많아지면 where + orderBy + limit/startAfter 커서 방식으로 교체하세요.
   * (제목+내용 부분검색은 Firestore 가 지원하지 않으므로 Algolia 등 검색 서비스 필요)
   * 번호(no)는 mock 과 동일하게: 일반 글 최신순 내림차순으로 조회 시 계산.
   */
  async getList({ category = "all", keyword = "", searchType = "all", page = 1, pageSize = 10 } = {}) {
    const snap = await getDocs(query(col(), orderBy("createdAt", "desc")));
    const all = snap.docs.map(toNotice);
    const sorted = [...all.filter((n) => n.isImportant), ...all.filter((n) => !n.isImportant)];

    let cursor = all.filter((n) => !n.isImportant).length;
    const numbers = new Map(sorted.map((n) => [n.id, n.isImportant ? null : cursor--]));

    const q = keyword.trim().toLowerCase();
    const filtered = sorted.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (!q) return true;
      const t = n.title.toLowerCase().includes(q);
      const c = n.content.toLowerCase().includes(q);
      return searchType === "title" ? t : searchType === "content" ? c : t || c;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const items = filtered
      .slice((safePage - 1) * pageSize, safePage * pageSize)
      .map((n) => ({ ...n, no: numbers.get(n.id) }));
    return { items, total, page: safePage, pageSize, totalPages };
  },

  async getById(id) {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    const list = await getDocs(query(col(), orderBy("createdAt", "desc")));
    const all = list.docs.map(toNotice);
    const sorted = [...all.filter((n) => n.isImportant), ...all.filter((n) => !n.isImportant)];
    const i = sorted.findIndex((n) => n.id === id);
    return { ...toNotice(snap), prev: summarize(sorted[i - 1]), next: summarize(sorted[i + 1]) };
  },

  async create(dto) {
    const now = new Date().toISOString();
    const data = { ...dto, attachment: dto.attachment ?? null, views: 0, createdAt: now, updatedAt: now };
    const ref = await addDoc(col(), data);
    return { id: ref.id, ...data };
  },

  async update(id, dto) {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...dto, updatedAt: new Date().toISOString() });
    return toNotice(await getDoc(ref)); // mock 과 동일하게 수정된 문서를 반환
  },

  async delete(id) {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async increaseViews(id) {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { views: increment(1) });
    return toNotice(await getDoc(ref));
  },
};
