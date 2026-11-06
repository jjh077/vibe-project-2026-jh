/**
 * 공지사항 Repository 진입점
 * UI 코드는 오직 이 파일의 `noticeService` 만 import 합니다.
 *
 * ▶ Firebase 전환 시 아래 한 줄만 교체하세요.
 */

// Firebase Firestore mode
export { noticeFirebaseService as noticeService } from "./firebase/noticeFirebaseService.js";

// To switch back to localStorage during development, export noticeMockService above.
