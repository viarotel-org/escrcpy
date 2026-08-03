/**
 * Tracks scroll position and auto-scrolls a container on content updates.
 *
 * Behaviour:
 *  · User at bottom  → new content scrolls instantly.
 *  · User scrolls away → a **single, non-resettable** timer arms.
 *  · Timer fires after `resumeTimeout` → smooth-scroll back to bottom.
 *  · User returns manually → timer cancelled.
 *
 * The timer is intentionally never reset by content changes — once armed it
 * fires exactly once, which is the core fix for the previous "timer starvation"
 * bug in streaming scenarios.
 */
export function useAutoScroll({
  container,
  contentSource,
  threshold = 30,
  resumeTimeout = 0,
}) {
  const isAtBottom = ref(true)

  // ── Scroll tracking ──────────────────────────────────────────────────────
  // useScroll auto-binds / unbinds the scroll listener as container changes.
  const { arrivedState } = useScroll(container, {
    offset: { bottom: threshold },
    throttle: 100,
  })

  // Default "at bottom" so the initial content paint triggers an auto-scroll
  // rather than immediately arming the resume timer.
  watch(() => arrivedState.bottom, (v) => {
    isAtBottom.value = v
  })

  // ── One-shot resume timer ────────────────────────────────────────────────
  // useTimeoutFn auto-cleans on scope dispose.
  const {
    start: armResume,
    stop: disarmResume,
    isPending: resumeArmed,
  } = useTimeoutFn(
    () => {
      if (!isAtBottom.value) {
        scrollToBottom('smooth')
      }
    },
    resumeTimeout,
    { immediate: false },
  )

  // Arm only on the edge transition  true → false.
  // Disarm when the user scrolls back to the bottom.
  watch(isAtBottom, (now, was) => {
    if (now) {
      disarmResume()
    }
    else if (was && resumeTimeout > 0) {
      armResume()
    }
  })

  // ── Scroll helpers ───────────────────────────────────────────────────────
  let rafId = 0

  function scrollToBottom(behavior = 'auto') {
    const el = container.value

    if (!el) {
      return
    }

    if (behavior === 'smooth') {
      el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior })
    }
    else {
      // RAF-batch rapid calls during streaming to avoid layout thrash.
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight
      })
    }
  }

  onUnmounted(() => cancelAnimationFrame(rafId))

  // ── Content change handler ───────────────────────────────────────────────
  function notifyContentChange() {
    nextTick(() => {
      if (isAtBottom.value) {
        scrollToBottom('auto')
      }
      else if (resumeTimeout > 0 && !resumeArmed.value) {
        // Timer not running → arm it once.  Subsequent content changes while
        // it is pending will see resumeArmed === true and skip.
        armResume()
      }
    })
  }

  if (contentSource) {
    watch(contentSource, notifyContentChange)
  }

  return {
    isAtBottom: readonly(isAtBottom),
    scrollToBottom,
    notifyContentChange,
  }
}
