import { useCallback, useEffect, useRef, useState } from 'react';

// 音声ファイルの定義
const sounds = [
  { src: '/drumroll_and_rollend.mp3'},
  { src: '/tinpani_and_don.mp3'},
  { src: '/papa.mp3'},
];

export const useSound = () => {
  // 音声オブジェクトをキャッシュするためのRef
  const audioCache = useRef<HTMLAudioElement[]>([]);
  // ロード完了状態を管理
  const [isLoaded, setIsLoaded] = useState(false);

  // コンポーネントマウント時に全音声をプリロード
  useEffect(() => {
    let loadedCount = 0;
    const totalSounds = sounds.length;

    sounds.forEach((sound, index) => {
      const audio = new Audio(sound.src);
      audio.preload = 'auto'; // 自動プリロード

      // ロード完了時のイベントリスナー
      audio.addEventListener('canplaythrough', () => {
        loadedCount++;
        if (loadedCount === totalSounds) {
          setIsLoaded(true);
          console.log('全音声ファイルのプリロード完了なのだ！');
        }
      });

      // エラーハンドリング
      audio.addEventListener('error', (e) => {
        console.error(`音声ファイルのロードに失敗: ${sound.src}`, e);
      });

      // 明示的にロード開始
      audio.load();
      audioCache.current[index] = audio;
    });

    // クリーンアップ
    return () => {
      audioCache.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current = [];
    };
  }, []);

  const playSound = useCallback(async (soundIndex: number) => {
    // 演出時間の調整 → page.tsxのtimerのdurationを変更する
    // アニメーションの長さ → globals.cssのanimationのdurationを変更する

    if (soundIndex === 0) {
      // ランダムに再生する
      const randomIndex = Math.floor(Math.random() * sounds.length);
      const audio = audioCache.current[randomIndex];
      if (!audio) {
        console.error('選択された音声ファイルが見つかりません');
        return;
      }
      // 再生位置をリセットして再生
      audio.currentTime = 0;
      audio.play().catch(err => console.error('再生エラー:', err));
    } else {
      // 選択された音声を再生する
      const audio = audioCache.current[soundIndex - 1];
      if (!audio) {
        console.error('選択された音声ファイルが見つかりません');
        return;
      }
      // 再生位置をリセットして再生
      audio.currentTime = 0;
      audio.play().catch(err => console.error('再生エラー:', err));
    }
  }, []);

  return { playSound, isLoaded };
};
