

interface KFactorOptions {
    rating: number;
    gamesPlayed: number;
}
  
export function calculateEloChange(winnerRating: number, loserRating: number, kFactorOptions: KFactorOptions): { winnerNewRating: number, loserNewRating: number } {
    const kFactor = getKFactor(kFactorOptions);
    
    const winnerExpected = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const loserExpected = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  
    const winnerNewRating = winnerRating + kFactor * (1 - winnerExpected);
    const loserNewRating = loserRating + kFactor * (0 - loserExpected);
  
    return { winnerNewRating, loserNewRating };
}
  
function getKFactor(options: KFactorOptions): number {
    const { rating, gamesPlayed } = options;
    
    if (gamesPlayed < 30) {
      if (rating < 2400) {
        return 25;
      } else {
        return 10;
      }
    } else {
      return 10;
    }
}
  