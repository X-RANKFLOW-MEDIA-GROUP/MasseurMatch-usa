import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface HoursEntry {
  day: DayOfWeek;
  is_available: boolean;
  open_time?: string; // HH:MM format
  close_time?: string; // HH:MM format
}

interface UpdateHoursRequest {
  hours: HoursEntry[];
}

const VALID_DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function validateHoursEntry(entry: HoursEntry): { valid: boolean; error?: string } {
  if (!entry.day || !VALID_DAYS.includes(entry.day)) {
    return { valid: false, error: `Invalid day: ${entry.day}` };
  }

  if (typeof entry.is_available !== 'boolean') {
    return { valid: false, error: 'is_available must be a boolean' };
  }

  if (entry.is_available) {
    if (!entry.open_time || !entry.close_time) {
      return { valid: false, error: `${entry.day}: open_time and close_time required when available` };
    }

    if (!validateTimeFormat(entry.open_time)) {
      return { valid: false, error: `${entry.day}: Invalid open_time format (use HH:MM)` };
    }

    if (!validateTimeFormat(entry.close_time)) {
      return { valid: false, error: `${entry.day}: Invalid close_time format (use HH:MM)` };
    }

    // Check that close_time is after open_time
    if (entry.open_time >= entry.close_time) {
      return { valid: false, error: `${entry.day}: close_time must be after open_time` };
    }
  }

  return { valid: true };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get hours
    const { data: hours, error: hoursError } = await supabase
      .from('profile_hours')
      .select('*')
      .eq('profile_id', profile.id)
      .order('day_of_week', { ascending: true });

    if (hoursError) {
      return NextResponse.json(
        { error: 'Failed to fetch hours' },
        { status: 500 }
      );
    }

    // Format response
    const formattedHours = VALID_DAYS.map(day => {
      const dayHours = hours?.find(h => h.day_of_week === day);
      return {
        day,
        is_available: dayHours?.is_available || false,
        open_time: dayHours?.open_time || null,
        close_time: dayHours?.close_time || null,
      };
    });

    return NextResponse.json({
      success: true,
      hours: formattedHours,
    });

  } catch (error) {
    console.error('Hours fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: UpdateHoursRequest = await request.json();
    const { hours } = body;

    if (!hours || !Array.isArray(hours)) {
      return NextResponse.json(
        { error: 'hours array is required' },
        { status: 400 }
      );
    }

    // Validate all entries
    for (const entry of hours) {
      const validation = validateHoursEntry(entry);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Check for duplicate days
    const days = hours.map(h => h.day);
    const uniqueDays = new Set(days);
    if (days.length !== uniqueDays.size) {
      return NextResponse.json(
        { error: 'Duplicate days found' },
        { status: 400 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Delete existing hours for this profile
    const { error: deleteError } = await supabase
      .from('profile_hours')
      .delete()
      .eq('profile_id', profile.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to update hours' },
        { status: 500 }
      );
    }

    // Insert new hours
    const hoursToInsert = hours.map(entry => ({
      profile_id: profile.id,
      day_of_week: entry.day,
      is_available: entry.is_available,
      open_time: entry.is_available ? entry.open_time : null,
      close_time: entry.is_available ? entry.close_time : null,
    }));

    const { data: insertedHours, error: insertError } = await supabase
      .from('profile_hours')
      .insert(hoursToInsert)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create hours', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hours: insertedHours,
      message: 'Hours updated successfully'
    });

  } catch (error) {
    console.error('Hours update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
