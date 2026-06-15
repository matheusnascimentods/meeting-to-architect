import { Box, Text, Button, Label } from '@primer/react';
import { FileCodeIcon, ReplyIcon } from '@primer/octicons-react';
import { tokens } from '@/shared/constants';
import { COPY } from '@/shared/constants';
import { TrashItemProps } from './index.types';

export function TrashItem({ diagram, onRestore, onDelete }: TrashItemProps) {
  return (
    <Box
      sx={{
        ...tokens.card.base,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'default',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{
          width: '36px',
          height: '36px',
          borderRadius: 2,
          bg: 'danger.subtle',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'danger.fg',
        }}>
          <FileCodeIcon size={16} />
        </Box>
        <Box>
          <Text sx={{ fontWeight: 'bold', fontSize: 1, display: 'block', color: 'fg.default' }}>
            {diagram.title}
          </Text>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Label variant="danger" size="small">{diagram.type}</Label>
            <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
              Deleted at {diagram.updated_at ? new Date(diagram.updated_at).toLocaleDateString('en-US') : 'Unknown date'}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <Button
          size="small"
          leadingVisual={ReplyIcon}
          onClick={() => onRestore(diagram.id)}
          sx={{
            backgroundColor: 'success.emphasis',
            color: 'white',
            borderColor: 'success.emphasis',
            '&:hover:not([disabled])': {
              backgroundColor: 'success.emphasis',
              borderColor: 'success.emphasis',
            },
          }}
        >
          Restore
        </Button>
        <Button
          size="small"
          onClick={() => onDelete(diagram)}
          sx={{
            backgroundColor: 'danger.emphasis',
            color: 'white',
            borderColor: 'danger.emphasis',
            '&:hover:not([disabled])': {
              backgroundColor: 'danger.emphasis',
              borderColor: 'danger.emphasis',
            },
          }}
        >
          {COPY.common.delete}
        </Button>
      </Box>
    </Box>
  );
}
