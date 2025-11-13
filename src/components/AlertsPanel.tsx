"use client";

import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, MapPin, Battery, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AlertsPanel() {
  const { alerts, acknowledgeAlert } = useLocation();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'zone_exit':
        return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'zone_entry':
        return <MapPin className="w-5 h-5 text-green-500" />;
      case 'low_battery':
        return <Battery className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'sos':
        return 'destructive';
      case 'zone_exit':
        return 'default';
      case 'zone_entry':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{unacknowledgedCount}</div>
              <p className="text-sm text-muted-foreground">New Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{acknowledgedCount}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{alerts.length}</div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Center
          </CardTitle>
          <CardDescription>
            Monitor and manage all safety alerts in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No Alerts</p>
              <p className="text-sm text-muted-foreground">
                All quiet! You'll be notified of any safety events here.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 border rounded-lg transition-all ${
                      alert.acknowledged 
                        ? 'bg-muted/30 opacity-60' 
                        : alert.type === 'sos' 
                          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 animate-pulse'
                          : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={getAlertVariant(alert.type)}>
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        {!alert.acknowledged && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="w-full sm:w-auto"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Acknowledge
                          </Button>
                        )}
                        {alert.acknowledged && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
