import React from 'react'
import PropTypes from 'prop-types'
import {Draggable, DragDropContext, Droppable} from 'react-beautiful-dnd'
import {FiRefreshCw, FiMove} from 'react-icons/fi'
import {rem, position, backgrounds, padding, borderRadius} from 'polished'
import {useTranslation} from 'react-i18next'
import Flex from '../../../shared/components/flex'
import {Box, Absolute} from '../../../shared/components'
import {shuffle} from '../../../shared/utils/arr'
import theme from '../../../shared/theme'
import {IconButton} from '../../../shared/components/button'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function FlipShuffle({pics, order, onShuffleFlip}) {
  function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const nextOrder = reorder(
      order,
      result.source.index,
      result.destination.index
    )

    onShuffleFlip(nextOrder)
  }

  return (
    <Flex justify="center">
      <Flex direction="column" justify="center" align="center">
        {pics.map((src, k) => {
          let style = {...position('relative'), opacity: 0.5}

          if (k === 0) {
            style = {...style, ...borderRadius('top', rem(8))}
          }
          if (k === order.length - 1) {
            style = {...style, ...borderRadius('bottom', rem(8))}
          }

          return (
            <Box key={k}>
              <Image key={src} src={src} style={style} />
            </Box>
          )
        })}
      </Flex>
      <Box w="2em">&nbsp;</Box>
      <Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="flip">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {order.map((idx, k) => {
                  let style = {...position('relative')}

                  if (k === 0) {
                    style = {...style, ...borderRadius('top', rem(8))}
                  }
                  if (k === order.length - 1) {
                    style = {...style, ...borderRadius('bottom', rem(8))}
                  }

                  return (
                    <Draggable key={idx} draggableId={`pic${idx}`} index={k}>
                      {/* eslint-disable-next-line no-shadow */}
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Image key={idx} src={pics[idx]} style={style}>
                            <Movable />
                          </Image>
                        </div>
                      )}
                    </Draggable>
                  )
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <Box>
        <Box css={{position: 'absolute', top: '50%', margin: '10px'}}>
          <ShuffleButton
            css={{margin: 0}}
            onClick={() => {
              const nextOrder = [...shuffle(order)]
              onShuffleFlip(nextOrder)
            }}
          />
        </Box>
      </Box>
    </Flex>
  )
}

FlipShuffle.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.string),
  order: PropTypes.arrayOf(PropTypes.number),
  onShuffleFlip: PropTypes.func.isRequired,
  onUpdateNonSensePic: PropTypes.func.isRequired,
}

// eslint-disable-next-line react/prop-types
function Image({src, style, children}) {
  return (
    <Box style={style}>
      <img alt="flip" width={120} src={src} />
      {children}
    </Box>
  )
}

function ShuffleButton(props) {
  const {t} = useTranslation()
  return (
    <IconButton icon={<FiRefreshCw />} {...props}>
      {t('Shuffle')}
    </IconButton>
  )
}

function Movable(props) {
  return (
    <Absolute
      top={rem(4)}
      right={rem(4)}
      css={{
        ...backgrounds(theme.colors.primary2),
        ...padding(rem(theme.spacings.small8)),
        ...borderRadius('top', rem(6)),
        ...borderRadius('bottom', rem(6)),
        opacity: 0.8,
      }}
      {...props}
    >
      <FiMove color={theme.colors.white} />
    </Absolute>
  )
}

export default FlipShuffle
