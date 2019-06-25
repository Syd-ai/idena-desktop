import React from 'react'
import {rem} from 'polished'
import {Absolute, Box} from '../shared/components'
import {useChainState} from '../shared/providers/chain-context'
import theme from '../shared/theme'

function SyncStatus() {
  const {syncing, progress} = useChainState()

  if (!syncing || !progress) {
    return null
  }

  return (
    <Absolute bg={theme.colors.primary} top={0} left={0} right={0}>
      <Box p={rem(theme.spacings.medium24)} css={{textAlign: 'center'}}>
        Syncing...{' '}
        {Number(progress).toLocaleString(undefined, {style: 'percent'})} done
      </Box>
    </Absolute>
  )
}

export default SyncStatus
