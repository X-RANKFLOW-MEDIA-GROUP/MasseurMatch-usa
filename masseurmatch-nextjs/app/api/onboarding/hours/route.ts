import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
type DayOfWeek = (typeof DAYS)[number];

const DAY_TO_INDEX: Record<DayOfWeek, number> = DAYS.reduce(
  (acc, day, index) => ({ ...acc, [day]: index }),
  {} as Record<DayOfWeek, number>
);

interface HoursEntry {
  day: DayOfWeek;
  is_available: boolean;
  open_time?: string; // HH:MM format
  close_time?: string; // HH:MM format
}

interface UpdateHoursRequest {
  hours: HoursEntry[];
}

function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function validateHoursEntry(entry: HoursEntry): { valid: boolean; error?: string } {
  if (!entry.day || !DAYS.includes(entry.day)) {
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

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: hours, error: hoursError } = await supabase
      .from('profile_hours')
      .select('*')
      .eq('profile_id', profile.id)
      .order('day_of_week', { ascending: true });

    if (hoursError) {
      return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
    }

    const formattedHours = DAYS.map((day, index) => {
      const dayHours = hours?.find((h) => h.day_of_week === index);
      return {
        day,
        is_available: !(dayHours?.is_closed ?? false),
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: UpdateHoursRequest = await request.json();
    const { hours } = payload;

    if (!hours || !Array.isArray(hours)) {
      return NextResponse.json({ error: 'hours array is required' }, { status: 400 });
    }

    for (const entry of hours) {
      const validation = validateHoursEntry(entry);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const days = hours.map((h) => h.day);
    if (new Set(days).size !== days.length) {
      return NextResponse.json({ error: 'Duplicate days found' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('profile_hours')
      .delete()
      .eq('profile_id', profile.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
    }

    const hoursToInsert = hours.map((entry) => ({
      profile_id: profile.id,
      day_of_week: DAY_TO_INDEX[entry.day],
      is_closed: !entry.is_available,
      open_time: entry.is_available ? entry.open_time ?? null : null,
      close_time: entry.is_available ? entry.close_time ?? null : null,
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
      message: 'Hours updated successfully',
    });
  } catch (error) {
    console.error('Hours update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
