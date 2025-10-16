'use client';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ArrowLeft, Check, Coins } from 'lucide-react';
import { GameTheme } from '~/types/game';
import { GAME_THEMES } from '~/lib/game-logic';

interface ShopScreenProps {
  onGoBack: () => void;
  onPurchaseTheme: (themeId: string) => void;
  onSelectTheme: (themeId: string) => void;
  currentTheme: string;
  ownedThemes: string[];
  ivnkBalance: number;
}

function ThemePreview({ theme }: { theme: GameTheme & { colors: Record<string, string> } }) {
  return (
    <div className={`p-4 rounded-lg bg-gradient-to-br ${theme.background} border-2 border-transparent`}>
      <div className="grid grid-cols-5 gap-1 mb-3">
        {Object.entries(theme.colors).map(([color, hex]) => (
          <div
            key={color}
            className="w-6 h-6 rounded-full border border-white/30"
            style={{ backgroundColor: hex, boxShadow: `0 0 10px ${hex}40` }}
          />
        ))}
      </div>
      <div className="text-center">
        <div className="text-white font-semibold text-sm">{theme.name}</div>
        {theme.price && (
          <div className="flex items-center justify-center text-yellow-300 text-xs mt-1">
            <Coins className="w-3 h-3 mr-1" />
            {theme.price} IVNK
          </div>
        )}
        {!theme.price && (
          <div className="text-green-400 text-xs mt-1">Free</div>
        )}
      </div>
    </div>
  );
}

export function ShopScreen({
  onGoBack,
  onPurchaseTheme,
  onSelectTheme,
  currentTheme,
  ownedThemes,
  ivnkBalance
}: ShopScreenProps) {
  const themes = Object.values(GAME_THEMES) as (GameTheme & { colors: Record<string, string> })[];

  const getThemeStatus = (theme: GameTheme & { colors: Record<string, string> }) => {
    if (currentTheme === theme.id) return 'active';
    if (ownedThemes.includes(theme.id)) return 'owned';
    if (!theme.price) return 'free';
    return 'locked';
  };

  const getButtonText = (theme: GameTheme & { colors: Record<string, string> }) => {
    const status = getThemeStatus(theme);
    switch (status) {
      case 'active': return 'Active';
      case 'owned': return 'Select';
      case 'free': return 'Select';
      case 'locked': return `Buy ${theme.price} IVNK`;
    }
  };

  const getButtonAction = (theme: GameTheme & { colors: Record<string, string> }) => {
    const status = getThemeStatus(theme);
    if (status === 'active') return undefined;
    if (status === 'owned' || status === 'free') return () => onSelectTheme(theme.id);
    return () => onPurchaseTheme(theme.id);
  };

  const canAfford = (theme: GameTheme & { colors: Record<string, string> }) => {
    if (!theme.price) return true;
    return ivnkBalance >= theme.price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onGoBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Theme Shop</h1>
          <div></div> {/* Spacer */}
        </div>

        {/* IVNK Balance */}
        <Card className="bg-black/30 border-yellow-400/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-300">
                {ivnkBalance.toLocaleString()}
              </span>
              <span className="text-yellow-400">IVNK</span>
            </div>
            <div className="text-white/60 text-xs mt-1">Your Token Balance</div>
          </CardContent>
        </Card>

        {/* Themes Grid */}
        <div className="space-y-4">
          <h2 className="text-white text-lg font-semibold">Available Themes</h2>

          {themes.map((theme) => {
            const status = getThemeStatus(theme);
            const action = getButtonAction(theme);
            const affordable = canAfford(theme);

            return (
              <Card key={theme.id} className="bg-black/30 border-white/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1">
                      <ThemePreview theme={theme} />
                    </div>
                    <div className="w-24 flex flex-col justify-center items-center p-4 space-y-2">
                      {status === 'active' && (
                        <div className="flex items-center text-green-400 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </div>
                      )}
                      {action && (
                        <Button
                          onClick={action}
                          size="sm"
                          className={`text-xs px-2 py-1 h-auto whitespace-nowrap ${
                            status === 'locked'
                              ? affordable
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                              : 'bg-cyan-600 hover:bg-cyan-700'
                          }`}
                          disabled={status === 'locked' && !affordable}
                        >
                          {getButtonText(theme)}
                        </Button>
                      )}
                      {status === 'locked' && !affordable && (
                        <div className="text-red-400 text-xs text-center">
                          Need {theme.price! - ivnkBalance} more
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Earn IVNK */}
        <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center">
              <Coins className="w-4 h-4 mr-2 text-yellow-400" />
              How to Earn IVNK
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 text-sm space-y-2">
            <div>• Win league competitions</div>
            <div>• Complete daily challenges</div>
            <div>• Achieve high scores</div>
            <div>• Invite friends to play</div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/40 text-xs">
          Themes change the visual style but don&apos;t affect gameplay
        </div>
      </div>
    </div>
  );
}