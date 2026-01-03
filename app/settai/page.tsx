"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SETTAI_STORAGE_KEY = "bingoSettaiNumber";
const DRAWN_NUMBERS_KEY = "bingoDrawnNumbers";

export default function SettaiPage() {
  const router = useRouter();
  const [settaiNumber, setSettaiNumber] = useState<string>("");
  const [maxNumber] = useState<number>(75); // 固定値として使用（将来的に動的に取得する可能性あり）
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);

  // 初期化処理
  useEffect(() => {
    // LocalStorageから既に抽選された番号を取得
    const storedDrawn = localStorage.getItem(DRAWN_NUMBERS_KEY);
    if (storedDrawn) {
      setDrawnNumbers(JSON.parse(storedDrawn));
    }

    // 現在設定されている接待番号があれば表示
    const currentSettai = localStorage.getItem(SETTAI_STORAGE_KEY);
    if (currentSettai) {
      setSettaiNumber(currentSettai);
      setMessage(`現在、次回の抽選で ${currentSettai} が出るように設定されています`);
      setMessageType("info");
    }
  }, []);

  const handleSubmit = () => {
    const num = parseInt(settaiNumber);

    // バリデーション: 空文字チェック
    if (settaiNumber === "") {
      setMessage("番号を入力してください");
      setMessageType("error");
      return;
    }

    // バリデーション: 数値形式チェック
    if (isNaN(num)) {
      setMessage("有効な数値を入力してください");
      setMessageType("error");
      return;
    }

    // バリデーション: 範囲チェック
    if (num < 1 || num > maxNumber) {
      setMessage(`1から${maxNumber}までの数値を入力してください`);
      setMessageType("error");
      return;
    }

    // バリデーション: 既に抽選済みかチェック
    if (drawnNumbers.includes(num)) {
      setMessage(`番号 ${num} は既に抽選済みです。別の番号を指定してください。`);
      setMessageType("error");
      return;
    }

    // LocalStorageに保存
    localStorage.setItem(SETTAI_STORAGE_KEY, settaiNumber);
    setMessage(`次回の抽選で ${num} が出るように設定しました`);
    setMessageType("success");
  };

  const handleClear = () => {
    localStorage.removeItem(SETTAI_STORAGE_KEY);
    setSettaiNumber("");
    setMessage("設定をクリアしました");
    setMessageType("info");
  };

  const handleBackToMain = () => {
    router.push("/");
  };

  // メッセージの色を決定
  const getMessageColor = () => {
    switch (messageType) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "info":
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎯 接待モード設定
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            次回抽選で出す番号:
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={maxNumber}
              value={settaiNumber}
              onChange={(e) => setSettaiNumber(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="flex-1 border-2 border-gray-300 rounded px-4 py-2 text-2xl text-center focus:border-yellow-500 focus:outline-none"
              placeholder="番号を入力"
            />
            <button
              onClick={handleSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-bold transition-colors"
            >
              設定
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            範囲: 1〜{maxNumber}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded font-medium transition-colors"
          >
            クリア
          </button>
          <button
            onClick={handleBackToMain}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            メイン画面に戻る
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded border ${getMessageColor()} text-sm`}>
            {message}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 mb-2">使い方:</h2>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 次に出したい番号を入力して「設定」をクリック</li>
            <li>• メイン画面で抽選すると、設定した番号が出る</li>
            <li>• 1回使うと自動的にクリアされる</li>
            <li>• 同じブラウザの別タブで開くことを推奨</li>
          </ul>
        </div>

        {drawnNumbers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              抽選済み番号: ({drawnNumbers.length}個)
            </h2>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {drawnNumbers.map((num, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
