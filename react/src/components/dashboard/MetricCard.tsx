import { Card, CardContent, Typography } from '@mui/material';

export type MetricCardEntry = {
  label: string;
  value: string | number;
};

export type MetricCardProps = {
  title: string;
  value: string;
  valueColor?: string;
  entries?: MetricCardEntry[];
};

/**
 * A small dashboard card showing a headline metric (e.g., current accuracy)
 * and a list of related properties (e.g., hyperparameter values).
 */
export const MetricCard = ({
  title,
  value,
  valueColor,
  entries = [],
}: MetricCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h3"
          sx={{ color: valueColor, fontWeight: 'bold', mb: 1 }}
        >
          {value}
        </Typography>
        {entries.map(entry => (
          <Typography
            key={entry.label}
            variant="body1"
            sx={{ fontSize: '1.15rem' }}
          >
            {entry.label}: {entry.value}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
