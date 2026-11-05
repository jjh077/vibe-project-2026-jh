/**
 * 공지사항 Repository - localStorage(Mock) 구현체
 *
 * [Repository 인터페이스] (Firebase 구현체도 동일한 시그니처를 지켜야 합니다)
 *   getList(params)        -> { items, total, page, pageSize, totalPages }
 *   getById(id)            -> Notice(+prev/next) | null
 *   create(dto)            -> Notice
 *   update(id, dto)        -> Notice
 *   delete(id)             -> void
 *   increaseViews(id)      -> Notice
 *
 * Notice: { id, category, isImportant, title, author, content,
 *           attachment: {name,size}|null, views, createdAt(ISO), updatedAt(ISO) }
 *
 * 규칙: 모든 메서드 async / ID 는 crypto.randomUUID / 날짜는 ISO 문자열 /
 *       없는 데이터는 null 반환(조회) 또는 Error throw(수정·조회수) 로 일관.
 */
import { storageHelper, generateId } from "./storageHelper.js";
import { NOTICE_SEED } from "./noticeSeed.js";

const STORAGE_KEY = "mock_notices";
const DEFAULT_PAGE_SIZE = 10;

/* ---------- 내부 유틸 (순수 함수) ---------- */

/** 최초 1회 시드 주입. 이후에는 저장소의 값을 그대로 사용 */
const loadAll = async () => {
  const stored = await storageHelper.get(STORAGE_KEY, null);
  if (stored) return stored;

  const seeded = NOTICE_SEED.map((item) => ({
    ...item,
    updatedAt: item.createdAt,
  }));
  await storageHelper.set(STORAGE_KEY, seeded);
  return seeded;
};

/** 정렬 기준: 필독(상단 고정) 우선 → 최신순 내림차순 */
const sortForList = (list) =>
  [...list].sort((a, b) => {
    if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
    return a.id < b.id ? 1 : -1;
  });

/**
 * 번호는 저장하지 않고 조회 시 계산합니다.
 * - 고정(필독) 글: no = null (UI 에서 "공지" 배지)
 * - 그 외: 전체 일반 글 기준 최신순 내림차순 (최신 글 = 가장 큰 번호)
 *   → 탭/검색 필터와 무관하게 번호가 고정됩니다.
 */
const attachNumbers = (sorted) => {
  const normalCount = sorted.filter((item) => !item.isImportant).length;
  let cursor = normalCount;
  return new Map(
    sorted.map((item) => [item.id, item.isImportant ? null : cursor--]),
  );
};

const matchesKeyword = (item, keyword, searchType) => {
  const q = keyword.toLowerCase();
  const inTitle = item.title.toLowerCase().includes(q);
  const inContent = item.content.toLowerCase().includes(q);
  if (searchType === "title") return inTitle;
  if (searchType === "content") return inContent;
  return inTitle || inContent;
};

const summarize = (item) => (item ? { id: item.id, title: item.title } : null);

/* ---------- Repository ---------- */

export const noticeMockService = {
  /**
   * @param {{category?: string, keyword?: string, searchType?: 'all'|'title'|'content',
   *          page?: number, pageSize?: number}} [params]
   */
  async getList(params = {}) {
    const {
      category = "all",
      keyword = "",
      searchType = "all",
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = params;

    const sorted = sortForList(await loadAll());
    const numbers = attachNumbers(sorted);
    const q = keyword.trim();

    const filtered = sorted.filter(
      (item) =>
        (category === "all" || item.category === category) &&
        (!q || matchesKeyword(item, q, searchType)),
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;

    const items = filtered
      .slice(start, start + pageSize)
      .map((item) => ({ ...item, no: numbers.get(item.id) }));

    return { items, total, page: safePage, pageSize, totalPages };
  },

  /** 상세 조회 + 이전글/다음글(목록 정렬 기준 바로 앞/뒤 글) */
  async getById(id) {
    const sorted = sortForList(await loadAll());
    const index = sorted.findIndex((item) => item.id === id);
    if (index === -1) return null;

    return {
      ...sorted[index],
      prev: summarize(sorted[index - 1]),
      next: summarize(sorted[index + 1]),
    };
  },

  async create(dto) {
    const list = await loadAll();
    const now = new Date().toISOString();
    const created = {
      id: generateId(),
      category: dto.category,
      isImportant: Boolean(dto.isImportant),
      title: dto.title,
      author: dto.author,
      content: dto.content,
      attachment: dto.attachment ?? null,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(created);
    await storageHelper.set(STORAGE_KEY, list);
    return created;
  },

  /** views / createdAt / id 는 수정 대상에서 제외 */
  async update(id, dto) {
    const list = await loadAll();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Notice ${id} not found`);

    const { category, isImportant, title, author, content, attachment } = dto;
    const patch = { category, isImportant, title, author, content, attachment };
    Object.keys(patch).forEach((key) => patch[key] === undefined && delete patch[key]);

    const updated = {
      ...list[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    await storageHelper.set(STORAGE_KEY, list);
    return updated;
  },

  async delete(id) {
    const list = await loadAll();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) throw new Error(`Notice ${id} not found`);
    await storageHelper.set(STORAGE_KEY, filtered);
  },

  /** 조회수 +1 (Firebase 전환 시 increment(1) 로 원자적 처리) */
  async increaseViews(id) {
    const list = await loadAll();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Notice ${id} not found`);

    list[index] = { ...list[index], views: list[index].views + 1 };
    await storageHelper.set(STORAGE_KEY, list);
    return list[index];
  },
};
