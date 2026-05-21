import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import mockReports from '@shared/mocks/reports.json';
import mockUsers from '@shared/mocks/users.json';
import { useAppDispatch } from '../../app/hooks';
import { addNotification, addToast, updateNotification } from '../../state/slices/notificationsSlice';

interface Props {
  reportId: string | null;
  onClose: () => void;
}

export const ReportDetailModal = ({ reportId, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const timeoutIds = useRef<number[]>([]);

  const report = mockReports.find((r) => r.id === reportId);
  const user = report ? mockUsers.find((u) => u.id === report.generatedByUserId) : null;

  useEffect(() => () => {
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, []);

  if (!report) return null;

  const handleDownload = () => {
    const notificationId = `ntf-report-progress-${Date.now()}`;
    const initialDescription = `${report.title} is being generated.`;

    dispatch(addNotification({
      id: notificationId,
      type: 'report',
      category: 'new_reports',
      subtype: 'report_generation',
      statusBadge: 'new',
      title: 'Report generation started',
      description: initialDescription,
      entityName: report.title,
      entityId: report.id.toUpperCase(),
      relatedEntityId: report.id,
      relatedEntityName: report.title,
      createdAt: new Date().toISOString(),
      status: 'unread',
      priority: 'medium',
      ctaLabel: 'View report status',
    }));

    dispatch(addToast({
      id: `toast-report-start-${Date.now()}`,
      title: 'Report generation started',
      message: initialDescription,
      severity: 'info',
    }));

    timeoutIds.current.push(window.setTimeout(() => {
      const progressDescription = `${report.title} generation is in progress.`;
      dispatch(updateNotification({
        id: notificationId,
        changes: {
          title: 'Report generation in progress',
          description: progressDescription,
          statusBadge: 'in_progress',
        },
      }));

      dispatch(addToast({
        id: `toast-report-progress-${Date.now()}`,
        title: 'Report generation in progress',
        message: progressDescription,
        severity: 'info',
      }));
    }, 2000));

    timeoutIds.current.push(window.setTimeout(() => {
      const readyDescription = `${report.title} is ready to download.`;
      dispatch(updateNotification({
        id: notificationId,
        changes: {
          title: 'Report ready',
          description: readyDescription,
          subtype: 'report_ready',
          statusBadge: 'resolved',
          priority: 'high',
          ctaLabel: 'Download report',
        },
      }));

      dispatch(addToast({
        id: `toast-report-ready-${Date.now()}`,
        title: 'Report ready',
        message: readyDescription,
        severity: 'success',
      }));
    }, 4500));
  };

  return (
    <>
      <Dialog open={!!reportId} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          <Typography fontWeight={600} fontSize={16}>
            {report.title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
            <Chip
              label={report.format}
              size="small"
              sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 600, fontSize: 12 }}
            />
            <Chip
              label={report.scope}
              size="small"
              variant="outlined"
              sx={{ textTransform: 'capitalize', fontSize: 12 }}
            />
            <Chip
              label={report.status}
              size="small"
              sx={{ bgcolor: '#D1FAE5', color: '#065F46', textTransform: 'capitalize', fontSize: 12 }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={500}>
                GENERATED
              </Typography>
              <Typography variant="body2" mt={0.25}>
                {new Date(report.generatedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </Typography>
            </Box>

            {user && (
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={500}>
                  GENERATED BY
                </Typography>
                <Typography variant="body2" mt={0.25}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            )}

            {report.relatedBuildingIds.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={500}>
                  COVERS
                </Typography>
                <Typography variant="body2" mt={0.25}>
                  {report.relatedBuildingIds.join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" size="small">
            Close
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              bgcolor: '#0F6E56',
              '&:hover': { bgcolor: '#0a5442' },
              textTransform: 'none',
            }}
          >
            Download {report.format}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
