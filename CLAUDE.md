# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要
Next.jsベースのビンゴマシンWebアプリケーション。視覚効果と音響効果を備えたインタラクティブなビンゴゲーム運営用。

## 主要コマンド
```bash
# 開発
npm run dev        # 開発サーバー起動（Turbopack使用）

# 本番環境
npm run build      # 本番用ビルド
npm run start      # 本番サーバー起動

# コード品質
npm run lint       # ESLint実行
```

## アーキテクチャ概要

### 主要技術スタック
- **Next.js 15.1.3** App Router使用
- **TypeScript** strictモード有効
- **Tailwind CSS** スタイリング
- **カスタムフォント**: Mochiy Pop One

### 主要コンポーネント構成
```
/app
├── page.tsx                 # メインビンゴゲーム画面
├── /components
│   └── DrawnNumber.tsx     # 抽選済み番号表示（色分けボーダー付き）
├── /hooks
│   └── useSound.tsx        # 効果音管理
/util
└── BingoMachine.ts         # ビンゴロジック（番号抽選、状態管理）
/public                     # 音声ファイル（drumroll.mp3、timpani.mp3等）
```

### 重要な実装詳細

1. **BingoMachineクラス** (`/util/BingoMachine.ts`)
   - 抽選済み番号と残り番号の管理
   - 最大番号設定可能（1-999）
   - 重複なし抽選

2. **サウンドシステム** (`/app/hooks/useSound.tsx`)
   - 複数の効果音オプション（ランダム選択可能）
   - アニメーションと同期
   - 再生時間: 3000ms（アニメーションタイミングと一致）

3. **アニメーションタイミング**
   - 番号表示アニメーション: 2.8秒（`globals.css`で定義）
   - 効果音再生時間: 3秒（`useSound.tsx`）
   - 抽選番号表示遅延: 3000ms（`page.tsx`）

4. **状態管理**
   - React hooksによるローカル状態管理
   - LocalStorageで抽選済み番号を永続化
   - 段階的表示用のvisualNumbers配列

5. **スタイリングパターン**
   - 番号範囲による色分け（1-10: 赤、11-20: 青など）
   - 日本風テーマ（季節変更可能、現在: お正月）
   - レスポンシブグリッドレイアウト

## 開発時の注意点
- アニメーション変更時は以下のタイミングを統一すること：
  - CSSアニメーション時間（`globals.css`）
  - 効果音再生時間（`useSound.tsx`）
  - 表示遅延時間（`page.tsx`）
- ヘッダーと背景スタイルを変更することで異なるテーマに対応可能
- 番号の色分けロジックは`DrawnNumber.tsx`コンポーネントで管理

## アプリケーション詳細仕様

### ユーザーインターフェース
1. **メインヘッダー**
   - タイトル: 「🎍お正月🎍ビンゴ大会」
   - グラデーション効果（赤から黄色）
   - 白い半透明の背景効果

2. **番号表示エリア**
   - 超大型フォント（12rem）で現在の番号を表示
   - アニメーション効果（スケール変化とフェードイン）
   - 初期状態は「-」表示

3. **操作パネル**
   - **抽選ボタン**: 青いグラデーション、ホバー効果付き
   - **最大値設定**: 数値入力（1-999）、抽選開始後は変更不可
   - **音声選択**: ラジオボタンで4種類から選択
     - ランダム（デフォルト）
     - サウンド1: ドラムロール＆終了音
     - サウンド2: ティンパニー＆ドン音
     - サウンド3: パパ音

4. **抽選済み番号グリッド**
   - レスポンシブグリッドレイアウト
   - 番号ごとに色分けされたボーダー
   - ホバー時に拡大効果（scale-110）
   - フェードインアニメーション

5. **リセットボタン**
   - 赤いグラデーション
   - 全状態をクリアしてページをリロード

### 番号の色分けルール
```
1-10:   赤 (border-red-500)
11-20:  青 (border-blue-500)
21-30:  緑 (border-green-500)
31-40:  黄 (border-yellow-500)
41-50:  紫 (border-purple-500)
51-60:  ピンク (border-pink-500)
61-70:  オレンジ (border-orange-500)
71-80:  ティール (border-teal-500)
81以上: グレー (border-gray-500)
```

### 状態管理フロー
1. **初期化**
   - LocalStorageから前回の抽選番号を復元
   - BingoMachineインスタンスを作成
   - 初回レンダリングフラグを設定

2. **番号抽選プロセス**
   - 抽選ボタンクリック
   - isDrumRollフラグをtrueに設定（ボタン無効化）
   - 効果音再生開始
   - 新しい番号を生成・表示
   - 3秒後にvisibleNumbersに追加
   - LocalStorageに自動保存

3. **データ永続化**
   - キー: `"bingoDrawnNumbers"`
   - 形式: JSON配列
   - 更新タイミング: drawnNumbers変更時

### レスポンシブデザイン仕様
```
画面幅         グリッド列数
< 640px       2列
640px以上     3列
768px以上     4列
1024px以上    5列
1280px以上    6列
1536px以上    8列
```

### アニメーション詳細
- **番号変更アニメーション** (2.8秒)
  - 0-80%: opacity 0, scale 0.1
  - 80-90%: opacity 1, scale 1.2
  - 90-100%: scale 1.0
  - イージング: cubic-bezier(0.34, 1.56, 0.64, 1)

### 既知の問題
**重要**: BingoMachine.tsのdrawNumber関数にバグがあります。
現在の実装では番号の生成が正しく動作しません。
修正が必要な箇所:
- 番号の範囲とインデックスの混同
- 無限ループの可能性

### カスタマイズポイント
1. **テーマ変更**
   - layout.tsxの背景グラデーション
   - page.tsxのヘッダータイトルとデザイン

2. **タイミング調整**
   - globals.css: アニメーション時間
   - useSound.tsx: 効果音の長さ
   - page.tsx: 表示遅延時間

3. **ビンゴ設定**
   - 最大番号の初期値（現在75）
   - 番号の色分けルール
   - グリッドレイアウトのブレークポイント

## フォルダ構造詳細

### プロジェクト全体構造
```
MyBingoMachine/
├── app/                            # Next.js App Router
│   ├── components/                 # 再利用可能なコンポーネント
│   │   └── DrawnNumber.tsx        # 抽選済み番号表示コンポーネント
│   ├── hooks/                     # カスタムReactフック
│   │   └── useSound.tsx           # 効果音管理フック
│   ├── favicon.ico                # ファビコン
│   ├── globals.css                # グローバルスタイル・アニメーション定義
│   ├── layout.tsx                 # ルートレイアウト（全ページ共通）
│   └── page.tsx                   # メインページ（ビンゴゲーム画面）
├── public/                        # 静的ファイル（直接アクセス可能）
│   ├── drumroll.mp3              # ドラムロール音
│   ├── drumroll_and_rollend.mp3  # ドラムロール＋終了音
│   ├── papa.mp3                  # パパ音
│   ├── rollend.mp3               # 終了音のみ
│   ├── tinpani_and_don.mp3       # ティンパニー＋ドン音
│   ├── file.svg                  # ファイルアイコン
│   ├── globe.svg                 # 地球アイコン
│   ├── next.svg                  # Next.jsロゴ
│   ├── vercel.svg                # Vercelロゴ
│   └── window.svg                # ウィンドウアイコン
├── util/                          # ユーティリティ・ビジネスロジック
│   └── BingoMachine.ts           # ビンゴマシンコアロジック
├── .gitignore                    # Git除外設定
├── CLAUDE.md                     # プロジェクト詳細仕様書（このファイル）
├── README.md                     # 標準的なNext.js README
├── eslint.config.mjs             # ESLint設定
├── next-env.d.ts                 # Next.js型定義（自動生成）
├── next.config.ts                # Next.js設定
├── package-lock.json             # 依存関係ロックファイル
├── package.json                  # プロジェクト設定・スクリプト
├── postcss.config.mjs            # PostCSS設定（Tailwind CSS用）
├── tailwind.config.ts            # Tailwind CSS設定
└── tsconfig.json                 # TypeScript設定
```

### 各ディレクトリの役割

#### `/app` - アプリケーションコード
Next.js 13以降のApp Router構造を採用。すべてのアプリケーションコードがここに含まれる。

- **`/components`**: 再利用可能なUIコンポーネント
  - `DrawnNumber.tsx`: 番号表示専用コンポーネント（色分け機能付き）
  
- **`/hooks`**: カスタムReactフック
  - `useSound.tsx`: 効果音の読み込みと再生を管理
  
- **ルートファイル**:
  - `page.tsx`: メインのビンゴゲーム画面（"/"ルート）
  - `layout.tsx`: 全ページ共通のレイアウト（背景、フォント）
  - `globals.css`: 全体適用のCSS（アニメーション定義含む）

#### `/public` - 静的アセット
ブラウザから直接アクセス可能な静的ファイル。

- **音声ファイル** (5種類):
  - 抽選時の演出効果音
  - 形式: MP3
  - 用途別に複数バリエーション用意
  
- **SVGアイコン** (5種類):
  - Next.jsテンプレートのデフォルトアイコン
  - 現在のアプリケーションでは未使用

#### `/util` - ビジネスロジック
UIから独立したコアロジックを配置。

- `BingoMachine.ts`: ビンゴゲームのコアロジック
  - 番号プールの管理
  - ランダム抽選機能
  - 残り番号の追跡

### 設定ファイルの配置と役割

#### TypeScript関連
- `tsconfig.json`: コンパイラオプション、パスエイリアス設定
- `next-env.d.ts`: Next.js用の型定義（自動生成、編集不要）

#### スタイリング関連
- `tailwind.config.ts`: Tailwind CSSのカスタマイズ（フォント、色など）
- `postcss.config.mjs`: PostCSSプラグイン設定（Tailwind CSS処理用）
- `globals.css`: グローバルスタイルとカスタムアニメーション

#### ビルド・開発関連
- `next.config.ts`: Next.jsの動作設定（現在はデフォルト）
- `package.json`: 依存関係、スクリプト定義
- `eslint.config.mjs`: コード品質チェックルール

#### その他
- `.gitignore`: バージョン管理から除外するファイル指定
- `README.md`: プロジェクトの基本情報
- `CLAUDE.md`: 詳細な技術仕様書（このファイル）

### ファイル命名規則
- **コンポーネント**: PascalCase（例: `DrawnNumber.tsx`）
- **フック**: camelCase with "use"プレフィックス（例: `useSound.tsx`）
- **ユーティリティ**: PascalCase（例: `BingoMachine.ts`）
- **設定ファイル**: kebab-case または dot notation
- **静的アセット**: lowercase with underscores

### 重要な考慮事項
1. `/app`ディレクトリはNext.js App Routerの規約に従う
2. `/public`内のファイルは`/`から直接アクセス可能
3. TypeScriptのstrictモードが有効なため、型安全性が保証される
4. Tailwind CSSのユーティリティクラスを使用してスタイリング