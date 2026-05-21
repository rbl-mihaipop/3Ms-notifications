import { Box, Typography } from '@mui/material';

interface Props {
  name: string;
}

export const PlaceholderPage = ({ name }: Props) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 64px)',
    }}
  >
    <Typography variant="h5" color="text.secondary">
      {name} — coming soon
    </Typography>
  </Box>
);
