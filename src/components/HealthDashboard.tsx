"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useBand } from '@/contexts/BandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, TrendingUp, Battery, Thermometer, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HealthDashboard() {
  const { user } = useAuth();
  const { bandData } = useBand();

  // Mock health data for children
  const mockChildrenHealth = user?.pairedWith?.map((childId, index) => ({
    id: childId,
    name: `Child ${index + 1}`,
    heartRate: 70 + Math.floor(Math.random() * 30),
    steps: 3000 + Math.floor(Math.random() * 5000),
    battery: 60 + Math.floor(Math.random() * 40),
    temperature: 36.5 + Math.random() * 0.8,
    connected: true
  })) || [];

  // Mock chart data
  const heartRateData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 8}:00`,
    heartRate: 65 + Math.floor(Math.random() * 25)
  }));

  const stepsData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    steps: 2000 + Math.floor(Math.random() * 6000)
  }));

  return (
    <div className="space-y-6">
      {mockChildrenHealth.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No Health Data Available</p>
              <p className="text-sm text-muted-foreground">
                Pair with your children to view their health metrics
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Health Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            {mockChildrenHealth.map((child, index) => (
              <Card key={child.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    {child.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      Heart
                    </span>
                    <span className="font-medium">{child.heartRate} bpm</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Steps
                    </span>
                    <span className="font-medium">{child.steps.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Battery className="w-4 h-4" />
                      Battery
                    </span>
                    <span className="font-medium">{Math.round(child.battery)}%</span>
                  </div>
                  <Badge variant={child.connected ? "default" : "secondary"} className="w-full justify-center">
                    {child.connected ? '✓ Connected' : 'Offline'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Health Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Heart Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Heart Rate Trends
                </CardTitle>
                <CardDescription>
                  Average heart rate over the last 12 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Steps Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Daily Steps
                </CardTitle>
                <CardDescription>
                  Step count for the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stepsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Individual Child Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockChildrenHealth.map((child, index) => (
              <Card key={child.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {child.name} - Detailed Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Heart Rate</p>
                          <p className="text-xs text-muted-foreground">Current rate</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{child.heartRate}</p>
                        <p className="text-xs text-muted-foreground">bpm</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Steps Today</p>
                          <p className="text-xs text-muted-foreground">Daily goal: 8,000</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{child.steps.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{Math.round((child.steps / 8000) * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Thermometer className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Temperature</p>
                          <p className="text-xs text-muted-foreground">Body temperature</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{child.temperature.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">°C</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Battery className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Band Battery</p>
                          <p className="text-xs text-muted-foreground">Remaining charge</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{Math.round(child.battery)}</p>
                        <p className="text-xs text-muted-foreground">%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
