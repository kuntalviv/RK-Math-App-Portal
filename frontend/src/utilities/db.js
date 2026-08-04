import { supabase } from '@/lib/supabase'

//Notifications Service
export async function fetchNotifications() {
    const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('id, title, launch_url, body, scheduled_at, status, is_active, created_at, sent_at, event_id')
        .order('scheduled_at', { ascending: false })


    if (error) {
        alert("Failed to fetch notifications: \n" + error.message);
        return;
    }

    return data;
}


export async function createNotification(notificationData) {
    const { data, error } = await supabase
        .from('scheduled_notifications')
        .insert({
            title: notificationData.title,
            body: notificationData.body,
            scheduled_at: new Date(notificationData.scheduled_at).toISOString(),
            status: "pending",
            is_active: true,
            launch_url: notificationData.launch_url,
            event_id: notificationData.event_id ?? null,
        })
        .select()
        .single()

    if (error) {
        alert("Failed to create notification:\n" + error.message);
        return
    }

    console.log("notification created!");
    return data;

}

export async function updateNotification(notificationData) {
    const { data, error } = await supabase
        .from('scheduled_notifications')
        .update({
            title: notificationData.title,
            body: notificationData.body,
            scheduled_at: new Date(notificationData.scheduled_at).toISOString(),
            is_active: notificationData.is_active,
            launch_url: notificationData.launch_url,
            event_id: notificationData.event_id ?? null,
        })
        .eq('id', notificationData.id)
        .select()
        .single()

    if (error) {
        alert("Failed to create notification:\n" + error.message);
        return
    }

    return data;

}

export async function deleteNotification(id) {

    const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error.message)
        return
    }

    return id;
}

export async function deleteChildNotifications(eventId) {

    const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('event_id', eventId);

    if (error) {
        console.error('Failed to delete notifications:', error);
    } else {
        console.log('Notifications deleted successfully');
    }
}


//General Utilities
export function formatDateTime(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}