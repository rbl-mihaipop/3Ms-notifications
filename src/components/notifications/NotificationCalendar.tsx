import { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND_PURPLE, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR } from '../../theme/theme';

interface Props {
  countsByDate: Record<string, number>;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatMonthLabel = (d: Date) =>
  d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

const pad2 = (n: number) => String(n).padStart(2, '0');
const dateKey = (year: number, month: number, day: number) =>
  `${year}-${pad2(month + 1)}-${pad2(day)}`;

// Monday-first day-of-week index (Mon=0 .. Sun=6)
const mondayIndex = (jsDay: number) => (jsDay + 6) % 7;

export const NotificationCalendar = ({ countsByDate, selectedDate, onSelectDate }: Props) => {
  const today = useMemo(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth(), day: t.getDate() };
  }, []);

  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>(() => ({
    year: today.year,
    month: today.month,
  }));

  const firstOfMonth = new Date(viewMonth.year, viewMonth.month, 1);
  const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(firstOfMonth.getDay());

  // Build 6×7 grid (42 cells)
  const cells: Array<{ day: number | null; key: string | null; count: number }> = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null, key: null, count: 0 });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(viewMonth.year, viewMonth.month, d);
    cells.push({ day: d, key, count: countsByDate[key] ?? 0 });
  }
  while (cells.length < 42) cells.push({ day: null, key: null, count: 0 });

  const goPrev = () =>
    setViewMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  const goNext = () =>
    setViewMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  const goToday = () => setViewMonth({ year: today.year, month: today.month });

  const handleCellClick = (cell: (typeof cells)[number]) => {
    if (!cell.key || cell.count === 0) return;
    onSelectDate(cell.key === selectedDate ? null : cell.key);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          size="small"
          data-testid="calendar-prev-month"
          onClick={goPrev}
          sx={{ color: TEXT_SECONDARY }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography
          data-testid="calendar-month-label"
          sx={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}
        >
          {formatMonthLabel(firstOfMonth)}
        </Typography>
        <IconButton
          size="small"
          data-testid="calendar-next-month"
          onClick={goNext}
          sx={{ color: TEXT_SECONDARY }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
        <Button
          size="small"
          data-testid="calendar-today"
          onClick={goToday}
          sx={{ fontSize: 12, fontWeight: 600, color: BRAND_PURPLE, px: 1, minWidth: 0 }}
        >
          Today
        </Button>
      </Box>

      {/* Day-of-week row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {DAY_LABELS.map((label) => (
          <Typography
            key={label}
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              textAlign: 'center',
              py: 0.5,
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Day grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {cells.map((cell, idx) => {
          if (cell.day === null) {
            return <Box key={`blank-${idx}`} sx={{ height: 36 }} />;
          }
          const isToday =
            viewMonth.year === today.year &&
            viewMonth.month === today.month &&
            cell.day === today.day;
          const isSelected = cell.key !== null && cell.key === selectedDate;
          const hasItems = cell.count > 0;

          return (
            <Box
              key={cell.key!}
              data-testid={`calendar-day-${cell.key}`}
              data-day-count={cell.count}
              data-selected={isSelected ? 'true' : 'false'}
              onClick={() => handleCellClick(cell)}
              sx={{
                height: 36,
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: hasItems ? 'pointer' : 'default',
                userSelect: 'none',
                bgcolor: isSelected ? BRAND_PURPLE : 'transparent',
                color: isSelected
                  ? '#fff'
                  : hasItems
                    ? TEXT_PRIMARY
                    : 'rgba(65, 52, 65, 0.40)',
                outline: isToday && !isSelected ? `1.5px solid ${BRAND_PURPLE}` : 'none',
                outlineOffset: '-1.5px',
                transition: 'background-color 0.12s ease',
                '&:hover': hasItems && !isSelected ? { bgcolor: 'rgba(128,51,128,0.08)' } : {},
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: isSelected || isToday ? 600 : 400, lineHeight: 1 }}>
                {cell.day}
              </Typography>
              {hasItems && (
                <Typography
                  data-testid={`calendar-day-${cell.key}-badge`}
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: 1,
                    mt: 0.25,
                    color: isSelected ? '#fff' : BRAND_PURPLE,
                  }}
                >
                  {cell.count}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: `1px solid ${BORDER_COLOR}` }}>
        <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: BRAND_PURPLE }} />
        <Typography sx={{ fontSize: 11, color: TEXT_SECONDARY }}>
          Days with notifications
        </Typography>
      </Box>
    </Box>
  );
};
