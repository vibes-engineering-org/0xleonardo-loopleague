'use client';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Trophy, Share2, RotateCcw, Home, Medal, Crown } from 'lucide-react';
import { League, LeaguePlayer } from '~/types/game';

interface EndGameScreenProps {
  score: number;
  isNewBest?: boolean;
  league?: League;
  playerRank?: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onShare: () => void;
  theme?: string;
}

function LeaderboardItem({
  player,
  rank,
  isCurrentPlayer = false
}: {
  player: LeaguePlayer;
  rank: number;
  isCurrentPlayer?: boolean
}) {
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-yellow-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-white/60 font-bold">{rank}</div>;
    }
  };

  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg
      ${isCurrentPlayer ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-black/20'}
    `}>
      <div className="flex items-center space-x-3">
        {getRankIcon()}
        <div>
          <div className={`font-semibold ${isCurrentPlayer ? 'text-cyan-300' : 'text-white'}`}>
            {player.username}
            {isCurrentPlayer && <span className="ml-2 text-xs text-cyan-400">(You)</span>}
          </div>
          <div className="text-xs text-white/60">
            {new Date(player.completedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className={`font-bold ${isCurrentPlayer ? 'text-cyan-300' : 'text-white'}`}>
        {player.score.toLocaleString()}
      </div>
    </div>
  );
}

export function EndGameScreen({
  score,
  isNewBest,
  league,
  playerRank,
  onPlayAgain,
  onGoHome,
  onShare,
  theme = 'neon'
}: EndGameScreenProps) {
  const sortedPlayers = league?.players?.sort((a, b) => b.score - a.score) || [];
  const currentPlayerId = 'current-player'; // This would come from user context

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold text-white">Game Complete!</h1>
          <div className="text-4xl font-bold text-cyan-300">{score.toLocaleString()}</div>
          {isNewBest && (
            <div className="text-yellow-300 text-sm font-semibold animate-pulse">
              ⭐ NEW PERSONAL BEST! ⭐
            </div>
          )}
        </div>

        {/* League Results */}
        {league && (
          <Card className="bg-black/30 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                {league.name} Leaderboard
              </CardTitle>
              {playerRank && (
                <div className="text-cyan-300 text-sm">
                  You ranked #{playerRank} out of {sortedPlayers.length} players
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {sortedPlayers.map((player, index) => (
                <LeaderboardItem
                  key={player.id}
                  player={player}
                  rank={index + 1}
                  isCurrentPlayer={player.id === currentPlayerId}
                />
              ))}
              {sortedPlayers.length === 0 && (
                <div className="text-center text-white/60 py-4">
                  No other players yet. Share your league to compete!
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Stats */}
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{score.toLocaleString()}</div>
                <div className="text-xs text-white/60">FINAL SCORE</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {league ? `#${playerRank || '?'}` : 'SOLO'}
                </div>
                <div className="text-xs text-white/60">RANK</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onShare}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Result
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onPlayAgain}
              variant="outline"
              className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>

            <Button
              onClick={onGoHome}
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Upgrade Prompt */}
        {!league && (
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50">
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-white font-semibold mb-1">Join a League!</div>
              <div className="text-white/80 text-sm mb-3">
                Compete with friends and climb the leaderboards
              </div>
              <Button
                onClick={onGoHome}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Find League
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-white/40 text-xs">
          Keep playing to improve your score and climb the ranks!
        </div>
      </div>
    </div>
  );
}