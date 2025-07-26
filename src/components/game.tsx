import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { getPlayTimeInHours, type SummaryGameInfo } from "../data/summarizer";
import { MoreVert } from "@mui/icons-material";

export interface GameProps {
  game: SummaryGameInfo;
}

export const Game = (props: GameProps) => {
  const { game } = props;
  return (
    <Card sx={{ height: '100%', width: "180px" }} >
      {game.coverImage && <CardMedia
        sx={{ height: '240px' }}
        image={game.coverImage || ''}
      />
      }
      <CardContent sx={{ padding: "10px", "&:last-child": { paddingBottom: "10px" } }}>
        {!game.coverImage && (
          <Box sx={{ height: '240px' }} justifyContent="center" display="flex" flexDirection="column" textAlign="center">
            <Typography variant="body1" fontSize="24px" fontWeight="bold">
              {game.title}
            </Typography>
          </Box>
        )}
        <Box display="flex">
          <Stack flex="1">
            <Typography variant="body2">
              {game.platformAbbreviation} - {game.releaseYear}
            </Typography>
            {game.playTime && (
              <Typography variant="body2">
                {getPlayTimeInHours(game.playTime, 1) + ((game.playTime || 0) > 1 ? ' hrs' : ' hr')}
              </Typography>
            )}
            {/*TODO: {game.rating} */}
            {/*TODO: {game.completion === 'completed'} */}
          </Stack>
          <IconButton size="small" onClick={() => { alert('hello') }}><MoreVert /></IconButton>
        </Box>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton size="small" sx={{ float: "right" }} onClick={() => { alert('hello') }}><MoreVert /></IconButton>

      </CardActions> */}
    </Card >

  );
}