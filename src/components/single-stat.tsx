import { Typography, Box } from "@mui/material"

export interface SingleStatProps {
  value: string | number;
  label: string;
  color?: string;
}

export const SingleStat = (props: SingleStatProps) => {
  const { value, label, color } = props;
  return (
    <div className="single-stat">
      <Box style={{ backgroundColor: color, padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
        <div><Typography fontSize={20}>{value}</Typography></div>
        <div><Typography>{label}</Typography></div>
      </Box>
    </div>
  )
}