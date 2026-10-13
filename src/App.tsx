import { RouterProvider } from 'react-router';
import { router } from './routes';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext'; // استيراد نظام الدخول
import { PushNotifications } from '@capacitor/push-notifications';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
        // التحقق من صلاحيات الإشعارات وطلبها
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register();
            }
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received: ', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed: ', notification);
        });
    }, []);

    return (
        <AuthProvider>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </AuthProvider>
    );
}
