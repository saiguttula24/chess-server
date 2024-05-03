import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

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

export function verifyToken(req: any, res: Response, next: NextFunction){
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
    if (err) {
      return res.status(403).json({success:false, message: 'Failed to authenticate token' });
    }
    
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({success:false, message: 'Token has expired' });
    }

    req.locals = { decoded };

    next();
  });
}
  