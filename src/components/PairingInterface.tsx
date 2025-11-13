"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, Users, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PairingInterface() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const pairingCode = user?.pairingCode || '000000';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 6-Digit Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              6-Digit Pairing Code
            </CardTitle>
            <CardDescription>
              Share this code with your child to pair their account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-center">
              <p className="text-white text-sm mb-2">Your Pairing Code</p>
              <div className="text-6xl font-bold text-white tracking-widest mb-4">
                {pairingCode}
              </div>
              <Button 
                variant="secondary" 
                onClick={handleCopyCode}
                className="w-full"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">How to pair:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Share this 6-digit code with your child</li>
                <li>Child opens their Kidsafe Band app</li>
                <li>Child enters the code in their pairing section</li>
                <li>Connection established!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Pairing
            </CardTitle>
            <CardDescription>
              Scan this QR code for quick pairing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {showQR ? (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <QRCodeSVG 
                    value={pairingCode}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              ) : (
                <div className="w-[200px] h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
              <Button 
                onClick={() => setShowQR(!showQR)}
                variant={showQR ? "outline" : "default"}
                className="w-full"
              >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Quick pairing:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Show this QR code to your child</li>
                <li>Child scans it with their camera</li>
                <li>Instantly paired!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paired Children */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Paired Children
          </CardTitle>
          <CardDescription>
            Children currently connected to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.pairedWith && user.pairedWith.length > 0 ? (
            <div className="space-y-3">
              {user.pairedWith.map((childId, index) => (
                <div 
                  key={childId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">Child {index + 1}</p>
                      <p className="text-sm text-muted-foreground">ID: {childId.slice(0, 8)}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No Children Paired</p>
              <p className="text-sm text-muted-foreground">
                Share your pairing code to connect with your child
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
