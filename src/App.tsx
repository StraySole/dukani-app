import { RouterProvider } from 'react-router';
import { router } from './routes';
import { StoreProvider } from './context/StoreContext';
import { PushNotifications } from '@capacitor/push-notifications';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
        // التحقق من صلاحيات الإشعارات وطلبها
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                // تسجيل التطبيق لدى خدمة الإشعارات
                PushNotifications.register();
            }
        });

        // الاستماع للإشعارات الواردة عندما يكون التطبيق مفتوحاً
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push notification received: ', notification);
        });

        // الاستماع عند ضغط المستخدم على الإشعار
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed: ', notification);
        });
    }, []);

    return (
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    );
}
