// バックグラウンドスクリプト
// 拡張機能のインストール時
chrome.runtime.onInstalled.addListener(() => {
  console.log('記事シェア拡張機能がインストールされました');
});

// メッセージリスナー（必要に応じて追加）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 将来的な機能拡張用
  return true;
});
