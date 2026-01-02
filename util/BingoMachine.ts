class BingoMachine {
    private numbers: number[];
    
    constructor(maxNumber: number = 75) {
        // 1 から maxNumber までの番号を生成する
        this.numbers = Array.from({length: maxNumber}, (_, i) => i + 1);
    }

    drawNumber(drawnNumbers: number[]): number | null {
        // 残りの番号を取得（抽選済みを除外）
        const remaining = this.numbers.filter(n => !drawnNumbers.includes(n));

        // すべての番号が抽選済みの場合は null を返す
        if (remaining.length === 0) return null;

        // 残り番号からランダムに選択
        const randomIndex = Math.floor(Math.random() * remaining.length);
        return remaining[randomIndex];
    }

    getRemaining(): number[] {
        return [...this.numbers];
    }
}

export default BingoMachine;
