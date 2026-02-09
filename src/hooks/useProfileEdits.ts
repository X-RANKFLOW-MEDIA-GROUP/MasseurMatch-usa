// src/hooks/useProfileEdits.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export type EditStatus = 'pending' | 'approved' | 'rejected';

export interface ProfileEdit {
  id: string;
  therapist_id: string;
  edited_data: any;
  pending_profile_photo?: string;
  pending_gallery?: string[];
  original_data: any;
  original_profile_photo?: string;
  original_gallery?: string[];
  status: EditStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface EditNotification {
  id: string;
  therapist_id: string;
  edit_id?: string;
  type: 'pending' | 'approved' | 'rejected';
  message: string;
  read: boolean;
  created_at: string;
}

export function useProfileEdits(therapistId?: string) {
  const [pendingEdits, setPendingEdits] = useState<ProfileEdit[]>([]);
  const [notifications, setNotifications] = useState<EditNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!therapistId) return;

    loadPendingEdits();
    loadNotifications();

    // Subscribe to changes
    const editsSubscription = supabase
      .channel('profile-edits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_edits',
          filter: `therapist_id=eq.${therapistId}`
        },
        () => {
          loadPendingEdits();
        }
      )
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'edit_notifications',
          filter: `therapist_id=eq.${therapistId}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      editsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, [therapistId]);

  async function loadPendingEdits() {
    if (!therapistId) return;

    try {
      const { data, error } = await supabase
        .from('profile_edits')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingEdits(data || []);
    } catch (error) {
      console.error('Error loading pending edits:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadNotifications() {
    if (!therapistId) return;

    try {
      const { data, error } = await supabase
        .from('edit_notifications')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  async function submitEdit(
    editedData: any,
    originalData: any,
    pendingPhotos?: { profile?: string; gallery?: string[] }
  ) {
    if (!therapistId) throw new Error('Therapist ID is required');

    const payload = {
      therapist_id: therapistId,
      edited_data: editedData,
      original_data: originalData,
      pending_profile_photo: pendingPhotos?.profile || null,
      pending_gallery: pendingPhotos?.gallery || null,
      original_profile_photo: originalData.profilePhoto || null,
      original_gallery: originalData.gallery || null,
      status: 'pending' as EditStatus,
      submitted_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profile_edits')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await supabase.from('edit_notifications').insert({
      therapist_id: therapistId,
      edit_id: data.id,
      type: 'pending',
      message: 'Your edits were submitted for approval.'
    });

    return data;
  }

  async function markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('edit_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    loadNotifications();
  }

  return {
    pendingEdits,
    notifications,
    loading,
    submitEdit,
    markNotificationAsRead,
    refresh: loadPendingEdits
  };
}

export function useAdminEdits() {
  const [allEdits, setAllEdits] = useState<ProfileEdit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllEdits();

    const subscription = supabase
      .channel('admin-edits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_edits'
        },
        () => {
          loadAllEdits();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadAllEdits() {
    try {
      const { data, error } = await supabase
        .from('profile_edits')
        .select(`
          *,
          therapist:therapists!profile_edits_therapist_id_fkey (
            full_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setAllEdits(data || []);
    } catch (error) {
      console.error('Error loading all edits:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveEdit(editId: string, adminId: string) {
    const { data: edit, error: fetchError } = await supabase
      .from('profile_edits')
      .select('*')
      .eq('id', editId)
      .single();

    if (fetchError) throw fetchError;

    // Apply changes to therapist profile
    const updateData: any = { ...edit.edited_data };

    if (edit.pending_profile_photo) {
      updateData.profile_photo = edit.pending_profile_photo;
    }

    if (edit.pending_gallery) {
      updateData.gallery = edit.pending_gallery;
    }

    const { error: updateError } = await supabase
      .from('therapists')
      .update(updateData)
      .eq('id', edit.therapist_id);

    if (updateError) throw updateError;

    // Update edit status
    const { error: statusError } = await supabase
      .from('profile_edits')
      .update({
        status: 'approved',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', editId);

    if (statusError) throw statusError;

    // Create notification
    await supabase.from('edit_notifications').insert({
      therapist_id: edit.therapist_id,
      edit_id: editId,
      type: 'approved',
      message: 'Your edits were approved and published on your profile.'
    });

    loadAllEdits();
  }

  async function rejectEdit(editId: string, adminId: string, reason: string) {
    const { data: edit, error: fetchError } = await supabase
      .from('profile_edits')
      .select('therapist_id')
      .eq('id', editId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('profile_edits')
      .update({
        status: 'rejected',
        admin_notes: reason,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', editId);

    if (error) throw error;

    // Create notification
    await supabase.from('edit_notifications').insert({
      therapist_id: edit.therapist_id,
      edit_id: editId,
      type: 'rejected',
      message: `Your edits were rejected. Reason: ${reason}`
    });

    loadAllEdits();
  }

  return {
    allEdits,
    loading,
    approveEdit,
    rejectEdit,
    refresh: loadAllEdits
  };
}
