'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Trophy, Users, Zap, Crown } from 'lucide-react';
import { useState } from 'react';

interface HomeScreenProps {
  onJoinLeague: (leagueId: string) => void;
  onCreateLeague: (leagueName: string) => void;
  onStartSinglePlayer: () => void;
  onShowShop: () => void;
  onShowPro: () => void;
  userStats?: {
    totalScore: number;
    gamesPlayed: number;
    bestScore: number;
    isPro: boolean;
  };
}

export function HomeScreen({
  onJoinLeague,
  onCreateLeague,
  onStartSinglePlayer,
  onShowShop,
  onShowPro,
  userStats
}: HomeScreenProps) {
  const [joinInput, setJoinInput] = useState('');
  const [createInput, setCreateInput] = useState('');

  const handleJoinLeague = () => {
    if (joinInput.trim()) {
      onJoinLeague(joinInput.trim());
      setJoinInput('');
    }
  };

  const handleCreateLeague = () => {
    if (createInput.trim()) {
      onCreateLeague(createInput.trim());
      setCreateInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Loop League
          </h1>
          <p className="text-cyan-300 text-lg">Connect. Loop. Dominate.</p>
        </div>

        {/* User Stats */}
        {userStats && (
          <Card className="bg-black/30 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-white">{userStats.totalScore.toLocaleString()}</div>
                  <div className="text-xs text-white/60">TOTAL SCORE</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-300">{userStats.gamesPlayed}</div>
                  <div className="text-xs text-white/60">GAMES</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-300">{userStats.bestScore.toLocaleString()}</div>
                  <div className="text-xs text-white/60">BEST</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Play */}
        <Button
          onClick={onStartSinglePlayer}
          size="lg"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold h-14 text-lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Quick Play
        </Button>

        {/* League Actions */}
        <div className="space-y-4">
          <Card className="bg-black/30 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-cyan-400" />
                Join League
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Enter league code"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyDown={(e) => e.key === 'Enter' && handleJoinLeague()}
              />
              <Button
                onClick={handleJoinLeague}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!joinInput.trim()}
              >
                Join League
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Create League
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="League name"
                value={createInput}
                onChange={(e) => setCreateInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateLeague()}
              />
              <Button
                onClick={handleCreateLeague}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!createInput.trim()}
              >
                Create League
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onShowShop}
            variant="outline"
            className="border-purple-400 text-purple-300 hover:bg-purple-400/20"
          >
            <div className="text-center">
              <div className="text-sm">Themes</div>
              <div className="text-xs opacity-70">Customize</div>
            </div>
          </Button>

          <Button
            onClick={onShowPro}
            variant="outline"
            className="border-yellow-400 text-yellow-300 hover:bg-yellow-400/20"
          >
            <Crown className="w-4 h-4 mr-1" />
            <div className="text-center">
              <div className="text-sm">Pro Pass</div>
              <div className="text-xs opacity-70">
                {userStats?.isPro ? 'Active' : 'Upgrade'}
              </div>
            </div>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-white/40 text-xs">
          Connect colored nodes • Form loops • Beat your friends
        </div>
      </div>
    </div>
  );
}