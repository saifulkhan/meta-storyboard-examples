import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

export interface ScrollStoryEvent {
  /** formatted date shown as the card heading */
  date?: string;
  /** narration text shown in the card body */
  description?: string;
}

export interface ScrollEventCardsProps {
  events: ScrollStoryEvent[];
  /**
   * called with the index of the in-focus event once scrolling settles;
   * -1 while the intro card is in focus
   */
  onEventChange: (index: number) => void;
  height?: number;
  /** delay in ms after scrolling stops before the event change fires */
  debounceMs?: number;
}

/**
 * A horizontally scrollable strip of event cards with scroll snapping,
 * ported from the scrolling svg of the original Observable scrollable
 * storyboard. Scrolling progresses the story: once scrolling settles, the
 * index of the centred card is reported through onEventChange, e.g., to a
 * meta-storyboard ScrollStoryController.
 */
export const ScrollEventCards = ({
  events,
  onEventChange,
  height = 120,
  debounceMs = 500,
}: ScrollEventCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheelRef = useRef<number>(0);
  // index of the centred card; card 1 (the intro card) is centred initially
  const [focusedCard, setFocusedCard] = useState<number>(1);

  // blank cards on either end let the first and last events reach the centre
  const cards: ScrollStoryEvent[] = [
    {},
    { description: 'Scroll right to begin the story.' },
    ...events,
    {},
  ];

  // smooth-scroll the strip forward or backward by one card
  const step = (direction: number) => {
    const container = containerRef.current;
    if (!container) return;
    const sectionWidth = container.clientWidth / 3;
    const maxIndex = Math.round(
      (container.scrollWidth - container.clientWidth) / sectionWidth
    );
    const index = Math.round(container.scrollLeft / sectionWidth) + direction;
    container.scrollTo({
      left: Math.max(0, Math.min(maxIndex, index)) * sectionWidth,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    // only progress the story once scrolling has settled
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // each card occupies a third of the container width
      const sectionWidth = container.clientWidth / 3;
      const index = Math.round(container.scrollLeft / sectionWidth);

      setFocusedCard(index + 1);
      onEventChange(index - 1);
    }, debounceMs);
  };

  // a mouse wheel only scrolls vertically, which leaves mouse users unable
  // to move the horizontal strip: translate vertical wheel movement into
  // stepping one card, while trackpads keep their native horizontal
  // scrolling. react registers onWheel as passive, so preventDefault only
  // works from a native non-passive listener.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      // one step per wheel gesture; a single spin fires many wheel events
      const now = Date.now();
      if (now - lastWheelRef.current < 400) return;
      lastWheelRef.current = now;
      step(event.deltaY > 0 ? 1 : -1);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
    // step only reads refs, so the first render's closure stays valid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rewind the strip when a new list of events is shown
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    setFocusedCard(1);
  }, [events]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      tabIndex={0}
      role="region"
      aria-label="story event cards"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      sx={{
        height,
        position: 'relative',
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
      }}
    >
      {cards.map((card, i) => (
        // each snap section is exactly a third of the strip so that the
        // snap positions match the scroll maths and the three visible
        // cards stay flush with the plots above
        <Box
          key={i}
          sx={{
            display: 'inline-flex',
            alignItems: 'flex-end',
            verticalAlign: 'bottom',
            width: 'calc(100% / 3)',
            height: '100%',
            scrollSnapAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '90%',
              mx: 0.5,
              p: 1,
              borderRadius: 1,
              bgcolor: 'grey.100',
              whiteSpace: 'normal',
              textAlign: 'center',
              overflow: 'hidden',
              opacity: i === focusedCard ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }}
          >
            {card.date && (
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {card.date}
              </Typography>
            )}
            {card.description && (
              <Typography variant="body2">{card.description}</Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
